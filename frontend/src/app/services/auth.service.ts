import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:5239/api/auth/login';
  private registerUrl = 'http://localhost:5239/api/auth/register';

  constructor(private http: HttpClient) { }

  register(userInfo: any): Observable<any> {
    return this.http.post(this.registerUrl, userInfo);
  }
  
  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const userRole = decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      return userRole === 'Administrator';
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return false;
    }
  }
}