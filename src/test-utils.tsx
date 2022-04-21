import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import { Shell } from "shell";

export const server = setupServer(
  rest.post("/registrations", (_request, response, context) => {
    return response(context.status(201));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

afterEach(() => server.resetHandlers());

export async function renderWithShell(ui: any) {
  return render(<Shell>{ui}</Shell>);
}
