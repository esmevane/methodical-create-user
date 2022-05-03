import { Requests } from "./requests-context";
import { RequestHandlers } from "./types";

export function RequestProvider({
  children,
  ...requests
}: React.PropsWithChildren<RequestHandlers>) {
  return <Requests.Provider value={requests}>{children}</Requests.Provider>;
}
