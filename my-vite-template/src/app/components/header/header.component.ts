import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCampaign } from '../addEditCampaign/addEditCampaign.component';
import { accountSumSignal } from '../../mockData';

@Component({
  selector: 'header',
  templateUrl: 'header.html',
  styleUrl: 'header.css',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
})
export class Header {
  constructor(private dialog: MatDialog) {}
  accountSum = computed(() => accountSumSignal());

  openDialog(): void {
    this.dialog.open(AddEditCampaign, {
      width: '80%',
      data: {},
    });
  }
}
