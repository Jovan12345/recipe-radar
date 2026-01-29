import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';

export interface GPTResponse {
  action: 'fetch_recipes' | 'add_items' | 'delete_items';
  sql?: string;
  params?: {
    ingredient_name?: string;
    quantity?: number;
    unit?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private GPT_API_URL = `${environment.apiUrl}/generate-sql`;

  constructor(private http: HttpClient) {}

  sendToGPT(question: string): Observable<GPTResponse> {
    return this.http.post<GPTResponse>(this.GPT_API_URL, { question });
  }
}
