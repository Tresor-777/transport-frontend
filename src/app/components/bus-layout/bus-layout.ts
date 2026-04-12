import { Component, OnInit, inject } from '@angular/core'; // Ajout de inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Import du Router
import { ReservationService } from '../../core/services/ReservationService';

@Component({
  selector: 'app-bus-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bus-layout.html',
  styleUrl: './bus-layout.css'
})
export class BusLayout implements OnInit {
  
  // Syntaxe moderne avec inject()
  private reservationService = inject(ReservationService);
  private router = inject(Router);

  voyageId = 1; 
  sieges = Array.from({ length: 40 }, (_, i) => i + 1);
  siegesOccupes: number[] = [];
  siegeSelectionne: number | null = null;

  voyageur = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numeroCni: '',
    dateNaissance: ''
  };

  ngOnInit(): void {
    this.chargerSieges();
  }

  chargerSieges() {
    this.reservationService.getSiegesOccupes(this.voyageId).subscribe({
      next: (data) => this.siegesOccupes = data,
      error: (err) => console.error("Erreur chargement sièges", err)
    });
  }

  isOccupied(num: number): boolean {
    return this.siegesOccupes.includes(num);
  }

  selectSiege(num: number) {
    if (!this.isOccupied(num)) {
      this.siegeSelectionne = num;
    }
  }

  confirmerReservation() {
    if (!this.siegeSelectionne) {
      alert("Veuillez choisir un siège d'abord");
      return;
    }

    const payload = {
      voyageId: this.voyageId,
      numeroSiege: this.siegeSelectionne,
      voyageur: this.voyageur
    };

    this.reservationService.creer(payload).subscribe({
      next: (res) => {
        // La réservation est créée en BDD avec le statut EN_ATTENTE
        alert("Réservation enregistrée ! Passage au paiement...");
        
        // Redirection vers la page de paiement avec l'ID de la réservation
        // Route attendue : /paiement/12
        this.router.navigate(['/paiement', res.id]); 
      },
      error: (err) => {
        alert("Erreur lors de la réservation : " + (err.error?.message || "Serveur indisponible"));
      }
    });
  }
}