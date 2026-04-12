// src/app/pages/auth/register/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // Assure-toi que le fichier existe ou retire cette ligne
})
export class RegisterComponent {
  // --- Injections ---
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // --- États (Signals) ---
  chargement = signal(false);
  erreur = signal('');
  isPasswordVisible = signal(false); // <--- Ajouté pour corriger ton erreur

  // --- Formulaire ---
  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER'] 
  });

  /**
   * Alterne la visibilité du mot de passe (utilisé par l'icône oeil dans le HTML)
   */
  togglePassword(): void {
    this.isPasswordVisible.update(v => !v);
  }

  /**
   * Vérifie si un champ est invalide pour l'affichage CSS (utilisé dans le HTML)
   */
  inv(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Soumission du formulaire d'inscription
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set('');

    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/voyages']);
      },
      error: (err) => {
        this.chargement.set(false);
        // On récupère le message d'erreur du backend s'il existe
        this.erreur.set(err.error?.message || "Erreur lors de l'inscription");
      }
    });
  }
}