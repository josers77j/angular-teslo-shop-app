import { Routes } from "@angular/router";
import { AuthLayout } from "./layout/auth-layout/auth-layout";
import { LoginPageComponent } from "./pages/login-page-component/login-page.component";
import { RegisterPageComponent } from "./pages/register-page-component/register-page.component";
import { IsAdminGuard } from "./guards/is-admin.guard";

export const authRoutes: Routes = [
  {
    path: "",
    component: AuthLayout,

    children: [
      {
        path: "login",
        component: LoginPageComponent,
      },
      {
        path: "register",
        component: RegisterPageComponent,
      },
      {
        path: "**",
        component: LoginPageComponent,
      },
    ],
  },
];

export default authRoutes;
