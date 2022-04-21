import { rest } from "msw";
import { screen } from "@testing-library/react";
import events from "@testing-library/user-event";
import { renderWithShell, server } from "test-utils";

import { CreateUser } from "./create-user";

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
