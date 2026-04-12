import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tickets`;

  /**
   * Admin/Agent : Lister tous les tickets du système
   */
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Générer un nouveau ticket suite à une réservation
   * CORRECTION : Ton controller attend /generer/{reservationId} en POST
   */
  generer(reservationId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generer/${reservationId}`, {});
  }

  /**
   * Télécharger ou imprimer le ticket en format PDF (Blob)
   * CORRECTION : Ton controller utilise /{id}/imprimer
   */
  imprimerPdf(ticketId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${ticketId}/imprimer`, { 
      responseType: 'blob' 
    });
  }

  /**
   * Optionnel : Trouver un ticket par son ID (pour les détails)
   */
  trouverParId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}