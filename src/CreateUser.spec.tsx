import * as yup from "yup";
import { response, rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import events from "@testing-library/user-event";
import { useEffect, useState } from "react";

const server = setupServer(
  rest.post("/registrations", (_request, response, context) => {
    return response(context.status(201));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

afterEach(() => server.resetHandlers());

function CreateUser() {
  const [formError, setFormError] = useState("");
  const hasFormError = !!formError;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const hasEmailError = !!emailError;

  useEffect(() => {
    yup
      .string()
      .email()
      .validate(email)
      .then(() => setEmailError(""))
      .catch(() => setEmailError("Email is invalid"));
  }, [email]);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const hasPasswordError = !!passwordError;

  useEffect(() => {
    yup
      .string()
      .min(4)
      .validate(password)
      .then(() => setPasswordError(""))
      .catch(() => setPasswordError("Password is too short"));
  }, [password]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        setFormError("");

        const response = await fetch("/registration", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          setFormError("We encountered an error while registering");
        }
      }}
    >
      <legend>Create user</legend>
      <div>{hasFormError ? formError : null}</div>
      <label>
        <div>Email</div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>{hasEmailError ? emailError : null}</div>
      </label>
      <label>
        <div>Password</div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>{hasPasswordError ? passwordError : null}</div>
      </label>
      <button type="submit" disabled={hasEmailError || hasPasswordError}>
        Submit
      </button>
    </form>
  );
}

async function renderWithShell(ui: any) {
  return render(ui);
}

test("it renders", async () => {
  await renderWithShell(<CreateUser />);
  await screen.findByText("Create user");
});

test("it rejects invalid emails", async () => {
  const email = "person";

  await renderWithShell(<CreateUser />);
  await events.type(await screen.findByPlaceholderText("Email"), email);

  await screen.findByText("Email is invalid");
});

test("it rejects short passwords", async () => {
  const password = "blah";

  await renderWithShell(<CreateUser />);
  await events.type(await screen.findByPlaceholderText("Password"), password);

  await screen.findByText("Password is too short");
});

test("it disables submission on invalid forms", async () => {
  const email = "blarg";
  const password = "blah";

  await renderWithShell(<CreateUser />);
  await events.type(await screen.findByPlaceholderText("Email"), email);
  await events.type(await screen.findByPlaceholderText("Password"), password);
  const button = await screen.findByText("Submit");

  expect(button).toBeDisabled();
});

test("it displays request errors", async () => {
  const email = "person@example.com";
  const password = "1 super secret password";

  const handler = rest.post("/registration", (request, response, context) => {
    return response(context.status(400));
  });

  server.use(handler);

  await renderWithShell(<CreateUser />);
  await events.type(await screen.findByPlaceholderText("Email"), email);
  await events.type(await screen.findByPlaceholderText("Password"), password);
  events.click(await screen.findByText("Submit"));

  await screen.findByText("We encountered an error while registering");
});

test("it submits a user registration", async () => {
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
  events.click(await screen.findByText("Submit"));

  await new Promise((resolve) => setTimeout(resolve, 16));

  expect(listener).toHaveBeenCalledWith({ email, password });
});
