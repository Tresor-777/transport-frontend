import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Si tu as une interface Utilisateur, importe-la, sinon utilise 'any'
export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  statut: 'ACTIF' | 'INACTIF';
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/utilisateurs`;

  // Cette méthode est appelée dans ton dashboard et la liste des utilisateurs
  listerTous(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  trouverParId(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  // Utilisé dans utilisateurs.ts:35
  activer(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activer`, {});
  }

  // Utilisé dans utilisateurs.ts:46
  desactiver(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/desactiver`, {});
  }

  // Utilisé dans utilisateurs.ts:60
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  creer(utilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }
}