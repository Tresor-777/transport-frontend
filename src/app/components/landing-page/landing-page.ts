import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPageComponent {
  // Liste fictive pour l'affichage initial
  villes = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Kribi'];
}