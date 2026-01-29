import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRecommendations(profileId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend`, { profile_id: profileId });
  }

  getPopularRecommendations(): Observable<any>{
    return this.http.get(`${this.apiUrl}/recommend/popular`)
  }
}
