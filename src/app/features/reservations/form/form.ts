import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  // --- SIGNALS ---
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
    numeroCni: ['', [Validators.required]], // ✅ Ajouté
    nombrePlaces: [1, [Validators.required, Validators.min(1)]]
  });

  // Calcul du prix total réactif
  prixTotal = computed(() => {
    const v = this.voyage();
    // On utilise valueChanges transformé en signal ou on reste sur le form.value
    // Pour les signaux, on peut aussi utiliser toSignal(this.form.valueChanges)
    const nb = this.form.get('nombrePlaces')?.value || 0;
    return v ? v.prix * nb : 0;
  });

  ngOnInit() {
    const voyageId = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('voyageId');
    if (voyageId) {
      this.chargerVoyage(+voyageId);
    }
    
    // ✅ CORRECTION : Accès au signal currentUser() au lieu de currentUserValue
    const user = this.auth.currentUser(); 
    if (user) {
      this.form.patchValue({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        numeroCni: (user as any).numeroCni || '' // ✅ On remplit la CNI si dispo
      });
    }
  }

 private chargerVoyage(id: number) {
  this.voyageService.trouverParId(id).subscribe({
    next: (v) => {
      this.voyage.set(v);
      
      // On récupère le contrôle "nombrePlaces"
      const nbPlacesCtrl = this.form.get('nombrePlaces');
      
      if (nbPlacesCtrl) {
        // ✅ On ajoute la limite dynamique : pas plus que v.placesDisponibles
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
  const user = this.auth.currentUser(); // 👈 On récupère l'utilisateur connecté

  // ✅ PAYLOAD COMPLET : On ajoute explicitement le voyageurId
  const payload: ReservationRequest = {
    voyageId: this.voyage()!.id,
    nombrePlaces: values.nombrePlaces,
    // --- Infos de contact ---
    nomVoyageur: values.nom,
    prenomVoyageur: values.prenom,
    emailVoyageur: values.email,
    telephoneVoyageur: values.telephone,
    numeroCni: values.numeroCni
  };

  this.reservationService.creer(payload).subscribe({
    next: (res) => {
      this.succes.set("Réservation enregistrée !Redirection vers vos réservations...");
      this.chargement.set(false);
      
      setTimeout(() => {
        this.router.navigate(['/mes-reservations']);
      }, 1500);
    },
    error: (err) => {
      console.error("Erreur Backend:", err);
      this.erreur.set(err.error?.message || "Erreur lors de la réservation.");
      this.chargement.set(false);
    }
  });
}

  // Helper pour les classes d'erreur CSS (ex: [class.is-invalid]="inv('nom')")
  inv(field: string): boolean {
    const f = this.form.get(field);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }
}