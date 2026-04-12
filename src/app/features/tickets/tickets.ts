import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../core/services/TicketService';
import { Ticket } from '../../core/models';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css']
})
export class TicketsComponent implements OnInit {
  private ticketSvc = inject(TicketService);
  private route     = inject(ActivatedRoute);

  tickets           = signal<Ticket[]>([]);
  chargement        = signal(true);
  generant          = signal(false);
  impression        = signal<number | null>(null);
  erreur            = signal('');
  succes            = signal('');
  
  // Identifiant saisi manuellement ou récupéré de l'URL
  reservationIdInput: number | null = null;

  ngOnInit(): void {
    this.chargerTickets();
    
    // Si on arrive depuis la page de paiement, on pré-remplit l'ID
    const id = this.route.snapshot.queryParams['reservationId'];
    if (id) {
      this.reservationIdInput = +id;
    }
  }

  /**
   * Charge la liste de tous les tickets émis
   */
  chargerTickets(): void {
    this.ticketSvc.listerTous().subscribe({
      next: (data: any) => {
        this.tickets.set(data);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false)
    });
  }

  /**
   * Déclenche la création d'un nouveau ticket à partir d'une réservation
   */
 // Dans tickets.ts
generer(): void {
  if (!this.reservationIdInput) return;

  this.generant.set(true);
  this.erreur.set('');
  this.succes.set('');

  this.ticketSvc.generer(this.reservationIdInput).subscribe({
    next: (listeTickets: Ticket[]) => { // On reçoit une liste
      const nb = listeTickets.length;
      this.succes.set(`Succès : ${nb} ticket(s) généré(s) avec succès.`);
      this.generant.set(false);
      this.chargerTickets(); 
      this.reservationIdInput = null;
    },
    error: (e: any) => {
      this.erreur.set(e.error?.message || 'Erreur lors de la génération.');
      this.generant.set(false);
    }
  });
}

  /**
   * Télécharge le ticket au format PDF
   */
  imprimerPdf(ticket: Ticket): void {
    this.impression.set(ticket.id);

    this.ticketSvc.imprimerPdf(ticket.id).subscribe({
      next: (blob: Blob) => {
        // Création d'un lien temporaire pour le téléchargement
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TICKET-${ticket.numeroTicket}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyage
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.impression.set(null);
        this.chargerTickets(); // Pour mettre à jour l'état "imprimé"
      },
      error: () => {
        this.erreur.set("Erreur lors de la génération du PDF.");
        this.impression.set(null);
      }
    });
  }
}