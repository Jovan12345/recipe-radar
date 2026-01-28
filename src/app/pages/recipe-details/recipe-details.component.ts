// src/app/recipe-details/recipe-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../../shared/services/recipe/recipe.service';

import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { SupabaseService } from '../../shared/services/supabase/supabase.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;

  // rating state
  avgRating = 0;
  ratingCount = 0;
  userRating: number|null = null;
  newRating = 0;  // hold the star selection

  profileId: number | null = null; // hold the profile ID for the current user

  constructor(
    private route: ActivatedRoute,
    private recipeSvc: RecipeService,
    private sb: SupabaseService,
    private ga: GoogleAnalyticsService
  ) {}

  async ngOnInit() {
    window.scrollTo(0, 0);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Unvalid recipe ID';
      this.loading = false;
      return;
    }

    try {
      this.recipe = await this.recipeSvc.getById(id);
      if (!this.recipe) {
        this.error = 'Recipe not found.';
      } else {
        this.ga.event('recipe_view', 'engagement', this.recipe.id.toString());
      }

      // fetch existing rating stats
      const { average, count } = await this.sb.getRecipeRating(id);
      this.avgRating = average;
      this.ratingCount = count;

      const { data: profile, error: profErr } = await this.sb.getProfile();
      if (profErr || !profile) {
        this.error = 'Could not load your profile.';
        this.loading = false;
        return;
      }

      this.profileId = +profile.id; // store the numeric profile ID

      // fetch the current user’s own rating
      this.userRating = await this.sb.getUserRating(id, this.profileId);
    } catch (e) {
      console.error(e);
      this.error = 'Error occured during loading.';
    } finally {
      this.loading = false;
    }
  }

  /** Called when user clicks Submit */
  async submitRating() {
    if (!this.recipe) return;
    try {
      await this.sb.addOrUpdateRating(this.recipe.id, this.profileId!, this.newRating);
      // refresh stats & userRating
      const { average, count } = await this.sb.getRecipeRating(this.recipe.id);
      this.avgRating = average;
      this.ratingCount = count;
      this.userRating = this.newRating;
    } catch (e) {
      console.error('Failed to submit rating', e);
    }
  }
}
