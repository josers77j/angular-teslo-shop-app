import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./components/admin-dashboard-component/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page.component/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page.component/product-admin-page.component";
import { IsAdminGuard } from "@auth/guards/is-admin.guard";

export const AdminDashboardRoutes: Routes = [
  {
    path: "",
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: "products",
        component: ProductsAdminPageComponent,
      },
      {
        path: "products/:id",
        component: ProductAdminPageComponent,
      },
      {
        path: "**",
        redirectTo: "products",
      },
    ],
  },
];

export default AdminDashboardRoutes;
