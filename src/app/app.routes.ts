import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { logoutGuard } from './core/guards/logout.guard';
import { LandingPageComponent } from './components/landing-page/landing-page';

export const routes: Routes = [

  // 🏠 ACCUEIL
  { 
    path: '', 
    component: LandingPageComponent, 
    canActivate: [logoutGuard] 
  },

  // 🔐 AUTHENTIFICATION
  {
    path: 'auth',
   
    canActivate: [logoutGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
      }
    ]
  },

  // 🚍 VOYAGES & SÉLECTION DE SIÈGES
  {
    path: 'voyages',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/voyages/liste/liste').then(m => m.VoyageComponent)
      },
      {
        path: 'choix-siege/:voyageId', // On passe l'ID du voyage pour le plan de bus
        loadComponent: () => import('./components/bus-layout/bus-layout').then(m => m.BusLayout)
      }
    ]
  },

  // 📋 RÉSERVATIONS
  {
    path: 'reservations',
    canActivate: [authGuard],
    children: [
      {
        path: '', // Route pour voir toutes les réservations de l'utilisateur
        loadComponent: () => import('./features/reservations/liste/liste').then(m => m.ReservationsListeComponent)
      },
      {
        path: 'nouveau', // Route pour créer une nouvelle réservation
        loadComponent: () => import('./features/reservations/form/form').then(m => m.ReservationFormComponent)
      }
    ]
  },

 // 💳 PAIEMENTS
  {
    path: 'paiements',
    canActivate: [authGuard],
    children: [
      {
        path: '', // Route par défaut : /paiements
        loadComponent: () => import('./features/paiements/paiements').then(m => m.PaiementsComponent)
      },
      {
        path: ':id', // Route avec ID : /paiements/12 (utilise le même composant)
        loadComponent: () => import('./features/paiements/paiements').then(m => m.PaiementsComponent)
      }
    ]
  },

  // 🎟️ TICKETS
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tickets/tickets').then(m => m.TicketsComponent)
  },

 // 🔔 NOTIFICATIONS UTILISATEUR
{ 
  path: 'notifications', // Ajoute le 's' pour être cohérent avec ton routerLink
  canActivate: [authGuard],
  loadComponent: () => import('./features/notification/notification').then(m => m.NotificationsComponent) 
},

 
  // 🛠️ ADMINISTRATION
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.DashboardComponent)
    },
    {
      path: 'utilisateurs',
      loadComponent: () => import('./features/admin/utilisateurs/utilisateurs').then(m => m.UtilisateursComponent)
    },
    {
      path: 'bus',
      // Chemin corrigé selon ton dossier réel :
      loadComponent: () => import('./features/bus/bus').then(m => m.BusComponent)
    },
    {
      path: 'notifications',
      loadComponent: () => import('./features/admin/notifications/notifications').then(m => m.NotificationsComponent)
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},

  // ❌ 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFoundComponent)
  }
];