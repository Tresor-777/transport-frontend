import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // --- Injections ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- États (Signals) ---
  chargement = signal(false);
  erreur = signal<string | null>(null);
  isPasswordVisible = signal(false);

  // --- Formulaire ---
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]]
  });

  /**
   * Alterne la visibilité du mot de passe (utilisé par le bouton "œil")
   */
  togglePassword(): void {
    this.isPasswordVisible.update(v => !v);
  }

  /**
   * Soumission du formulaire de connexion
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    this.authService.login(this.form.value as any).subscribe({
      next: (res: AuthResponse) => {
        this.chargement.set(false);

        // 1. MISE À JOUR MANUELLE DU STORAGE (Sécurité pour les Guards)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('transport_token', res.token);
          localStorage.setItem('transport_user', JSON.stringify(res));
        }

        // 2. LOG DE DÉBOGAGE
        console.log('Connexion réussie. Rôle reçu :', res.role);

        // 3. LOGIQUE DE REDIRECTION SELON LA ROUTE
        // On transforme en majuscule pour éviter les erreurs de casse (ex: Admin vs ADMIN)
        const roleStr = res.role ? res.role.toString().toUpperCase() : '';

        if (roleStr.includes('ADMIN')) {
          console.log('Redirection vers le Dashboard Admin...');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('Redirection vers la page Voyages...');
          this.router.navigate(['/voyages']);
        }
      },
      error: (err) => {
        this.chargement.set(false);
        console.error('Erreur de connexion :', err);
        
        if (err.status === 401 || err.status === 403) {
          this.erreur.set("Email ou mot de passe incorrect.");
        } else {
          this.erreur.set("Erreur serveur. Veuillez réessayer plus tard.");
        }
      }
    });
  }

  /**
   * Utilitaire pour afficher les classes d'erreur dans le HTML
   */
  inv(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}