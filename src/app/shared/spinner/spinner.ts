import { Component, Input } from '@angular/core';
// 1. Importer CommonModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  // 2. L'ajouter ici pour que *ngIf et [ngStyle] fonctionnent
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        [ngStyle]="{'width': size, 'height': size}"></div>
      <p *ngIf="texte" class="text-gray-500 text-sm mt-3">{{ texte }}</p>
    </div>
  `
})
export class SpinnerComponent {
  @Input() size = '40px';
  @Input() texte = '';
}
