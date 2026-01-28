import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Component, OnInit } from '@angular/core';

import { ChartDataService } from 'src/app/shared/services/chart/chart-data.service';

@Component({
  selector: 'app-rating-and-popularity',
  templateUrl: './rating-and-popularity.component.html',
  styleUrl: './rating-and-popularity.component.scss'
})
export class RatingAndPopularityComponent implements OnInit {
  bubbleData: any[] = [];
  uniqueY: number[] = [];
  error: any;
  loading = true;
  primaryColorScheme: Color = {
    domain: ['#FB8C00'],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  constructor(
    private denigraphicsService: ChartDataService
  ) { }

  ngOnInit(): void {

    this.denigraphicsService.fetchRecipeRatingsData().subscribe({
      next: (points) => {
        console.log('Demographics data points:', points);
        const data = [{
          name: 'Recipes',
          series: points.map(p => ({
            name: p.name,
            x: +p.avg_rating,
            y: Math.round(+p.rating_count),
            r: p.servings // scale radius (you can tweak)
          })).filter((v, i, a) =>
            a.findIndex(t => t.x === v.x && t.y === v.y) === i // remove exact duplicates
          )
        }];
        this.bubbleData = [...data];
        this.uniqueY = Array.from(new Set(data[0].series.map(s => s.y))).sort((a, b) => a - b);

        console.log('Processed bubble data:', this.bubbleData);
      },
      error: (error) => {
        console.error('Error fetching demographics data:', error);
        this.error = error;
      },
      complete: () => {
        console.log('Demographics data fetch complete');
        this.loading = false;
      }
    });
  }

  formatYAxisTicks(value: number): string {
    return Math.round(value).toString();
  }
}
