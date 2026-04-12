import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private url = `${environment.apiUrl}/utilisateurs/admin`;
  private http = inject(HttpClient);

  // Liste de tous les utilisateurs inscrits
  getTousLesUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/liste`);
  }

  // Bannir ou activer un compte (toggle)
  modifierStatutCompte(id: number): Observable<any> {
    return this.http.patch<any>(`${this.url}/${id}/toggle-status`, {});
  }
}