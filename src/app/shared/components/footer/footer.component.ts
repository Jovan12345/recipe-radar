import { Component } from '@angular/core';

@Component({
  selector: 'wsa-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

}
