export interface RequestHandlers {
  register?: (options: { email: string; password: string }) => Promise<void>;
}
