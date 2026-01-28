import { Component, Input } from "@angular/core";

@Component({
  selector: 'recipe-results',
  templateUrl: './recipe-results.component.html',
  styleUrls: ['./recipe-results.component.scss']
})
export class RecipeResultsComponent {
  @Input() recipes: any[] = [];
}
