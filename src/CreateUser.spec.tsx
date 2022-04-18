import { render, screen } from "@testing-library/react";

function CreateUser() {
  return <>Create user</>;
}

async function renderWithShell(ui: any) {
  return render(ui);
}

test("It renders", async () => {
  await renderWithShell(<CreateUser />);
  await screen.findByText("Create user");
});
