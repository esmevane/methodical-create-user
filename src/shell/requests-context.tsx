import { createContext } from "react";
import { RequestHandlers } from "./types";

export const Requests = createContext<RequestHandlers | null>(null);
