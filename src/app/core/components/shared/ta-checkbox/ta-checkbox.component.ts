import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    Self,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-ta-checkbox',
    templateUrl: './ta-checkbox.component.html',
    styleUrls: ['./ta-checkbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
    //changeDetection: ChangeDetectionStrategy.OnPush, // Strategija se morala zakomentarisati zbog problema sa updejtom
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
    ],
})
export class TaCheckboxComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() required: boolean = false;
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

    public writeValue(_: any): void {}

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(_: any): void {}

    public registerOnTouched(_: any): void {}

    public onAction() {
        this.formArrayCheck = !this.formArrayCheck;
        this.formArrayAction.emit(this.formArrayCheck);
    }
}
