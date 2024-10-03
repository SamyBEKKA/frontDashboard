import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url = environment.apiURL + '/articles';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les articles
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url); // Aucun token requis
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `${token}`,
      });
    } else {
      return new HttpHeaders();
    }
  }
  // // Méthode pour récupérer plusieurs articles via des URLs
  // getArticlesByUrls(urls: string[]): Observable<Article[]> {
  //   const requests: Observable<Article>[] = urls.map(url => this.http.get<Article>(url));
  //   return forkJoin(requests); // Attend que toutes les requêtes soient terminées avant de retourner le tableau d'articles
  // }
}
