import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../shared/services/supabase/supabase.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  logout() {
    this.supabase.signOut().then(() => this.router.navigate(['/']));
  }
}
