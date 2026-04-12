import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notification, TypeNotification } from '../../../core/models';
import { NotificationService } from '../../../core/services/NotificationService';
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent implements OnInit {
  private notificationSvc = inject(NotificationService);
  private fb = inject(FormBuilder);

  notifications = signal<Notification[]>([]);
  chargement = signal(false);
  chargementListe = signal(true);
  erreur = signal('');
  succes = signal('');
  filtre = signal<'toutes' | 'non-envoyees'>('toutes');

  types: TypeNotification[] = ['EMAIL', 'SMS', 'SYSTEME'];

  form = this.fb.group({
    sujet: ['', Validators.required],
    message: ['', Validators.required],
    destinataire: ['', Validators.required],
    type: ['' as TypeNotification | '', Validators.required]
  });

  ngOnInit(): void {
    this.charger();
  }

  /**
   * Charge les notifications en fonction du filtre actif
   */
  charger(): void {
    this.chargementListe.set(true);
    const obs = this.filtre() === 'non-envoyees'
      ? this.notificationSvc.listerNonEnvoyees()
      : this.notificationSvc.listerTous();

    obs.subscribe({
      next: (d: any) => {
        this.notifications.set(d);
        this.chargementListe.set(false);
      },
      error: (e: any) => {
        this.chargementListe.set(false);
      }
    });
  }

  /**
   * Change le filtre et recharge la liste
   */
  filtrer(f: 'toutes' | 'non-envoyees'): void {
    this.filtre.set(f);
    this.charger();
  }

  /**
   * Crée une nouvelle notification (en attente d'envoi)
   */
  creer(): void {
    if (this.form.invalid) return;
    this.chargement.set(true);
    this.erreur.set('');
    this.succes.set('');

    this.notificationSvc.creer(this.form.value as any).subscribe({
      next: () => {
        this.succes.set('Notification créée avec succès !');
        this.chargement.set(false);
        this.form.reset();
        this.charger();
      },
      error: (e: any) => {
        this.erreur.set(e.error?.message || 'Une erreur est survenue');
        this.chargement.set(false);
      }
    });
  }

  /**
   * Envoie une notification spécifique
   */
  envoyer(n: Notification): void {
    this.notificationSvc.envoyer(n.id).subscribe({
      next: () => {
        this.succes.set('Notification envoyée !');
        this.charger();
      }
    });
  }

  /**
   * Envoie toutes les notifications en attente
   */
  envoyerToutes(): void {
    this.notificationSvc.envoyerToutes().subscribe({
      next: () => {
        this.succes.set('Toutes les notifications ont été envoyées !');
        this.charger();
      }
    });
  }

  /**
   * Supprime une notification
   */
  supprimer(n: Notification): void {
    if (!confirm('Voulez-vous vraiment supprimer cette notification ?')) return;
    this.notificationSvc.supprimer(n.id).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(x => x.id !== n.id));
      }
    });
  }

  /**
   * Retourne la couleur de fond en fonction du type de notification
   */
  iconBg(type: TypeNotification): string {
    const m: Record<TypeNotification, string> = {
      EMAIL: 'bg-blue-500',
      SMS: 'bg-green-500',
      SYSTEME: 'bg-purple-500'
    };
    return m[type] || 'bg-gray-500';
  }
}