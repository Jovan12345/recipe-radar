import { Component, OnInit } from '@angular/core';

import { SupabaseService } from '../../shared/services/supabase/supabase.service';

interface UserRating {
  id: number;
  rating: number;
  description: string;
  created_at: string;
  recipe_id: number;
  recipes: {
    id: number;
    name: string;
    image_url: string;
    category: string;
  };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  userRatings: UserRating[] = [];
  loadingRatings = false;

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getProfile();
    if (error) {
      console.error('Failed to load profile', error);
    } else {
      this.userProfile = data;
      if (this.userProfile?.id) {
        await this.loadUserRatings();
      }
    }
  }

  async loadUserRatings() {
    if (!this.userProfile?.id) return;

    this.loadingRatings = true;
    try {
      this.userRatings = await this.supabase.getProfileRatings(this.userProfile.id);
    } catch (error) {
      console.error('Failed to load user ratings:', error);
    } finally {
      this.loadingRatings = false;
    }
  }

  async updateProfile() {
    const { error } = await this.supabase.updateProfile(this.userProfile);
    if (error) {
      console.error('Failed to update profile', error);
    } else {
      alert('Profile updated!');
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
