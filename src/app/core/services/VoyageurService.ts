import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoyageurService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/voyageurs`;

  /**
   * Récupère la liste de tous les voyageurs enregistrés
   */
  listerTous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Trouve un voyageur spécifique par son ID
   * (C'est la méthode que ton formulaire de réservation réclame)
   */
  trouverParId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Enregistre un nouveau voyageur
   */
  creer(voyageur: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, voyageur);
  }

  /**
   * Met à jour les informations d'un voyageur
   */
  modifier(id: number, voyageur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, voyageur);
  }

  /**
   * Supprime un voyageur
   */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}