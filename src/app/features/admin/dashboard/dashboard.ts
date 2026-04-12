import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// Vos services
import { VoyageService } from '../../../core/services/VoyageService';
import { ReservationService } from '../../../core/services/ReservationService';
import { PaiementService } from '../../../core/services/PaiementService';
import { UtilisateurService } from '../../../core/services/UtilisateurService';
import { BusService } from '../../../core/services/BusService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private voyageSvc = inject(VoyageService);
  private reservationSvc = inject(ReservationService);
  private paiementSvc = inject(PaiementService);
  private utilisateurSvc = inject(UtilisateurService);
  private busSvc = inject(BusService);

  chargement = signal(true);
  
  stats = signal({
    voyages: 0, 
    voyagesDisponibles: 0,
    reservations: 0, 
    reservationsEnAttente: 0,
    paiements: 0, 
    montantTotal: 0,
    utilisateurs: 0, 
    admins: 0,
    bus: 0 
  });

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement.set(true);

    // forkJoin lance tout en parallèle
    // .pipe(catchError) sur chaque appel évite qu'une seule erreur 500 ne bloque tout le Dashboard
    forkJoin({
      voyages: this.voyageSvc.listerTous().pipe(catchError(() => of([]))),
      reservations: this.reservationSvc.listerTous().pipe(catchError(() => of([]))),
      paiements: this.paiementSvc.listerTous().pipe(catchError(() => of([]))),
      utilisateurs: this.utilisateurSvc.listerTous().pipe(catchError(() => of([]))),
      bus: this.busSvc.listerTous().pipe(catchError(() => of([])))
    })
    .pipe(
      finalize(() => this.chargement.set(false)) // S'exécute QUOI QU'IL ARRIVE
    )
    .subscribe(res => {
      // Calcul des statistiques avec sécurité (|| [])
      const v = res.voyages || [];
      const r = res.reservations || [];
      const p = res.paiements || [];
      const u = res.utilisateurs || [];
      const b = res.bus || [];

      this.stats.set({
        voyages: v.length,
        voyagesDisponibles: v.filter((voy: any) => voy.statut === 'DISPONIBLE').length,
        reservations: r.length,
        reservationsEnAttente: r.filter((reser: any) => reser.statut === 'EN_ATTENTE').length,
        paiements: p.length,
        montantTotal: p.reduce((acc: number, item: any) => acc + (item.montant || 0), 0),
        utilisateurs: u.length,
        admins: u.filter((user: any) => user.role === 'ADMIN').length,
        bus: b.length
      });
    });
  }
}