import { useRegistrationForm } from "./hooks";
import { RegistrationEvents, RegistrationState } from "./registration-context";

export function RegistrationProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const [state, events] = useRegistrationForm();

  return (
    <RegistrationState.Provider value={state}>
      <RegistrationEvents.Provider value={events}>
        {children}
      </RegistrationEvents.Provider>
    </RegistrationState.Provider>
  );
}
