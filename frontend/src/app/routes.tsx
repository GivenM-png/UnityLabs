import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { ApplicationWizard } from "./components/ApplicationWizard";
import { ForgotPassword } from "./components/ForgotPassword";
import { Root } from "./components/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "dashboard", Component: Dashboard },
      { path: "apply", Component: ApplicationWizard },
    ],
  },
]);
