import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  if (localStorage.getItem("loggedUserRole") === "Admin") {
    return true;
  } else {
    router.navigateByUrl("/homepage")
    return false;
  }
};
