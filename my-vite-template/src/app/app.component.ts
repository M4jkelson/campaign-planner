import { Component } from '@angular/core';
import { Header } from './components/header/header.component';
import { CampaignsGrid } from './components/campaignsGrid/campaignsGrid.component';
import { mockData } from './mockData';

@Component({
  selector: 'app-root',
  template: `
    <header></header>
    <campaigns-grid [campaigns]="campaigns"></campaigns-grid>
  `,
  imports: [Header, CampaignsGrid],
})
export class AppComponent {
  campaigns = mockData;
}
