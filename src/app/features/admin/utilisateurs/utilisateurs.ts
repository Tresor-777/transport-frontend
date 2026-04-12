import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utilisateur } from '../../../core/models';
import { UtilisateurService } from '../../../core/services/UtilisateurService';
@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utilisateurs.html',
  styleUrls: ['./utilisateurs.css']
})
export class UtilisateursComponent implements OnInit {
  private utilisateurSvc = inject(UtilisateurService);

  utilisateurs = signal<Utilisateur[]>([]);
  chargement = signal(true);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.utilisateurSvc.listerTous().subscribe({
      next: (d:any) => {
        this.utilisateurs.set(d);
        this.chargement.set(false);
      },
      error: (e: any) => {
        this.chargement.set(false);
      }
    });
  }

  activer(u: Utilisateur): void {
    this.utilisateurSvc.activer(u.id).subscribe({
      next: () => {
        // Mise à jour locale du signal pour une interface réactive
        this.utilisateurs.update(list => 
          list.map(x => x.id === u.id ? { ...x, actif: true } : x)
        );
      }
    });
  }

  desactiver(u: Utilisateur): void {
    this.utilisateurSvc.desactiver(u.id).subscribe({
      next: () => {
        // Mise à jour locale du signal
        this.utilisateurs.update(list => 
          list.map(x => x.id === u.id ? { ...x, actif: false } : x)
        );
      }
    });
  }

  supprimer(u: Utilisateur): void {
    const confirmation = confirm(`Voulez-vous vraiment supprimer l'utilisateur ${u.nom} ${u.prenom} ?`);
    if (!confirmation) return;

    this.utilisateurSvc.supprimer(u.id).subscribe({
      next: () => {
        this.utilisateurs.update(list => list.filter(x => x.id !== u.id));
      }
    });
  }
}