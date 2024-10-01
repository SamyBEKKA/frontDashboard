import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IToken } from './auth';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiURL + '/users';
  private loginUrl = environment.apiURL + '/login_check';
  
  constructor(private http: HttpClient, private router:Router) {}

  // Méthode pour effectuer la connexion
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
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
    if(this.getToken()){
      return true;
    } else {
      return false
    }
  }
  
  // Déconnexion
  logout():void{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  
}
