import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Navbar -->
    <nav *ngIf="auth.estConnecte()" class="bg-blue-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <div class="flex items-center gap-8">
            <a routerLink="/voyages" class="flex items-center gap-2 text-white font-bold text-lg">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
              
              <span class="text-white text-xl font-bold tracking-tight">
                TransPort <span class="text-red-400">Express</span>
              </span>
            </a>

            <!-- Nav links -->
            <div class="hidden md:flex items-center gap-1">
              <a routerLink="/voyages" routerLinkActive="bg-blue-800"
                class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Voyages
              </a>
              <a routerLink="/reservations" routerLinkActive="bg-blue-800"
                class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Réservations
              </a>
              <a routerLink="/paiements" routerLinkActive="bg-blue-800"
                class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Paiements
              </a>
              <a routerLink="/tickets" routerLinkActive="bg-blue-800"
                class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Tickets
              </a>

              <!-- Lien Notifications pour l'utilisateur -->
               <!-- 🔔 CLOCHE DE NOTIFICATION : Uniquement pour les NON-ADMINS -->
<a *ngIf="!auth.estAdmin()" 
   routerLink="/notification" 
   routerLinkActive="bg-blue-800"
   class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 relative">
  <div class="relative">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    <span class="absolute -top-1 -right-1 flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
  </div>
  <span>Notifications</span>
</a>



              <!-- Dropdown Admin -->
              <div class="relative" *ngIf="auth.estAdmin()">
                <button (click)="menuAdmin.set(!menuAdmin())"
                  class="text-blue-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                  Admin
                  <svg class="w-4 h-4 transition-transform" [class.rotate-180]="menuAdmin()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div *ngIf="menuAdmin()"
                  class="absolute top-10 left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-44 z-50">
                  <a routerLink="/admin/dashboard" (click)="menuAdmin.set(false)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    Dashboard
                  </a>
                  <a routerLink="/admin/utilisateurs" (click)="menuAdmin.set(false)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    Utilisateurs
                  </a>
                  <a routerLink="/admin/notifications" (click)="menuAdmin.set(false)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    Notifications
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- User info + logout -->
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-white text-sm font-bold leading-tight">
                {{ auth.currentUser()?.prenom }} {{ auth.currentUser()?.nom }}
              </p>
              
              <!-- CORRECTION : Utilisation de .role au lieu de .roles?.[0] -->
              <span class="inline-block text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider mt-1"
                [ngClass]="auth.estAdmin() ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-400 text-white border border-blue-300'">
                {{ auth.currentUser()?.role?.replace('ROLE_', '') || 'MEMBRE' }}
              </span>
            </div>
            
            <!-- STYLE LOGOUT GARDÉ À L'IDENTIQUE -->
            <button (click)="auth.logout()"
              class="flex items-center gap-1.5 bg-blue-800 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition-all shadow-inner">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Quitter</span>
            </button>
          </div>

        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  menuAdmin = signal(false);
}