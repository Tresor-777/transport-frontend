import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur JWT : 
 * Ajoute automatiquement le token d'authentification à chaque requête HTTP
 * sortante vers ton API de transport.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Récupération du token stocké lors de la connexion
  const token = localStorage.getItem('token');

  // 2. Si le token existe, on clone la requête pour y ajouter le Header Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // On envoie la requête modifiée
    return next(authReq);
  }

  // 3. Si pas de token (ex: page de login), on envoie la requête telle quelle
  return next(req);
};