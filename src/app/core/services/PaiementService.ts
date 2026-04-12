import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private readonly apiUrl = `${environment.apiUrl}/paiements`;
  private http = inject(HttpClient);

  /**
   * ✅ MÉTHODE UNIFIÉE :
   * Elle redirige vers la bonne route selon le besoin du composant.
   */
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * ✅ ACTION DE PAIEMENT : 
   * C'est celle qui valide la réservation après saisie de la réf OM/MoMo.
   */
  effectuerPaiement(donnees: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, donnees);
  }

  /**
   * ✅ HISTORIQUE PERSONNEL : 
   * Pour l'utilisateur connecté (évite les erreurs 403/500).
   */
  getMesPaiements(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${email}`);
  }

  /**
   * ✅ ADMIN : 
   * Pour ton tableau de bord administration.
   */
  getTransactionsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/transactions`);
  }

  /**
   * ✅ VÉRIFICATION : 
   * Utile pour savoir si une réservation a déjà un paiement lié.
   */
  trouverParReservation(reservationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation/${reservationId}`);
  }
}