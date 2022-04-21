import { RegistrationProvider } from "./registration-provider";

export function Shell(props: React.PropsWithChildren<unknown>) {
  return <RegistrationProvider>{props.children}</RegistrationProvider>;
}

export * from "./hooks";
