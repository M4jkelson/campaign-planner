import { Component, Inject, inject, signal, model, Input } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';

import { mockData, accountSumSignal, cities } from '../../mockData';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Observable, startWith, map } from 'rxjs';

export interface DialogData {
  id: any;
  campaignName: string;
  keywords: string[];
  bidAmount: number;
  campaignFund: number;
  town: string;
  radius: number;
  status: string;
}

@Component({
  selector: 'dialog',
  templateUrl: 'addEditCampaign.html',
  styleUrl: 'addEditCampaign.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    CommonModule,
  ],
})
export class AddEditCampaign {
  @Input() campaign = {};

  async fetchWords() {
    try {
      const response = await axios.get(
        'https://random-word-api.herokuapp.com/word?number=1000'
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  keywordTips: string[] = [];
  isEditing = false;
  cities = cities;
  isStatusChecked = false;
  status = 'OFF';

  toggleStatus(): void {
    this.status = this.isStatusChecked ? 'ON' : 'OFF';
  }

  keywordControl = new FormControl('');
  filteredKeywords: Observable<string[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {
    if (dialogData.campaign) {
      const currentCampaign = dialogData.campaign;
      this.isEditing = true;
      this.isStatusChecked = currentCampaign.status === 'ON' ? true : false;
      this.status = currentCampaign.status;
      this.campaignName = currentCampaign.campaignName;
      this.keywords = signal(currentCampaign.keywords);
      this.bidAmount = currentCampaign.bidAmount;
      this.campaignFund = currentCampaign.campaignFund;
      this.town = currentCampaign.town;
      this.radius = currentCampaign.radius;
    }
    this.filteredKeywords = this.keywordControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngOnInit() {
    this.fetchWords()
      .then((words) => {
        this.keywordTips = words;
      })
      .catch((error) => {
        console.error('Error fetching words:', error);
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.keywordTips.filter((keyword) =>
      keyword.toLowerCase().includes(filterValue)
    );
  }

  readonly dialogRef = inject(MatDialogRef<AddEditCampaign>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly campaignName = model(this.data.campaignName);
  readonly bidAmount = model(this.data.bidAmount);
  readonly campaignFund = model(this.data.campaignFund);
  readonly town = model(this.data.town);
  readonly radius = model(this.data.radius);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentKeyword = model('');
  readonly keywords = signal(['campaign']);

  selectedCity: string | undefined;

  numberFormControl = new FormGroup({
    campaignName: new FormControl('', Validators.required),
    bidAmount: new FormControl('', [Validators.required, Validators.min(1)]),
    campaignFund: new FormControl('', [
      Validators.required,
      Validators.min(1000),
      Validators.max(accountSumSignal()),
    ]),
    town: new FormControl('', Validators.required),
    radius: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    status: new FormControl(),
  });
  get radiusControl(): FormControl {
    return this.numberFormControl.get('radius') as FormControl;
  }
  get townControl(): FormControl {
    return this.numberFormControl.get('town') as FormControl;
  }
  get campaignFundControl(): FormControl {
    return this.numberFormControl.get('campaignFund') as FormControl;
  }
  get bidAmountControl(): FormControl {
    return this.numberFormControl.get('bidAmount') as FormControl;
  }
  get campaignNameControl(): FormControl {
    return this.numberFormControl.get('campaignName') as FormControl;
  }

  readonly announcer = inject(LiveAnnouncer);

  addKeyword(keyword: string): void {
    const event = { value: keyword.trim() } as MatChipInputEvent;
    this.keywordControl.setValue('');
    this.add(event);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.update((keywords) => [...keywords, value]);
    }

    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  remove(keyword: string): void {
    this.keywords.update((keywords) => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`Removed ${keyword}`);
      return [...keywords];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keywords.update((keywords) => [...keywords, event.option.viewValue]);
    this.currentKeyword.set('');
    event.option.deselect();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const newCampaign = {
      id: uuidv4(),
      ...this.numberFormControl.value,
      status: this.status,
      keywords: this.keywords(),
    };
    if (this.dialogData.campaign) {
      const indexOfCampaignToUpdate = mockData.indexOf(
        this.dialogData.campaign
      );
      accountSumSignal.set(
        accountSumSignal() -
          (Number(newCampaign.campaignFund) -
            this.dialogData.campaign.campaignFund)
      );
      mockData[indexOfCampaignToUpdate] = newCampaign;
    } else {
      mockData.unshift(newCampaign);

      accountSumSignal.set(
        accountSumSignal() - Number(newCampaign.campaignFund)
      );
    }
    this.dialogRef.close();
  }
}
