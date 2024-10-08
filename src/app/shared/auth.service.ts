import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CityService } from './city.service';
import { User } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiURL + '/users';
  private loginUrl = environment.apiURL + '/login_check';
  
  constructor(
    private http: HttpClient, 
    private router:Router, 
    private cityService: CityService // Injection du CityService
    ) {}

  // Méthode pour effectuer la connexion
  // login(credentials: { username: string; password: string }): Observable<any> {
  //   return this.http.post(this.loginUrl, credentials);
  // }
    // Méthode pour effectuer la connexion
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      tap((response: any) => {
        // Sauvegarder le token dans le localStorage
        this.saveToken(response.token);
        
        // Sauvegarder également des informations supplémentaires si disponibles dans la réponse
        const decodedToken = this.decodeToken(response.token);
        if (decodedToken) {
          const userInfo = {
            user_id: decodedToken.user_id,  // Sauvegarder l'ID utilisateur (ajustez selon votre token)
            username: decodedToken.username, // Sauvegarder l'email ou nom d'utilisateur
            roles: decodedToken.roles,       // Sauvegarder les rôles
          };
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        }
      })
    );
  }

  
  // Sauvegarder le token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Créer un utilisateur (s'inscrire)
  createUser(userData: any): Observable<any> {
    return this.http.post(this.url, userData);
  }

  // Vérifier si l'utilisateur est connecté
  isLogged(): boolean {
    return !!this.getToken() && !!localStorage.getItem('user_info');
  }
  
  // Déconnexion
  logout():void{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  
  // Récupérer la ville de l'utilisateur via son ID
  getUserCity(cityId: number): Observable<any> {
    return this.cityService.getCityById(cityId); // Appel au service City
  }

  // Méthode pour décoder le token JWT et extraire les informations
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Récupérer la partie payload du token JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      console.log('Contenu du token décodé :', payload);
      return payload;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }


  // Méthode pour récupérer l'utilisateur via son ID
  getUserById(id: string): Observable<User> {
    const url = `${environment.apiURL}/users/${id}`;
    return this.http.get<User>(url);  // Retourne un Observable de type User
  }

  getUserDetails(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiURL}/users/${username}`);
  }
  
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${environment.apiURL}/users?email=${email}`);
  }
  
  // Méthode pour récupérer l'utilisateur via son username (avec type User)
  getUserByUsername(username: string): Observable<User> {
    const url = `${environment.apiURL}/users?username=${username}`;
    return this.http.get<User>(url);  // Retourne un Observable de type User
  }

  // Méthode pour récupérer l'utilisateur courant (depuis le token)
  getCurrentUser(): any {
    const token = this.getToken();  // Récupérer le token
    
    if (token) {
      const decodedToken = this.decodeToken(token);
    
      // Vérifier s'il y a un `username` ou un autre identifiant pertinent dans le token
      if (decodedToken && decodedToken.username) {
        return {
          username: decodedToken.username,  // Utiliser `username` à la place de `user_email`
          id: decodedToken.user_id || decodedToken.sub || null,  // Récupérer l'ID utilisateur (si présent)
          roles: decodedToken.roles,        // Récupérer les rôles
        };
      } else {
        console.error('Token invalide ou username manquant');
        return null;
      }
    } else {
      console.error('Aucun token trouvé');
      return null;
    }
  }
  
  
  
  

}
