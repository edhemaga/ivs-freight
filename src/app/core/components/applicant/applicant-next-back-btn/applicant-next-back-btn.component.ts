import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectedMode } from '../state/enum/selected-mode.enum';

@Component({
  selector: 'app-applicant-next-back-btn',
  templateUrl: './applicant-next-back-btn.component.html',
  styleUrls: ['./applicant-next-back-btn.component.scss'],
})
export class ApplicantNextBackBtnComponent implements OnInit {
  @Input() mode?: string;
  @Input() disabledStep?: boolean;
  @Input() nextStep?: boolean;
  @Input() backStep?: boolean;
  @Input() lastStep?: boolean;
  @Input() lastPage?: boolean;
  @Input() lastSphFormPage?: boolean;
  @Input() filledCorrectly?: boolean = false;
  @Input() hasIncorrectFields?: boolean = false;

  @Output() stepEvent: EventEmitter<{ action: string }> = new EventEmitter();

  public selectedMode: string;

  constructor() {}

  ngOnInit(): void {
    if (this.mode === SelectedMode.FEEDBACK) {
      this.selectedMode = SelectedMode.FEEDBACK;
    } else if (this.mode === SelectedMode.REVIEW) {
      this.selectedMode = SelectedMode.REVIEW;
    } else {
      this.selectedMode = SelectedMode.APPLICANT;
    }
  }

  public onStepAction(action: string): void {
    this.stepEvent.emit({ action });
  }
}
