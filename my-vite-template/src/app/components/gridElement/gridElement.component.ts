import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCampaign } from '../addEditCampaign/addEditCampaign.component';
import { mockData } from '../../mockData';

@Component({
  selector: 'grid-element',
  styleUrl: 'gridElement.css',
  templateUrl: 'gridElement.html',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridElement {
  constructor(private dialog: MatDialog) {}
  @Input() campaign: any;
  openDialog(campaign: any): void {
    this.dialog.open(AddEditCampaign, {
      width: '80%',
      data: {
        campaign,
      },
    });
  }
  deleteCampaign(campaign: any) {
    const indexOfCampaignToDelete = mockData.indexOf(campaign);
    mockData.splice(indexOfCampaignToDelete, 1);
  }
}
