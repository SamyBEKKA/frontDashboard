import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiListResponse, Item } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url = environment.apiURL + '/items';

  constructor(private http: HttpClient) {}

  // Créer un item avec le modèle Hydra
  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.url, item, { headers: this.getAuthHeaders() });
  }

  // Ajouter ici les en-têtes d'authentification avec le token
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${token}`
    });
  }

  // Récupérer les items
  getItems(): Observable<ApiListResponse<Item>> {
    return this.http.get<ApiListResponse<Item>>(this.url, { headers: this.getAuthHeaders() });
  }

}
