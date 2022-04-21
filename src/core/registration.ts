type Events =
  | { type: "registration-success" }
  | { type: "registration-failure"; value: string }
  | { type: "email-valid" }
  | { type: "email-invalid"; value: string }
  | { type: "password-valid" }
  | { type: "password-invalid"; value: string }
  | { type: "update-email"; value: string }
  | { type: "update-password"; value: string };

export const init = {
  values: { email: "", password: "" },
  errors: { email: "", password: "", form: "" },
};

export function update(state: typeof init, event: Events) {
  switch (event.type) {
    case "registration-success":
      return { ...state, errors: { ...state.errors, form: "" } };
    case "password-valid":
      return { ...state, errors: { ...state.errors, password: "" } };
    case "email-valid":
      return { ...state, errors: { ...state.errors, email: "" } };
    case "registration-failure":
      return { ...state, errors: { ...state.errors, form: event.value } };
    case "update-password":
      return { ...state, values: { ...state.values, password: event.value } };
    case "update-email":
      return { ...state, values: { ...state.values, email: event.value } };
    case "password-invalid":
      return { ...state, errors: { ...state.errors, password: event.value } };
    case "email-invalid":
      return { ...state, errors: { ...state.errors, email: event.value } };
    default:
      return state;
  }
}
