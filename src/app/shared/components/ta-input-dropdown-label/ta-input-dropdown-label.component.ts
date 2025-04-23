import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    Self,
    ViewChild,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

// bootstrap
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// pipe
import { FormControlPipe } from '@shared/components/ta-input/pipes/form-control.pipe';

// enums
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-ta-input-dropdown-label',
    templateUrl: './ta-input-dropdown-label.component.html',
    styleUrls: ['./ta-input-dropdown-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaInputDropdownComponent,

        // Pipe
        FormControlPipe,
    ],
})
export class TaInputDropdownLabelComponent implements ControlValueAccessor {
    @ViewChild('t2') t2Ref: NgbPopover;

    @Input() options: any[] = [];
    @Input() selectedLabel: any;
    @Input() colors: any[] = [];
    @Input() selectedLabelColor: any;
    @Input() inputConfig: ITaInput;

    @Output() pickExistLabel: EventEmitter<any> = new EventEmitter<any>();
    @Output() pickColorLabel: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveLabel: EventEmitter<{ data: any; action: string }> =
        new EventEmitter<{ data: string; action: string }>();

    public switchMode: 'Label' | 'Color' = 'Label';

    constructor(@Self() public superControl: NgControl) {
        this.superControl.valueAccessor = this;
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    writeValue(_: any): void {}
    registerOnChange(_: any): void {}
    registerOnTouched(_: any): void {}

    /**
     * SELECT FROM ITEMS DROPDOWN
     */
    public onSelectDropdown(event: any, action: string) {
        if (this.switchMode === 'Color' && action === 'color') {
            this.pickColorLabel.emit(event);
        }

        if (this.switchMode === 'Label' && action === 'label') {
            this.pickExistLabel.emit(event);
        }
    }

    /**
     * Select label mode
     */
    public onSelectLabelMode(event: 'Label' | 'Color') {
        this.switchMode = event;
    }

    /**
     * SAVE LABEL NAME
     */
    public onSaveLabel(event: any): void {
        if (event.action === eGeneralActions.EDIT_LOWERCASE)
            this.saveLabel.emit({ data: event.data, action: event.action });

        if (event.action === 'new') {
            this.saveLabel.emit({ data: event.data, action: event.action });
        }
    }

    public identity(index: number, item: any): number {
        return item.id;
    }
}
