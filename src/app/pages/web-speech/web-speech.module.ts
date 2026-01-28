import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { CorrelationComponent } from '../correlation/correlation.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from '../../shared/material/material.module';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { RatingAndPopularityComponent } from '../charts/rating-and-popularity/rating-and-popularity.component';
import { RecipeResultsComponent } from '../recepies/recipe-results.component';
import { RecommendedRecipeComponent } from '../recommended-recipes/recommended-recipe.component';
import { RouterModule } from '@angular/router';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { WebSpeechComponent } from './web-speech.component';

//
@NgModule({
  declarations: [
    WebSpeechComponent,
    ShoppingListComponent,
    RecipeResultsComponent,
    RecommendedRecipeComponent,
    RatingAndPopularityComponent,
    CorrelationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CarouselModule,
    NgxChartsModule,
    NgxGoogleAnalyticsModule.forRoot('G-LSVXXFZN89'),
    MaterialModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatExpansionModule,
    MatTooltipModule,
  ]
})
export class WebSpeechModule { }
