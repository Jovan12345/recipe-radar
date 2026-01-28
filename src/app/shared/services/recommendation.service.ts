import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:8000'; // Backend URL

  constructor(private http: HttpClient) {}

  getRecommendations(profileId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend`, { profile_id: profileId });
  }

  getPopularRecommendations(): Observable<any>{
    return this.http.get(`${this.apiUrl}/recommend/popular`)
  }
}
