import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private url = environment.apiURL + '/cities'; // L'URL de ton API pour les villes

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la ville par ID
  getCityById(cityId: number): Observable<any> {
    return this.http.get(`${this.url}/${cityId}`);
  }

  // Méthode pour récupérer toutes les villes (optionnel)
  getAllCities(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
