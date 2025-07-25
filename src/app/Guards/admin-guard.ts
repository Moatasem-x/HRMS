import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.authenticated() && (authService.getRole() === "Admin" || authService.getRole() === "HR")) {
    return true;
  } 
  else if (authService.authenticated()) {
    router.navigate(['/empdash']);
    return false;
  }
  router.navigate(['/login']);
  return false;
};
