import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  // --- PARTIE ADMIN (Routes commençant par /admin dans ton Java) ---

  /**
   * Créer une notification (Admin)
   * Correspond à : POST /api/notifications/admin
   */
  creer(notification: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin`, notification);
  }

  /**
   * Lister toutes les notifications (Admin)
   * Correspond à : GET /api/notifications/admin
   */
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin`);
  }

  /**
   * Lister les notifications non envoyées (Admin)
   * Correspond à : GET /api/notifications/admin/non-envoyees
   */
  listerNonEnvoyees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/non-envoyees`);
  }

  /**
   * Envoi spécifique par ID (Admin)
   * Correspond à : POST /api/notifications/admin/{id}/envoyer
   */
  envoyer(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/${id}/envoyer`, {});
  }

  /**
   * Envoie toutes les notifications (Admin)
   * ATTENTION : Vérifie que ton Java accepte "envoyer-toutes" (avec un 'es')
   * Correspond à : POST /api/notifications/admin/envoyer-toutes
   */
  envoyerToutes(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/envoyer-toutes`, {});
  }

  /**
   * Supprimer une notification (Admin)
   * Correspond à : DELETE /api/notifications/admin/{id}
   */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }

  // --- PARTIE UTILISATEUR ---

  /**
   * Liste les notifications pour un utilisateur précis
   * Correspond à : GET /api/notifications/utilisateur/{id}
   */
  listerParUtilisateur(utilisateurId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
}