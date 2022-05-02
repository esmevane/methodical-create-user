import { useRegistrationEvents, useRegistrationState } from "shell";

export function CreateUser() {
  const state = useRegistrationState();
  const events = useRegistrationEvents();

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
          {state.status.password === "failure" ? state.errors.password : null}
        </div>
      </label>
      <button
        type="submit"
        disabled={[state.status.email, state.status.password].includes(
          "failure"
        )}
      >
        Submit
      </button>
    </form>
  );
}
