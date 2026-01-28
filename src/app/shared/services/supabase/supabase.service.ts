import {
  AuthChangeEvent,
  AuthSession,
  Session,
  SupabaseClient,
  User,
  createClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Profile {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  role: string;
  email?: string;
}

export interface RecipeRating {
  recipe_id: number;
  count: number;
  average: number;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  public currentProfile$: Observable<Profile | null> =
    this.currentProfileSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
      this.loadAndCacheProfile();
    });

        // ④ Also listen for auth changes (login/logout)
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this._session = session;
        this.loadAndCacheProfile();
      } else {
        this._session = null;
        this.currentProfileSubject.next(null);
      }
    });
  }

    private async loadAndCacheProfile() {
    try {
      if (!this._session) {
        this.currentProfileSubject.next(null);
        return;
      }
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('user_id', this._session.user.id)
        .maybeSingle();
      if (error) {
        console.error('Failed to fetch profile:', error);
        this.currentProfileSubject.next(null);
      } else {
        this.currentProfileSubject.next(profile);
      }
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
      this.currentProfileSubject.next(null);
    }
  }

  public refreshProfile() {
  return this.loadAndCacheProfile();
}

  public getCurrentProfile(): Profile | null {
    return this.currentProfileSubject.getValue();
  }

  get session() {
    return this._session;
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`*`)
      .eq('user_id', user.id)
      .maybeSingle();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth
      .signUp({ email, password })
      .then(async ({ data, error }) => {
        if (error) throw error;

        const user = data.user;
        if (user) {
          const { error: profileError } = await this.supabase
            .from('profiles')
            .insert([
              {
                user_id: user.id,
                email,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ]);

          if (profileError) throw profileError;
        }

        return data;
      });
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  async getProfile() {
    const {
      data: { user },
      error: userError,
    } = await this.supabase.auth.getUser();
    if (userError || !user) return { data: null, error: userError };

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return { data, error };
  }

  async executeSQL(query: string): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('run_sql', { query });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Supabase raw data:', data); // Should be an array of { result: {...} }
    return data ?? [];
  }

  async addToShoppingList(params: {
    ingredient_name: string;
    quantity: number;
    unit: string;
  }): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('shopping_list')
      .insert(params)
      .select() // so we get the inserted row with its id
      .single();

    if (error) {
      console.error('Insert error', error);
      return false;
    }
    return data;
  }

  async fetchShoppingList(): Promise<
    { id: number; ingredient_name: string; quantity: number; unit: string }[]
  > {
    const { data, error } = await this.supabase
      .from('shopping_list')
      .select('id, ingredient_name, quantity, unit');

    if (error) {
      console.error('Failed to fetch shopping list:', error);
      return [];
    }

    return data;
  }

  async deleteShoppingItem(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete item:', error);
      return false;
    }

    return true;
  }

  async deleteItemByIngredient(ingredient_name: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('shopping_list')
      .delete()
      .ilike('ingredient_name', ingredient_name);

    if (error) {
      console.error(
        `Failed to delete "${ingredient_name}" from shopping list`,
        error
      );
      return false;
    }

    return true;
  }

  async getRecipeRating(recipeId: number): Promise<RecipeRating> {
    // fetch all rating values for this recipe
    const { data, error } = await this.supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', recipeId);

    if (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }

    const ratings = data.map((r: any) => r.rating as number);
    const count = ratings.length;
    const average = count
      ? ratings.reduce((sum: any, val: any) => sum + val, 0) / count
      : 0;

    return { recipe_id: recipeId, count, average };
  }

  /**
   * Fetch the current user’s rating for a given recipe, if any.
   */
  async getUserRating(recipeId: number, profileId: number): Promise<number | null> {
    // first, grab the profile row
    const {
      data: { user },
      error: userErr,
    } = await this.supabase.auth.getUser();
    if (userErr || !user) return null;

    // now fetch their rating for this recipe
    const { data, error } = await this.supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', recipeId)
      .eq('profile_id', profileId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
    return data?.rating ?? null;
  }

  async addOrUpdateRating(
    recipeId: number,
    profileId: number,
    rating: number,
    description = ''
  ) {
    const payload = {
      recipe_id:   recipeId,
      profile_id:  profileId,
      rating,
      description,
      created_at:  new Date()
    };

    const { data, error } = await this.supabase
      .from('ratings')
      .upsert(payload);

    if (error) throw error;
    return data;
  }

  async getProfileRatings(profileId: number): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:8000/profile/${profileId}/ratings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.ratings || [];
    } catch (error) {
      console.error('Error fetching profile ratings:', error);
      return [];
    }
  }
}
