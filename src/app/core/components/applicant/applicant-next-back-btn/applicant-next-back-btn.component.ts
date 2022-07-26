import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Output() stepEvent: EventEmitter<{ action: string }> = new EventEmitter();

  public filledCorrectly: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onStepAction(action: string) {
    this.stepEvent.emit({ action });
  }
}
