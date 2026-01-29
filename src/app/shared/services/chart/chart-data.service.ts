import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';

interface PopularityPoint {
  name: string;         // recipe name
  avg_rating: number;
  rating_count: number;
  servings: number;
}

interface CorrelationEntry {
  name: string; // Name of the row (e.g., "prep_time", "cook_time", etc.)
  series: {
    name: string;  // Column name (same set of values as row)
    value: number; // Correlation coefficient
  }[];
}

@Injectable({ providedIn: 'root' })
export class ChartDataService {
  private GPT_API_URL = `${environment.apiUrl}/data/recipe-rating`;
  private GPT_CORRELATION_API_URL = `${environment.apiUrl}/data/correlation`;

  constructor(
    private http: HttpClient
  ) {}

  // fetch recipe ratings data from the server
  fetchRecipeRatingsData() {
    return this.http.get<PopularityPoint[]>(this.GPT_API_URL);
  }

    // fetch correlation data for recipe ratings
  fetchRecipeRatingsCorrelation() {
    return this.http.get<CorrelationEntry[]>(this.GPT_CORRELATION_API_URL);
  }
}
