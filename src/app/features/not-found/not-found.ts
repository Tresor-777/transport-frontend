import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p class="text-9xl font-bold text-blue-100">404</p>
      <h1 class="text-2xl font-bold text-gray-800 -mt-6">Page introuvable</h1>
      <p class="text-gray-500 mt-2 mb-6">La page que vous cherchez n'existe pas.</p>
      <a routerLink="/voyages" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  `
})
export class NotFoundComponent {}