import { inject } from "@angular/core";
import { CanMatchFn, Route, UrlSegment, Router } from "@angular/router";
import { AuthService } from "@auth/services/Auth.service";
import { firstValueFrom } from "rxjs";

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperamos a que se complete el check status
  await firstValueFrom(authService.checkStatus());

  return authService.isAdmin();
};