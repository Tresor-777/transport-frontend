import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BusService } from '../../core/services/BusService';
import { Bus } from '../../core/models';

@Component({
  selector: 'app-bus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bus.html',
  styleUrls: ['./bus.css']
})
export class BusComponent implements OnInit {
  private busSvc = inject(BusService);
  private fb = inject(FormBuilder);

  // Signaux pour l'état de l'UI
  listeDesBus = signal<Bus[]>([]);
  chargement = signal(false);
  enregistrement = signal(false);
  modalOuvert = signal(false);

  // Formulaire Réactif
  formBus = this.fb.group({
    id: [null as number | null],
    immatriculation: ['', [Validators.required]],
    modele: ['', [Validators.required]],
    capacite: [70, [Validators.required, Validators.min(1)]],
    statut: ['DISPONIBLE']
  });

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement.set(true);
    this.busSvc.listerTous().subscribe({
      next: (data) => {
        this.listeDesBus.set(data);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false)
    });
  }

  ouvrirModal(bus?: Bus): void {
    if (bus) {
      this.formBus.patchValue(bus);
    } else {
      this.formBus.reset({ capacite: 70, statut: 'DISPONIBLE' });
    }
    this.modalOuvert.set(true);
  }

  fermerModal(): void {
    this.modalOuvert.set(false);
  }

  sauvegarder(): void {
    if (this.formBus.invalid) return;

    this.enregistrement.set(true);
    
    const formValues = this.formBus.value;
    const donneesPretes = {
      ...formValues,
      capacite: Number(formValues.capacite) 
    };

    if (donneesPretes.id) {
      // MODIFICATION
      this.busSvc.modifier(donneesPretes.id, donneesPretes as Bus).subscribe({
        next: () => this.finaliserAction(),
        error: (err) => {
          console.error("Erreur modification:", err);
          this.enregistrement.set(false);
        }
      });
    } else {
      // CRÉATION (on retire l'ID)
      const { id, ...nouveauBus } = donneesPretes; 
      this.busSvc.creer(nouveauBus as Bus).subscribe({
        next: () => this.finaliserAction(),
        error: (err) => {
          console.error("Erreur création:", err);
          this.enregistrement.set(false);
        }
      });
    }
  }

  supprimer(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce bus ?')) {
      this.busSvc.supprimer(id).subscribe({
        next: () => this.chargerDonnees(),
        error: (err) => console.error("Erreur suppression:", err)
      });
    }
  }

  private finaliserAction(): void {
    this.enregistrement.set(false);
    this.fermerModal();
    this.chargerDonnees();
  }
}