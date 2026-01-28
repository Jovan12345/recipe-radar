import { RouterModule, Routes } from '@angular/router';

import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { WebSpeechComponent } from './pages/web-speech/web-speech.component';

const routes: Routes = [
  {
    path: '',
    component: WebSpeechComponent,
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailsComponent,
  },
  { path: 'add-recipe', component: AddRecipeComponent },

  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
