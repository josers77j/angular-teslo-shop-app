import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { firstValueFrom } from "rxjs";

export const NotAuthenticatedGuard: CanMatchFn = async (
  _route: Route,
  _segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if (isAuthenticated) {
    router.navigateByUrl("/");
    return false;
  }
  return true;
};
