import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * 🔐 GUARD : AUTHENTIFICATION SIMPLE
 * Vérifie si l'utilisateur possède un jeton pour accéder aux pages privées
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('transport_token') : null;

  if (token) {
    return true;
  }

  // Redirection vers login si non connecté
  console.log('⚠️ Accès refusé : utilisateur non connecté');
  return router.createUrlTree(['/auth/login']);
};

/**
 * 👑 GUARD : ADMINISTRATION
 * Vérifie si l'utilisateur a le rôle ROLE_ADMIN
 */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  // 1. On récupère les données brutes du localStorage pour une vérification instantanée
  const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('transport_user') : null;

  if (userData) {
    try {
      const user = JSON.parse(userData);
      
      // 2. Extraction et normalisation du rôle (pour gérer "ADMIN" ou "ROLE_ADMIN")
      const role = user.role ? user.role.toString().toUpperCase() : '';

      if (role.includes('ADMIN')) {
        console.log('✅ AdminGuard : Accès autorisé (Rôle ADMIN détecté)');
        return true;
      }
    } catch (e) {
      console.error('Erreur lors du parsing des données utilisateur dans le Guard', e);
    }
  }

  // 3. Si on arrive ici : connecté mais pas admin OU non connecté
  console.log('❌ AdminGuard : Accès refusé (Pas de rôle ADMIN)');
  
  // Si l'utilisateur est quand même connecté (token présent), on l'envoie vers voyages
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('transport_token') : null;
  if (token) {
    return router.createUrlTree(['/voyages']);
  }

  // Sinon, retour au login
  return router.createUrlTree(['/auth/login']);
};