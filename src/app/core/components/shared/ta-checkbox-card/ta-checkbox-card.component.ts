import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    card_modal_animation,
    card_modal_animation_false,
} from '../animations/card-modal.animation';

@Component({
    selector: 'app-ta-checkbox-card',
    templateUrl: './ta-checkbox-card.component.html',
    styleUrls: ['./ta-checkbox-card.component.scss'],
    animations: [
        card_modal_animation('showHideCardBody'),
        card_modal_animation_false('showHideCardBodyFalsy'),
    ],
})
export class TaCheckboxCardComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() name: string; // must be set, because of multiple checkbox
    @Input() hasArrow: boolean = true;
    @Input() reverseLogic: boolean = false;
    @Input() animationMarginParams = {
        marginTop: '12px',
        marginBottom: '12px',
    };

    public _isCardOpen: any = 'null';
    public noActive: string;

    @Input() set isCardOpen(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isCardOpen = value;
    }

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

    public onToggleCard(event: any) {
        event.preventDefault();
        event.stopPropagation();
        const oldNoActive = this.noActive;
        this.noActive = '';

        this._isCardOpen =
            oldNoActive == 'innactive' ? true : !this._isCardOpen;
    }
}
