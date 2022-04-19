import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import events from "@testing-library/user-event";
import { useRef, useState } from "react";

const server = setupServer(
  rest.post("/registrations", (_request, response, context) => {
    return response(context.status(201));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

afterEach(() => server.resetHandlers());

function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await fetch("/registration", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      }}
    >
      <legend>Create user</legend>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Submit</button>
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
