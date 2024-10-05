import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiListResponse, Status } from './auth';


@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private url = environment.apiURL + '/statuses';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<ApiListResponse<Status>> {
    return this.http.get<ApiListResponse<Status>>(this.url); // Aucun token requis
  }
}
