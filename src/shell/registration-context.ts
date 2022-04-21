import { createContext } from "react";
import { registration } from "core";

export const RegistrationState = createContext<typeof registration.init | null>(
  null
);
export const RegistrationEvents = createContext<{
  submit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  update: {
    email: (value: string) => Promise<void>;
    password: (value: string) => Promise<void>;
  };
} | null>(null);
