import { Injectable, inject } from '@angular/core'; // On s'assure que inject est là
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VoyageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class VoyageService {
  // 1. On déclare la variable ici pour qu'elle soit accessible partout dans la classe
  private readonly apiUrl = 'http://localhost:8080/api/voyages';

  // 2. On utilise inject pour récupérer le HttpClient
  private http = inject(HttpClient);

  // VoyageService.ts
listerDisponibles(): Observable<any[]> {
  // Cette route est ouverte à tout le monde
  return this.http.get<any[]>(this.apiUrl); 
}

listerTous(): Observable<any[]> {
  // Cette route est réservée aux admins (403 pour les autres)
  return this.http.get<any[]>(`${this.apiUrl}/admin/all`);
}

  trouverParId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  creer(request: VoyageRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin`, request);
  }

  modifier(id: number, request: VoyageRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/${id}`, request);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }
}