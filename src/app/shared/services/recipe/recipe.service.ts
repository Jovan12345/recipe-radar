// src/app/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  image_url: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private sb: SupabaseService) {}

  async getById(id: number): Promise<Recipe | null> {
    const { data, error } = await this.sb.client
      .from('recipes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.error('Error loading recipe', error);
      return null;
    }
    return data;
  }
}
