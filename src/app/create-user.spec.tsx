import { screen } from "@testing-library/react";
import events from "@testing-library/user-event";
import { renderWithShell } from "test-utils";

import { CreateUser } from "./create-user";

describe("CreateUser", () => {
  it("communicates when it validates emails", async () => {
    const email = "person";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);

    await screen.findByText("Checking email");
  });

  it("communicates valid emails", async () => {
    const email = "person@example.com";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);

    await screen.findByText("Email valid");
  });

  it("rejects invalid emails", async () => {
    const email = "person";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);

    await screen.findByText("Email is invalid");
  });

  it("communicates when it validates passwords", async () => {
    const password = "blah";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Password"), password);

    await screen.findByText("Checking password");
  });

  it("communicates valid passwords", async () => {
    const password = "blahshhh";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Password"), password);

    await screen.findByText("Password valid");
  });

  it("rejects short passwords", async () => {
    const password = "blah";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Password"), password);

    await screen.findByText("Password is too short");
  });

  it("disables submissions while submitting", async () => {
    const email = "blarg";
    const password = "blah";

    await renderWithShell(<CreateUser />);
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    const button = await screen.findByText("Submit");

    expect(button).toBeDisabled();
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

    const requests = {
      register: async (options: { email: string; password: string }) => {
        throw new Error("Network IO explosion!");
      },
    };

    await renderWithShell(<CreateUser />, { requests });
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    await events.click(await screen.findByText("Submit"));
    await screen.findByText("We encountered an error while registering");
  });

  it("disables submissions while submitting", async () => {
    const email = "person@example.com";
    const password = "1 super secret password";

    const requests = {
      register: async (options: { email: string; password: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 10_000_000));
      },
    };

    await renderWithShell(<CreateUser />, { requests });
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    await events.click(await screen.findByText("Submit"));
    const button = await screen.findByText("Submitting");

    expect(button).toBeDisabled();
  });

  it("submits a user registration", async () => {
    const email = "person@example.com";
    const password = "1 super secret password";
    const listener = jest.fn();

    const requests = {
      register: async (options: { email: string; password: string }) => {
        listener(options);
      },
    };

    await renderWithShell(<CreateUser />, { requests });
    await events.type(await screen.findByPlaceholderText("Email"), email);
    await events.type(await screen.findByPlaceholderText("Password"), password);
    await events.click(await screen.findByText("Submit"));
    await screen.findByText("Registration success");

    expect(listener).toHaveBeenCalledWith({ email, password });
  });
});
