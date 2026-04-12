import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { VoyageService } from '../../../core/services/VoyageService';
import { BusService } from '../../../core/services/BusService';
import { AuthService } from '../../../core/services/auth.service';
import { Bus, Voyage } from '../../../core/models';
import { VoyageRequest } from '../../../core/models/index';

@Component({
  selector: 'app-voyage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './liste.html'
})
export class VoyageComponent implements OnInit {
  // --- INJECTIONS ---
  private fb = inject(FormBuilder);
  private voyageService = inject(VoyageService);
  private busService = inject(BusService);
  public auth = inject(AuthService);

  // --- ÉTATS (Signals) ---
  voyages = signal<Voyage[]>([]);
  listeDesBus = signal<Bus[]>([]);
  chargement = signal(false);
  modalOuvert = signal(false);
  voyageEnEdition = signal<Voyage | null>(null);
  enregistrement = signal(false);

  // --- FORMULAIRE ---
  formVoyage = this.fb.group({
    villeDepart: ['', [Validators.required, Validators.minLength(2)]],
    villeArrivee: ['', [Validators.required, Validators.minLength(2)]],
    dateDepart: ['', Validators.required],
    dateArrivee: ['', Validators.required],
    prix: [5000, [Validators.required, Validators.min(100)]],
    busId: [null as number | null, Validators.required],
    compagnie: ['General Express'],
    nombrePlaces: [{ value: 0, disabled: true }] 
  });

  // --- FILTRES COMPUTED ---
  
  // Pour le CLIENT : Uniquement les voyages à venir
  voyagesFuturs = computed(() => {
    const maintenant = new Date().getTime();
    return this.voyages().filter(v => new Date(v.dateDepart).getTime() >= maintenant);
  });

  // Pour l'ADMIN : Filtrer les bus exploitables
  busDisponibles = computed(() => {
    const idBusActuel = this.voyageEnEdition()?.bus?.id;
    return this.listeDesBus().filter(bus => 
      bus.statut === 'DISPONIBLE' || bus.id === idBusActuel
    );
  });

  ngOnInit(): void {
    this.chargerDonnees();
    if (this.auth.estAdmin()) {
      this.chargerBus();
    }
    this.ecouterChangementBus();
  }

  /**
   * CHARGEMENT DES VOYAGES
   * Selon le rôle, on appelle la route admin ou la route publique
   */
  chargerDonnees(): void {
    this.chargement.set(true);
    
    // Si connecté ET admin -> listerTout (historique)
    // Sinon (Client ou Visiteur) -> listerDisponibles
    const requete$ = (this.auth.estConnecte() && this.auth.estAdmin())
      ? this.voyageService.listerTous() 
      : this.voyageService.listerDisponibles();

    requete$.subscribe({
      next: (data) => {
        this.voyages.set(data);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error("Erreur de chargement:", err);
        this.voyages.set([]);
        this.chargement.set(false);
      }
    });
  }

  /**
   * MISE À JOUR DYNAMIQUE DU FORMULAIRE
   * Quand l'admin choisit un bus, on récupère sa capacité automatiquement
   */
  ecouterChangementBus(): void {
    this.formVoyage.get('busId')?.valueChanges.subscribe(busId => {
      if (busId) {
        const busSelectionne = this.listeDesBus().find(b => b.id === Number(busId));
        if (busSelectionne) {
          this.formVoyage.patchValue({ nombrePlaces: busSelectionne.capacite });
        }
      }
    });
  }

  chargerBus(): void {
    this.busService.listerTous().subscribe({
      next: (bus) => this.listeDesBus.set(bus),
      error: (err) => console.error("Erreur bus:", err)
    });
  }

  // --- ACTIONS MODAL ---

  ouvrirModal(): void {
    this.voyageEnEdition.set(null);
    this.formVoyage.reset({ prix: 5000, compagnie: 'General Express', nombrePlaces: 0 });
    this.modalOuvert.set(true);
  }

  fermerModal(): void { 
    this.modalOuvert.set(false);
    this.voyageEnEdition.set(null);
  }

  editerVoyage(voyage: Voyage): void {
    this.voyageEnEdition.set(voyage);
    this.formVoyage.patchValue({
      villeDepart: voyage.villeDepart,
      villeArrivee: voyage.villeArrivee,
      dateDepart: voyage.dateDepart ? voyage.dateDepart.substring(0, 16) : '',
      dateArrivee: voyage.dateArrivee ? voyage.dateArrivee.substring(0, 16) : '',
      prix: voyage.prix,
      compagnie: voyage.compagnie,
      busId: voyage.bus?.id || null,
      nombrePlaces: voyage.nombrePlaces
    });
    this.modalOuvert.set(true);
  }

  sauvegarder(): void {
    if (this.formVoyage.invalid) {
      this.formVoyage.markAllAsTouched();
      return;
    }

    this.enregistrement.set(true);
    const values = this.formVoyage.getRawValue();
    
    const payload: VoyageRequest = {
      villeDepart: values.villeDepart!,
      villeArrivee: values.villeArrivee!,
      dateDepart: values.dateDepart!,
      dateArrivee: values.dateArrivee!,
      prix: Number(values.prix),
      compagnie: values.compagnie || 'General Express',
      nombrePlaces: Number(values.nombrePlaces),
      bus: { id: Number(values.busId) }
    };

    const currentId = this.voyageEnEdition()?.id;
    const action = currentId 
      ? this.voyageService.modifier(currentId, payload)
      : this.voyageService.creer(payload);

    action.subscribe({
      next: () => {
        this.chargerDonnees();
        this.fermerModal();
        this.enregistrement.set(false);
      },
      error: (err) => {
        this.enregistrement.set(false);
        alert(err.error?.message || "Erreur lors de l'enregistrement");
      }
    });
  }

  supprimerVoyage(id: number | undefined): void {
    if (!id || !confirm('Voulez-vous vraiment supprimer ce voyage ?')) return;
    this.voyageService.supprimer(id).subscribe({
      next: () => this.voyages.update(list => list.filter(v => v.id !== id)),
      error: () => alert("Erreur lors de la suppression.")
    });
  }

  // --- HELPERS DESIGN ---
  badgeStatut(statut: string): string {
    if (!statut) return 'bg-gray-100 text-gray-800';
    switch (statut.toUpperCase()) {
      case 'DISPONIBLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLET': return 'bg-red-100 text-red-800 border-red-200';
      case 'ANNULE': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  }
}