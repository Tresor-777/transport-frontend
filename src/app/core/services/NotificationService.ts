import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  /**
   * SUPPRIMER : Efface une notification de la base de données.
   * C'est la méthode qui manquait pour corriger ton erreur actuelle.
   */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * ENVOYER TOUTES : Traite la file d'attente
   */
  envoyerToutes(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/envoyer-tout`, {});
  }

  /**
   * ENVOYER : Envoi spécifique par ID
   */
  envoyer(notificationId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${notificationId}/envoyer`, {});
  }

  /**
   * CRÉER : Enregistre une nouvelle notification
   */
  creer(notification: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, notification);
  }

  /**
   * LISTER : Toutes les notifications (avec alias pour éviter les erreurs de genre)
   */
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listerToutes(): Observable<any[]> {
    return this.listerTous();
  }

  listerNonEnvoyees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/non-envoyees`);
  }

  // --- AFFICHAGE UI ---
  success(message: string) { alert('✅ SUCCESS: ' + message); }
  error(message: string) { alert('❌ ERREUR: ' + message); }
}