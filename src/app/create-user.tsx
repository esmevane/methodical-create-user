import { useRegistrationEvents, useRegistrationState } from "shell";

export function CreateUser() {
  const state = useRegistrationState();
  const events = useRegistrationEvents();
  const submitting = state.status.form === "working";
  const formInvalid = [state.status.email, state.status.password].includes(
    "failure"
  );

  if (state.status.form === "success") {
    return <>Registration success</>;
  }

  return (
    <form onSubmit={events.submit}>
      <div>{state.status.form === "failure" ? state.errors.form : null}</div>
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
        <div>
          {state.status.email === "success" ? "Email valid" : null}
          {state.status.email === "working" ? "Checking email" : null}
          {state.status.email === "failure" ? state.errors.email : null}
        </div>
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
        <div>
          {state.status.password === "success" ? "Password valid" : null}
          {state.status.password === "working" ? "Checking password" : null}
          {state.status.password === "failure" ? state.errors.password : null}
        </div>
      </label>
      <button type="submit" disabled={formInvalid || submitting}>
        {submitting ? "Submitting" : "Submit"}
      </button>
    </form>
  );
}
