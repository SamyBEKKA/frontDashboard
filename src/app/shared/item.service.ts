import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url = environment.apiURL + '/orders';

  constructor(private http: HttpClient) {}

  isUserLoggedIn(): boolean {
    // Logique pour vérifier si l'utilisateur est connecté
    return !!localStorage.getItem('token');
  }

  createOrder(selectedArticles: any[], totalPrice: number): Observable<any> {
    // Logique pour créer une commande
    return this.http.post(this.url, { articles: selectedArticles, total: totalPrice });
  }
}
