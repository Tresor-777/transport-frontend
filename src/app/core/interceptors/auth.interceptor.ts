// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // DEBUG amélioré
  console.log(`[Interceptor] Appel vers : ${req.url}`);

  // On n'ajoute le token QUE si on l'a ET que ce n'est pas une requête de login/register
  const isAuthRequest = req.url.includes('/auth/');

  if (token && !isAuthRequest) {
    const authReq = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json' // Bonne pratique pour éviter certains bugs 403/406
      }
    });
    return next(authReq);
  }

  return next(req);
};