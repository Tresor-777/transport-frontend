import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { ReservationService } from '../../../core/services/ReservationService';
import { AuthService } from '../../../core/services/auth.service';
import { Reservation } from '../../../core/models';

@Component({
  selector: 'app-reservations-liste',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste.html'
})
export class ReservationsListeComponent implements OnInit {
  // Injections de dépendances
  private reservationService = inject(ReservationService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // État de l'application avec les Signals (Angular 17+)
  reservations = signal<Reservation[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.chargerMesReservations();
  }

  /**
   * Récupère la liste des réservations depuis le backend
   */
  chargerMesReservations(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    this.reservationService.getMesReservations().subscribe({
      next: (data) => {
        console.log('Données reçues :', data);
        // On trie pour avoir les plus récentes en haut
        const sortedData = data.sort((a, b) => {
          return new Date(b.dateReservation || 0).getTime() - new Date(a.dateReservation || 0).getTime();
        });
        this.reservations.set(sortedData);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.erreur.set("Impossible de charger vos réservations. Le serveur est peut-être indisponible.");
        this.chargement.set(false);
      }
    });
  }

  /**
   * Vérifie si la date du voyage est passée par rapport à l'heure actuelle
   */
  isVoyagePasse(dateDepart: string | Date | undefined): boolean {
    if (!dateDepart) return false;
    return new Date(dateDepart) < new Date();
  }

  /**
   * Redirige l'utilisateur vers la page de paiement
   * @param id ID de la réservation
   */
  allerAuPaiement(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/paiements', id]);
    } else {
      console.error("Impossible de payer : ID de réservation manquant");
    }
  }

  /**
   * Gère l'impression ou le téléchargement du ticket
   */
  imprimerTicket(res: Reservation): void {
    console.log("Génération du ticket pour la référence :", res.reference);
    // Optionnel : tu peux utiliser window.print() ou un service PDF ici
    window.print();
  }

  /**
   * Retourne les styles CSS Tailwind selon le statut de la réservation
   */
  getBadgeClass(statut: string | undefined): string {
    if (!statut) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    const s = statut.toUpperCase();
    switch (s) {
      case 'PAYE':
      case 'PAYÉ':
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'ANNULEE':
      case 'ANNULÉ':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'EN_ATTENTE':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
  }
}