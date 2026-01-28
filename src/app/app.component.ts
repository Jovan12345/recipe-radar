import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { AuthSession } from '@supabase/supabase-js';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SupabaseService } from './shared/services/supabase/supabase.service';

@Component({
  selector: 'wsa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
    animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]

})
export class AppComponent implements OnInit {
  session: AuthSession | null = this.supabase.session;

  constructor(
    private readonly supabase: SupabaseService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    const { data } = await this.supabase.getSession(); // Add this helper in service
    this.session = data.session;

    this.supabase.authChanges((_, session) => {
      this.session = session;
    });
  }
}
