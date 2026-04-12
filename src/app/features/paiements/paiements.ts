import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { PaiementService } from '../../core/services/PaiementService';
import { ReservationService } from '../../core/services/ReservationService';
import { AuthService } from '../../core/services/auth.service'; 
import { ModePaiement, Paiement, Reservation } from '../../core/models';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiements.html',
  styleUrls: ['./paiements.css']
})
export class PaiementsComponent implements OnInit {
  private paiementSvc = inject(PaiementService);
  private reservationSvc = inject(ReservationService);
  private authSvc = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  paiements = signal<Paiement[]>([]);
  reservation = signal<Reservation | null>(null);
  chargement = signal(false);
  erreur = signal('');
  succes = signal('');

  modes: ModePaiement[] = ['ORANGE_MONEY', 'MOBILE_MONEY', 'CARTE_BANCAIRE'];

  form = this.fb.group({
    reservationId: [null as number | null, Validators.required],
    modePaiement: ['' as ModePaiement | '', Validators.required],
    referenceTransaction: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.rafraichirHistorique();
    
    // Récupération ID depuis l'URL (ex: /paiements/12 ou /paiements?reservationId=12)
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const idFromQuery = this.route.snapshot.queryParams['reservationId'];
    const finalId = idFromRoute || idFromQuery;

    if (finalId) {
      this.form.patchValue({ reservationId: +finalId });
      this.chargerReservation(); 
    }
  }

  rafraichirHistorique(): void {
    this.paiementSvc.listerTous().subscribe({
      next: (d) => this.paiements.set(d),
      error: (err) => console.error('Erreur historique', err)
    });
  }

  chargerReservation(): void {
    const id = this.form.get('reservationId')?.value;
    if (!id) return;

    this.reservationSvc.trouverParId(+id).subscribe({
      next: (r) => {
        this.reservation.set(r);
        // On vérifie si déjà payée (soit boolean, soit statut string)
        if (r.payee || r.statut === 'PAYEE') {
          this.erreur.set('Cette réservation est déjà réglée.');
          this.form.disable();
        } else {
          this.erreur.set('');
          this.form.enable();
        }
      },
      error: () => {
        this.reservation.set(null);
        this.erreur.set('Réservation introuvable.');
      }
    });
  }

  onSubmit(): void {
    // 1. Vérification de sécurité
    if (this.form.invalid || !this.reservation()) return;

    this.chargement.set(true);
    this.erreur.set('');
    this.succes.set('');

    // 2. Préparation du payload pour le Backend
    // Important : On structure l'objet 'reservation' pour correspondre au @ManyToOne de Spring
    const rawValue = this.form.getRawValue();
    const payload = {
      montant: this.reservation()?.montantTotal,
      modePaiement: rawValue.modePaiement,
      referenceTransaction: rawValue.referenceTransaction,
      statut: 'REUSSI', // Statut par défaut après succès front
      reservation: { id: rawValue.reservationId }, // Envoi de l'objet pour JPA
      datePaiement: new Date().toISOString()
    };

    // 3. Appel au service
    this.paiementSvc.effectuerPaiement(payload as any).subscribe({
      next: () => {
        this.succes.set('Paiement réussi ! Redirection...');
        this.chargement.set(false);
        this.form.reset();
        this.reservation.set(null);
        this.rafraichirHistorique();

        setTimeout(() => {
          this.router.navigate(['/mes-reservations']);
        }, 2000);
      },
      error: (e) => {
        this.chargement.set(false);
        // Gestion de l'erreur Hibernate/SQL ou métier
        const message = e.error?.message || 'Erreur technique. Vérifiez vos IDs ou votre connexion.';
        this.erreur.set(message);
      }
    });
  }

  badgeStatut(s: string): string {
    const mapping: Record<string, string> = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'REUSSI': 'bg-green-100 text-green-800',
      'VALIDE': 'bg-green-100 text-green-800',
      'ECHOUE': 'bg-red-100 text-red-800',
      'REMBOURSE': 'bg-gray-100 text-gray-800'
    };
    return mapping[s] || 'bg-blue-100 text-blue-800';
  }
}