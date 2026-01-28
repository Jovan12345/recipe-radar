import { Component, OnInit } from '@angular/core';
import {
  RecipeRating,
  SupabaseService,
} from '../../shared/services/supabase/supabase.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { RecommendationService } from '../../shared/services/recommendation.service';

@Component({
  selector: 'app-recommended-recipe',
  templateUrl: './recommended-recipe.component.html',
  styleUrls: ['./recommended-recipe.component.scss'],
})
export class RecommendedRecipeComponent implements OnInit {
  recipes: any[] = [];
  loading = true;
  error: string | null = null;

  headerText = 'Our reccommendation for you';

  // in your component
  customOptions: OwlOptions = {
    margin: 16,
    nav: true, // show arrow nav
    dots: false, // hide dots
    navText: ['‹', '›'],
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 700,

    // 1) Base items count
    items: 3,

    // 2) Responsive overrides:
    responsive: {
      0: { items: 1 }, // on phones, no loop if 1 card
      400: { items: 2 }, // small tablets, no loop if 2 cards
      740: { items: 3 }, // medium screens, 3 cards, loop ok
      940: { items: 3 }, // desktops, 4 cards, loop ok
    },

    // 3) Optional: auto-width if your cards vary in width
    // autoWidth: false
  };

  constructor(
    private recommendationService: RecommendationService,
    private sbSvc: SupabaseService
  ) {}
  recipeRating: RecipeRating | null = null;

  async ngOnInit() {
    console.log('should call populaer recommendations');
    this.recommendationService.getPopularRecommendations().subscribe((data) => {
      console.log(data)
    });
    try {
      // 1️⃣ Get the currently signed-in user’s profile row (which has the numeric id)
      const { data: profile, error: profErr } = await this.sbSvc.getProfile();
      if (profErr || !profile) {
        this.error = 'Could not load your profile.';
        this.loading = false;
        return;
      }

      const { gender, age, city } = profile;
      if (!gender || !age || !city) {
        this.headerText = 'Please complete your profile to get recommendations';
        this.loading = false;
        return;
      }

      // 2️⃣ Use that profile.id to fetch recipe recommendations
      this.recommendationService.getRecommendations(+profile.id).subscribe({
        next: async (resp) => {
          // initialize recipes
          this.recipes = resp.recipes.map((r: any) => ({
            ...r,
            avgRating: 0,
            ratingCount: 0,
          }));
          // fetch each rating
          await Promise.all(
            this.recipes.map(async (r) => {
              try {
                const { average, count } = await this.sbSvc.getRecipeRating(
                  r.id
                );
                r.avgRating = average;
                r.ratingCount = count;
              } catch {
                // ignore per‐recipe errors
              }
            })
          );
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load recommendations.';
          this.loading = false;
        },
      });
    } catch (e) {
      console.error(e);
      this.error = 'Unexpected error';
      this.loading = false;
    }

    this.recipeRating = await this.sbSvc.getRecipeRating(5);
  }
}
