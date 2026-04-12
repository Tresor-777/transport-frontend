import { Component, Input } from '@angular/core';
// 1. Importez le module commun
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  // 2. Ajoutez-le ici
  imports: [CommonModule],
  template: `
    <div class="text-center py-20 text-gray-400">
      <p class="text-lg font-medium text-gray-500">{{ titre }}</p>
      
      <p *ngIf="sousTitre" class="text-sm mt-1">{{ sousTitre }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() titre = 'Aucun élément';
  @Input() sousTitre = '';
}