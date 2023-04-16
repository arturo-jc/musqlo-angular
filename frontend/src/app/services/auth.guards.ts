import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { map, take } from "rxjs";
import { AuthService } from "./auth.service";

export const checkAuth: CanActivateFn = (
  _route = inject(ActivatedRouteSnapshot),
  _state = inject(RouterStateSnapshot),
  authService = inject(AuthService)
) => {
  return authService.checkAuth();
}

export const isAuthenticated: CanActivateFn = (
  _route = inject(ActivatedRouteSnapshot),
  state = inject(RouterStateSnapshot),
  authService = inject(AuthService),
  router = inject(Router)
) => {
  return authService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      authService.redirectUrl = state.url;
      return router.createUrlTree([ '/login' ]);
    }),
  );
}

export const isDeauthenticated: CanActivateFn = (
  _route = inject(ActivatedRouteSnapshot),
  _state = inject(RouterStateSnapshot),
  authService = inject(AuthService),
  router = inject(Router)
) => {
  return authService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }
      return router.createUrlTree([ '/dashboard' ]);
    }));
}
