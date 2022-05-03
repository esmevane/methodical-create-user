import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import { Shell } from "shell";

export const server = setupServer(
  rest.post("/registration", (_request, response, context) => {
    return response(context.status(201));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

afterEach(() => server.resetHandlers());

type ShellProps = Parameters<typeof Shell>[0];

export async function renderWithShell(
  ui: any,
  shellProps?: Partial<ShellProps>
) {
  return render(<Shell {...shellProps}>{ui}</Shell>);
}
