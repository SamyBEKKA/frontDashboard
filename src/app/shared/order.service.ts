import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiListResponse, Order } from './auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.apiURL + '/orders';

  constructor(private http: HttpClient) {}

  // Créer une commande avec le modèle Hydra
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.url, order, { headers: this.getAuthHeaders() });
  }

  // Ajouter ici les en-têtes d'authentification avec le token
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`
    });
  }

  // Récupérer les commandes de l'utilisateur connecté
  getOrders(userId: string): Observable<ApiListResponse<Order>> {
    return this.http.get<ApiListResponse<Order>>(`${this.url}?user_id=${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
