import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

export const checkAuth: CanActivateFn = (
  _route = inject(ActivatedRouteSnapshot),
  _state = inject(RouterStateSnapshot),
  authService = inject(AuthService)
) => {
  return authService.checkAuth();
}
