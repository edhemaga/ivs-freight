import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectedMode } from '../state/enum/selected-mode.enum';

@Component({
  selector: 'app-applicant-next-back-btn',
  templateUrl: './applicant-next-back-btn.component.html',
  styleUrls: ['./applicant-next-back-btn.component.scss'],
})
export class ApplicantNextBackBtnComponent implements OnInit {
  @Input() disabledStep: boolean;
  @Input() nextStep: boolean;
  @Input() backStep: boolean;
  @Input() lastStep: boolean;
  @Input() lastPage: boolean;
  @Input() lastSphFormPage: boolean;
  @Input() filledCorrectly: boolean = false;

  @Output() stepEvent: EventEmitter<{ action: string }> = new EventEmitter();

  public selectedMode: string = SelectedMode.APPLICANT;

  public reviewFilledCorrectly: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  public onStepAction(action: string): void {
    this.stepEvent.emit({ action });
  }
}
