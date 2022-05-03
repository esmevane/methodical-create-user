import { useMemo } from "react";
import { RegistrationProvider } from "./registration-provider";
import { RequestProvider } from "./requests-provider";
import { RequestHandlers } from "./types";

interface ShellProps {
  requests?: RequestHandlers;
}

export function Shell(props: React.PropsWithChildren<ShellProps>) {
  const requests = useMemo(() => props.requests, []);
  return (
    <RequestProvider {...requests}>
      <RegistrationProvider>{props.children}</RegistrationProvider>
    </RequestProvider>
  );
}

export * from "./hooks";
