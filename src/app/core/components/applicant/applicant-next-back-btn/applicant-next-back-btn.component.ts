import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { SelectedMode } from '../state/enum/selected-mode.enum';

@Component({
  selector: 'app-applicant-next-back-btn',
  templateUrl: './applicant-next-back-btn.component.html',
  styleUrls: ['./applicant-next-back-btn.component.scss'],
})
export class ApplicantNextBackBtnComponent implements OnInit, OnChanges {
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

  public selectedMode: string = SelectedMode.APPLICANT;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode?.previousValue !== changes.mode?.currentValue) {
      this.selectedMode = changes.mode?.currentValue;
    }
  }

  public onStepAction(action: string): void {
    this.stepEvent.emit({ action });
  }
}
