import { Component, Input } from '@angular/core';
import { GridElement } from '../gridElement/gridElement.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'campaigns-grid',
  styleUrl: 'campaignsGrid.css',
  templateUrl: 'campaignsGrid.html',
  imports: [GridElement, NgFor],
})
export class CampaignsGrid {
  @Input() campaigns: any[] = [];
}
