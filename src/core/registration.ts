type AsyncStatus = "idle" | "working" | "success" | "failure";

type Events =
  | { type: "registration-request" }
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
  status: {
    email: "idle" as AsyncStatus,
    password: "idle" as AsyncStatus,
    form: "idle" as AsyncStatus,
  },
};

export function update(state: typeof init, event: Events): typeof init {
  switch (event.type) {
    case "registration-success":
      return {
        ...state,
        errors: { ...state.errors, form: "" },
        status: { ...state.status, form: "success" },
      };
    case "password-valid":
      return {
        ...state,
        errors: { ...state.errors, password: "" },
        status: { ...state.status, password: "success" },
      };
    case "email-valid":
      return {
        ...state,
        errors: { ...state.errors, email: "" },
        status: { ...state.status, email: "success" },
      };

    case "registration-failure":
      return {
        ...state,
        errors: { ...state.errors, form: event.value },
        status: { ...state.status, form: "failure" },
      };
    case "password-invalid":
      return {
        ...state,
        errors: { ...state.errors, password: event.value },
        status: { ...state.status, password: "failure" },
      };
    case "email-invalid":
      return {
        ...state,
        errors: { ...state.errors, email: event.value },
        status: { ...state.status, email: "failure" },
      };

    case "registration-request":
      return {
        ...state,
        errors: { ...state.errors, form: "" },
        status: { ...state.status, form: "working" },
      };
    case "update-password":
      return {
        ...state,
        values: { ...state.values, password: event.value },
        status: { ...state.status, password: "working" },
      };
    case "update-email":
      return {
        ...state,
        values: { ...state.values, email: event.value },
        status: { ...state.status, email: "working" },
      };
    default:
      return state;
  }
}
