import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop'; // ✅ Import pour le calcul réactif

import { VoyageService } from '../../../core/services/VoyageService';
import { ReservationService } from '../../../core/services/ReservationService';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationRequest, Voyage } from '../../../core/models';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.html'
})
export class ReservationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private voyageService = inject(VoyageService);
  private reservationService = inject(ReservationService);
  public auth = inject(AuthService);

  // --- SIGNALS D'ÉTAT ---
  voyage = signal<Voyage | null>(null);
  chargement = signal<boolean>(false);
  erreur = signal<string | null>(null);
  succes = signal<string | null>(null);

  // --- FORMULAIRE ---
  form: FormGroup = this.fb.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.email]],
    telephone: ['', [Validators.required]],
    numeroCni: ['', [Validators.required]],
    nombrePlaces: [1, [Validators.required, Validators.min(1)]]
  });

  // ✅ CORRECTION MAJEURE : RÉACTIVITÉ EN TEMPS RÉEL
  // On crée un Signal qui "écoute" chaque changement de l'input nombrePlaces
  private nbPlacesChanges$ = this.form.get('nombrePlaces')!.valueChanges;
  nombrePlacesSignal = toSignal(this.nbPlacesChanges$, { initialValue: 1 });

  // Le computed se mettra à jour automatiquement dès que nombrePlacesSignal changera
  prixTotal = computed(() => {
    const v = this.voyage();
    // ✅ On utilise le signal : des parenthèses () sont obligatoires
    const nb = Number(this.nombrePlacesSignal() || 1);
    return v ? v.prix * nb : 0;
  });

  ngOnInit() {
    const voyageId = this.route.snapshot.paramMap.get('id') || 
                     this.route.snapshot.queryParamMap.get('voyageId');
    
    if (voyageId) {
      this.chargerVoyage(+voyageId);
    }
    
    const user = this.auth.currentUser(); 
    if (user) {
      this.form.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        numeroCni: (user as any).numeroCni || '' 
      });
    }
  }

  private chargerVoyage(id: number) {
    this.voyageService.trouverParId(id).subscribe({
      next: (v) => {
        this.voyage.set(v);
        const nbPlacesCtrl = this.form.get('nombrePlaces');
        if (nbPlacesCtrl) {
          nbPlacesCtrl.setValidators([
            Validators.required, 
            Validators.min(1), 
            Validators.max(v.placesDisponibles) 
          ]);
          nbPlacesCtrl.updateValueAndValidity();
        }
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    const values = this.form.getRawValue();

    const payload: ReservationRequest = {
      voyageId: this.voyage()!.id,
      nombrePlaces: Number(values.nombrePlaces),
      nomVoyageur: values.nom,
      prenomVoyageur: values.prenom,
      emailVoyageur: values.email,
      telephoneVoyageur: values.telephone,
      numeroCni: values.numeroCni
    };

    this.reservationService.creer(payload).subscribe({
      next: (res: any) => {
        this.succes.set("Réservation réussie ! Redirection vers vos réservations...");
        this.chargement.set(false);
        
        // Redirection vers /reservations (Route correcte) après 1.5s
        setTimeout(() => {
          this.router.navigate(['/reservations']);
        }, 1500);
      },
      error: (err) => {
        console.error("Erreur Backend:", err);
        this.erreur.set(err.error?.message || "Erreur lors de la réservation.");
        this.chargement.set(false);
      }
    });
  }

  inv(field: string): boolean {
    const f = this.form.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }
}