import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  // L'URL de base pointe vers ton Controller Java @RequestMapping("/api/reservations")
  private readonly apiUrl = `${environment.apiUrl}/reservations`;

  /**
   * 🏗️ CRÉATION
   */
  creer(payload: any): Observable<any> {
    // Correspond à @PostMapping dans ReservationController
    return this.http.post<any>(this.apiUrl, payload);
  }

  // Alias pour la clarté dans le composant de réservation
  creerReservation(reservationData: any): Observable<any> {
    return this.creer(reservationData);
  }

  /**
   * 🔍 LECTURE ET AFFICHAGE (Le plus important pour toi ici)
   */

  // ✅ À UTILISER pour ta page "Mes Réservations"
  // Correspond à @GetMapping("/mes-reservations") dans ton Java
  getMesReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-reservations`);
  }

  // Pour l'administrateur : liste tout le monde
  // Correspond à @GetMapping sans chemin
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  trouverParId(id: number): Observable<any> {
    // Correspond à @GetMapping("/{id}")
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * 🚌 VOYAGES ET SIÈGES
   */
  getReservationsParVoyage(voyageId: number): Observable<any[]> {
    // Correspond à @GetMapping("/voyage/{voyageId}")
    return this.http.get<any[]>(`${this.apiUrl}/voyage/${voyageId}`);
  }

  getSiegesOccupes(voyageId: number): Observable<number[]> {
    // Correspond à @GetMapping("/voyage/{voyageId}/sieges-occupes")
    return this.http.get<number[]>(`${this.apiUrl}/voyage/${voyageId}/sieges-occupes`);
  }

  /**
   * ⚙️ ACTIONS (PAIEMENT / ANNULATION)
   */
  
  // ✅ Corrigé pour correspondre à @DeleteMapping("/{id}/annuler")
  annuler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/annuler`);
  }

  // ✅ Corrigé pour correspondre à @PostMapping("/{id}/payer")
  payer(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/payer`, {});
  }
}