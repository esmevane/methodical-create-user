import { CreateUser } from "app/create-user";
import React from "react";
import ReactDOM from "react-dom/client";
import { Shell } from "shell";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Shell>
      <CreateUser />
    </Shell>
  </React.StrictMode>
);
