import { CreateUser } from "app/create-user";
import React from "react";
import ReactDOM from "react-dom/client";
import { Shell } from "shell";

const requests = {
  register: async () => {},
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Shell requests={requests}>
      <CreateUser />
    </Shell>
  </React.StrictMode>
);
