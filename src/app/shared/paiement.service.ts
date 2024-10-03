import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiListResponse, Paiement } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private url = environment.apiURL + '/paiements'; // URL de l'API paiements

  constructor(private http: HttpClient) {}

  // Récupérer la liste des paiements avec Hydra
  getPaiements(): Observable<ApiListResponse<Paiement>> {
    return this.http.get<ApiListResponse<Paiement>>(this.url); // Aucun token requis
  }
}
