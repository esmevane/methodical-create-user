import * as yup from "yup";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { act, render, screen } from "@testing-library/react";
import events from "@testing-library/user-event";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const server = setupServer(
  rest.post("/registrations", (_request, response, context) => {
    return response(context.status(201));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

afterEach(() => server.resetHandlers());

type Events =
  | { type: "registration-success" }
  | { type: "registration-failure"; value: string }
  | { type: "email-valid" }
  | { type: "email-invalid"; value: string }
  | { type: "password-valid" }
  | { type: "password-invalid"; value: string }
  | { type: "update-email"; value: string }
  | { type: "update-password"; value: string };

const init = {
  values: { email: "", password: "" },
  errors: { email: "", password: "", form: "" },
};

function registration(state: typeof init, event: Events) {
  switch (event.type) {
    case "registration-success":
      return { ...state, errors: { ...state.errors, form: "" } };
    case "password-valid":
      return { ...state, errors: { ...state.errors, password: "" } };
    case "email-valid":
      return { ...state, errors: { ...state.errors, email: "" } };
    case "registration-failure":
      return { ...state, errors: { ...state.errors, form: event.value } };
    case "update-password":
      return { ...state, values: { ...state.values, password: event.value } };
    case "update-email":
      return { ...state, values: { ...state.values, email: event.value } };
    case "password-invalid":
      return { ...state, errors: { ...state.errors, password: event.value } };
    case "email-invalid":
      return { ...state, errors: { ...state.errors, email: event.value } };
    default:
      return state;
  }
}

function useRegistrationForm() {
  const [state, dispatch] = useReducer(registration, init);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch({ type: "registration-success" });

    const response = await fetch("/registration", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.values),
    });

    if (!response.ok) {
      dispatch({
        type: "registration-failure",
        value: "We encountered an error while registering",
      });
    }
  };

  const events = {
    update: {
      email: async (value: string) => {
        dispatch({ type: "update-email", value });

        try {
          await yup.string().email().validate(state.values.email);

          dispatch({ type: "email-valid" });
        } catch {
          dispatch({ type: "email-invalid", value: "Email is invalid" });
        }
      },
      password: async (value: string) => {
        dispatch({ type: "update-password", value });

        try {
          await yup.string().min(4).validate(state.values.password);

          dispatch({ type: "password-valid" });
        } catch {
          dispatch({
            type: "password-invalid",
            value: "Password is too short",
          });
        }
      },
    },
    submit,
  };

  return [state, events] as const;
}

const RegistrationState = createContext<typeof init | null>(null);
const RegistrationEvents = createContext<{
  submit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  update: {
    email: (value: string) => Promise<void>;
    password: (value: string) => Promise<void>;
  };
} | null>(null);

function useRegistrationEvents() {
  const events = useContext(RegistrationEvents);

  if (!events) {
    throw new Error(
      "useRegistrationEvents must be used within a RegistrationProvider"
    );
  }

  return events;
}

function useRegistrationState() {
  const state = useContext(RegistrationState);

  if (!state) {
    throw new Error(
      "useRegistrationState must be used within a RegistrationProvider"
    );
  }

  return state;
}

function RegistrationProvider({ children }: React.PropsWithChildren<unknown>) {
  const [state, events] = useRegistrationForm();

  return (
    <RegistrationState.Provider value={state}>
      <RegistrationEvents.Provider value={events}>
        {children}
      </RegistrationEvents.Provider>
    </RegistrationState.Provider>
  );
}

function CreateUser() {
  const state = useRegistrationState();
  const events = useRegistrationEvents();
  const hasFormError = !!state.errors.form;
  const hasEmailError = !!state.errors.email;
  const hasPasswordError = !!state.errors.password;

  return (
    <form onSubmit={events.submit}>
      <div>{hasFormError ? state.errors.form : null}</div>
      <label>
        <div>Email</div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={state.values.email}
            onChange={(event) => events.update.email(event.target.value)}
          />
        </div>
        <div>{hasEmailError ? state.errors.email : null}</div>
      </label>
      <label>
        <div>Password</div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={state.values.password}
            onChange={(event) => events.update.password(event.target.value)}
          />
        </div>
        <div>{hasPasswordError ? state.errors.password : null}</div>
      </label>
      <button type="submit" disabled={hasEmailError || hasPasswordError}>
        Submit
      </button>
    </form>
  );
}

function Shell(props: React.PropsWithChildren<unknown>) {
  return <RegistrationProvider>{props.children}</RegistrationProvider>;
}

async function renderWithShell(ui: any) {
  return render(<Shell>{ui}</Shell>);
}

describe("CreateUser", () => {
  it("rejects invalid emails", async () => {
    const email = "person";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);

    await screen.findByText("Email is invalid");
  });

  it("rejects short passwords", async () => {
    const password = "blah";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Password"), password);

    await screen.findByText("Password is too short");
  });

  it("disables submission on invalid forms", async () => {
    const email = "blarg";
    const password = "blah";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    const button = await screen.findByText("Submit");

    expect(button).toBeDisabled();
  });

  it("displays request errors", async () => {
    const email = "person@example.com";
    const password = "1 super secret password";

    const handler = rest.post("/registration", (request, response, context) => {
      return response(context.status(400));
    });

    server.use(handler);

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    await events.click(await screen.findByText("Submit"));
    await screen.findByText("We encountered an error while registering");
  });

  it("submits a user registration", async () => {
    const email = "person@example.com";
    const password = "1 super secret password";

    const listener = jest.fn();
    const handler = rest.post("/registration", (request, response, context) => {
      listener(request.body);
      return response(context.status(201));
    });

    server.use(handler);

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    await events.click(await screen.findByText("Submit"));

    expect(listener).toHaveBeenCalledWith({ email, password });
  });
});
