// src/app/pages/add-recipe/add-recipe.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Profile,
  SupabaseService,
} from '../../shared/services/supabase/supabase.service';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  categories: string[] = [
    'Pasta',
    'Dessert',
    'Grill',
    'Vegetarian',
    'Mexican',
    'Soup',
    'Side',
    'Breakfast',
    'Asian',
    'Salad',
    'Chicken',
    'Italian',
    'BBQ',
    'Pizza',
    'Pork',
    'Dinner',
    'Lunch',
    'Seafood',
  ];

  difficulties: string[] = ['easy', 'medium', 'hard'];

  currentProfile: Profile | null = null;
  private profileSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSub = this.supabase.currentProfile$.subscribe((profile) => {
      this.currentProfile = profile;
    });

    // build a reactive form with all fields
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ingredients: ['', [Validators.required]],
      instructions: ['', [Validators.required]],
      prep_time: [0, [Validators.required, Validators.min(0)]],
      cook_time: [0, [Validators.required, Validators.min(0)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      difficulty: ['', [Validators.required]], // e.g. 'easy', 'medium', 'hard'
      category: ['', [Validators.required]],
      image_url: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):/)],
      ],
      calories_per_serving: [null],
      protein_per_serving: [null],
    });
  }

  async submit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;


    try {
      // Insert into the "recipes" table via your SupabaseService
      if (!this.currentProfile) {
        this.errorMessage = 'User is not logged in or profile not loaded.';
        return;
      }

      const payload = {
        ...this.recipeForm.value,
        user_id: Number(this.currentProfile.id),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabase.client
        .from('recipes')
        .insert(payload)
        .select(); // so we get the inserted row back

      if (error) {
        throw error;
      }

      // Redirect to the new recipe’s details page (assuming data[0].id is the new ID)
      const newId = data[0].id;
      this.router.navigate(['/recipes', newId]);
    } catch (err: any) {
      console.error('Insert error', err);
      this.errorMessage = err.message || 'Failed to add recipe';
      this.isSubmitting = false;
    }
  }
}
