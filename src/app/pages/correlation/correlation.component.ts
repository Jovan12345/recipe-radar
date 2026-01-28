// src/app/pages/charts/correlation/correlation.component.ts

import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Component, OnInit } from '@angular/core';

import { ChartDataService } from 'src/app/shared/services/chart/chart-data.service';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit {
  heatmapData: any[] = [];
  loading = true;
  error: string|null = null;

  // ngx-charts options
  view: [number,number] = [600, 400];
  xAxis = true; yAxis = true;
  showLegend = false;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Metric';
  showYAxisLabel = true;
  yAxisLabel = 'Metric';


  constructor(private chartData: ChartDataService) {}

  ngOnInit() {
    this.chartData.fetchRecipeRatingsCorrelation().subscribe({
      next: data => {
        console.log(data)
        this.heatmapData = data;
      },
      error: err => {
        console.log('error', err)
        this.error = err.message || 'Failed to load correlation data';
      },
      complete: () => {
        this.loading = false;

      }

    });
  }
}
