import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // --- INJECTIONS ---
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- CONSTANTES & URL ---
  private readonly TOKEN_KEY = 'transport_token';
  private readonly USER_KEY  = 'transport_user';
  private readonly url = `${environment.apiUrl}/auth`;

  // --- SIGNALS (État de l'utilisateur) ---
  private _currentUser = signal<AuthResponse | null>(this.chargerDepuisStorage());
  public currentUser = computed(() => this._currentUser());

  // --- GETTERS ---
  estConnecte(): boolean {
    return this._currentUser() !== null;
  }

  estAdmin(): boolean {
    const user = this._currentUser();
    return !!user?.role?.toUpperCase().includes('ADMIN');
  }

  getUserId(): number | null {
    const user = this._currentUser();
    return user ? user.id : null;
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- ACTIONS PRINCIPALES ---
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, request).pipe(
      tap(res => {
        this.sauvegarderSession(res);
        const route = this.estAdmin() ? '/admin/dashboard' : '/voyages';
        this.router.navigate([route]);
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, request).pipe(
      tap(res => {
        this.sauvegarderSession(res);
        this.router.navigate(['/voyages']);
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  // --- PERSISTENCE (Logique Interne) ---
  private sauvegarderSession(res: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    }
    this._currentUser.set(res);
  }

  private chargerDepuisStorage(): AuthResponse | null {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(this.USER_KEY);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}