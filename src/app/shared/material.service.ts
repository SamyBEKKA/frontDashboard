import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = `${environment.apiURL}/materials`;
  constructor(private http: HttpClient) {}


  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl); // Aucun token requis
  }

  // Méthode pour obtenir les en-têtes avec le token (s'il est disponible)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Récupère le token
    if (token) {
      return new HttpHeaders({
        Authorization: `${token}`, // Ajoute le token si l'utilisateur est connecté
      });
    } else {
      return new HttpHeaders(); // Pas de token si l'utilisateur est déconnecté
    }
  }
}
