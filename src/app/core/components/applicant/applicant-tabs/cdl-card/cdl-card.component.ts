import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-cdl-card',
  templateUrl: './cdl-card.component.html',
  styleUrls: ['./cdl-card.component.scss'],
})
export class CdlCardComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public cdlCardForm: FormGroup;

  public documents: any[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.cdlCardForm = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  public onFilesAction(event: any): void {
    this.documents = event.files;
  }
}
