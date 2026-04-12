import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bus } from '../../core/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BusService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bus`;

  // 1. Lister tous les bus
  listerTous(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.apiUrl);
  }

  // 2. Récupérer un bus par son ID
  obtenirParId(id: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.apiUrl}/${id}`);
  }

  // 3. Créer un nouveau bus (Résout votre erreur : La propriété 'creer' n'existe pas)
  creer(bus: Partial<Bus>): Observable<Bus> {
    return this.http.post<Bus>(this.apiUrl, bus);
  }

  // 4. Mettre à jour un bus
  modifier(id: number, bus: Partial<Bus>): Observable<Bus> {
    return this.http.put<Bus>(`${this.apiUrl}/${id}`, bus);
  }

  // 5. Supprimer un bus (Résout votre erreur : La propriété 'supprimer' n'existe pas)
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }
}