import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Mes Notifications</h1>
      <!-- Ton code de liste ici -->
    </div>
  `
})
export class NotificationsComponent {} // <-- INDISPENSABLE : le mot 'export'