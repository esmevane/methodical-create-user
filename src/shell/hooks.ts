import * as yup from "yup";
import { useContext, useReducer } from "react";
import { registration } from "core";

import { RegistrationEvents, RegistrationState } from "./registration-context";

export function useRegistrationForm() {
  const [state, dispatch] = useReducer(registration.update, registration.init);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch({ type: "registration-request" });

    const response = await fetch("/registration", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.values),
    });

    if (!response.ok) {
      return dispatch({
        type: "registration-failure",
        value: "We encountered an error while registering",
      });
    }

    dispatch({ type: "registration-success" });
  };

  const events = {
    update: {
      email: async (value: string) => {
        dispatch({ type: "update-email", value });

        try {
          await yup.string().email().validate(state.values.email);

          dispatch({ type: "email-valid" });
        } catch {
          dispatch({ type: "email-invalid", value: "Email is invalid" });
        }
      },
      password: async (value: string) => {
        dispatch({ type: "update-password", value });

        try {
          await yup.string().min(4).validate(state.values.password);

          dispatch({ type: "password-valid" });
        } catch {
          dispatch({
            type: "password-invalid",
            value: "Password is too short",
          });
        }
      },
    },
    submit,
  };

  return [state, events] as const;
}

export function useRegistrationEvents() {
  const events = useContext(RegistrationEvents);

  if (!events) {
    throw new Error(
      "useRegistrationEvents must be used within a RegistrationProvider"
    );
  }

  return events;
}

export function useRegistrationState() {
  const state = useContext(RegistrationState);

  if (!state) {
    throw new Error(
      "useRegistrationState must be used within a RegistrationProvider"
    );
  }

  return state;
}
