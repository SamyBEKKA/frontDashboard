import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiListResponse, Service } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private url = environment.apiURL + '/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ApiListResponse<Service>> {
    return this.http.get<ApiListResponse<Service>>(this.url); // Aucun token requis
  }

   // Ajoute ici les en-têtes d'authentification avec le token
   getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log("Token utilisé dans PrestationService:", token); // Vérifie ici aussi
    return new HttpHeaders({
      Authorization: `${token}`, // Ajoute le token ici
    });
  }

}
