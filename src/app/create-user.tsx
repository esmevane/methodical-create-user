import { useRegistrationEvents, useRegistrationState } from "shell";

export function CreateUser() {
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
