// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
  timestamp: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
  expiresIn?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'YOUR_BACKEND_API_URL'; // Replace with your actual API URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    const loginPayload: LoginRequest = {
      email: credentials.email,
      password: credentials.password,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginPayload, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            // Store authentication data
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Update authentication state
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    // Clear stored data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    
    // Update authentication state
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private checkAuthStatus(): void {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('currentUser');
    
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
}