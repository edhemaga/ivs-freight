import {
   Component,
   EventEmitter,
   Input,
   Output,
   Self,
   ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
   selector: 'app-ta-checkbox',
   templateUrl: './ta-checkbox.component.html',
   styleUrls: ['./ta-checkbox.component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class TaCheckboxComponent implements ControlValueAccessor {
   @Input() label: string;
   @Input() required: boolean = false;
   @Input() invalid: boolean = false;
   @Input() disabled: boolean = false;
   @Input() disabledStillCheckMark: boolean = false;
   @Input() svg: string;
   @Input() name: string = 'ta-checkbox'; // if have multiple checkboxes on same page, forward different name
   @Input() customClass: string;

   @Output() formArrayAction: EventEmitter<boolean> =
      new EventEmitter<boolean>();

   private formArrayCheck: boolean = false;

   constructor(@Self() public superControl: NgControl) {
      this.superControl.valueAccessor = this;
   }

   get getSuperControl() {
      return this.superControl.control;
   }

   public writeValue(obj: any): void {}

   public registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   public onChange(event: any): void {}

   public registerOnTouched(fn: any): void {}

   public onAction() {
      this.formArrayCheck = !this.formArrayCheck;
      this.formArrayAction.emit(this.formArrayCheck);
   }
}
