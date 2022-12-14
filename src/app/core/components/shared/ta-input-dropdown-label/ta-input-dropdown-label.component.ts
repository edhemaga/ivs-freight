import {
    Component,
    EventEmitter,
    Input,
    Output,
    Self,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
    selector: 'app-ta-input-dropdown-label',
    templateUrl: './ta-input-dropdown-label.component.html',
    styleUrls: ['./ta-input-dropdown-label.component.scss'],
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

    @Output() editModeLabel: EventEmitter<boolean> = new EventEmitter<boolean>(
        false
    );

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
        if (event?.id === 7655) {
            this.editModeLabel.emit(true);
        }

        if (event?.id !== 7655 && action === 'label') {
            this.getSuperControl.setErrors(null);
        }

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

        if (event === 'Color') {
            this.editModeLabel.emit(true);
        } else {
            this.editModeLabel.emit(false);
        }
    }

    /**
     * SAVE LABEL NAME
     */
    public onSaveLabel(event: { data: any; action: string }) {
        if (event.action === 'cancel') {
            this.getSuperControl.reset();
        }

        if (event.action === 'edit') {
            this.saveLabel.emit({ data: event.data, action: event.action });
        }

        if (event.action === 'new') {
            this.saveLabel.emit({ data: event.data, action: event.action });
        }

        this.editModeLabel.emit(false);
    }

    public identity(index: number, item: any): number {
        return item.id;
    }
}
