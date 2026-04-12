import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logoutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte()) {
    // On déconnecte l'utilisateur (suppression du token, etc.)
    authService.logout();
    
    // Optionnel : On peut laisser la navigation continuer vers la page demandée
    // ou forcer une redirection vers le login pour être sûr.
    return true; 
  }

  return true;
};