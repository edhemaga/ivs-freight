import {
  Component,
  EventEmitter,
  Input,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';

@Component({
  selector: 'app-applicant-review-feedback',
  templateUrl: './applicant-review-feedback.component.html',
  styleUrls: ['./applicant-review-feedback.component.scss'],
})
export class ApplicantReviewFeedbackComponent implements ControlValueAccessor {
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;

  @Input() displayAnnotationButton: boolean;
  @Input() displayAnnotationTextArea: boolean;
  @Input() lineIndex: number;
  @Input() isFeedback: boolean = false;
  @Input() feedbackText: string;
  @Input() cardsLength?: number;
  @Input() cardIndex?: number;
  @Input() cardsType?: string;

  @Output() annotationBtnClickEvent: EventEmitter<{
    lineIndex: number;
    type: string;
  }> = new EventEmitter();

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {}
  public registerOnChange(fn: any): void {}
  public onChange(event: any): void {}
  public registerOnTouched(fn: any): void {}

  public handleAnnotationClick(type: string): void {
    if (type === 'open') {
      this.annotationBtnClickEvent.emit({
        lineIndex: this.lineIndex,
        type: 'open',
      });

      this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);
    } else {
      this.annotationBtnClickEvent.emit({
        lineIndex: this.lineIndex,
        type: 'close',
      });

      this.getSuperControl.patchValue(null);

      this.inputRef.focusInput = false;
    }
  }
}
