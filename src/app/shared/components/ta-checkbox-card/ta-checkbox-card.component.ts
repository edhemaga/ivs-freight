import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
} from '@angular/forms';

// animations
import {
    card_modal_animation,
    card_modal_animation_false,
} from '../../../core/components/shared/animations/card-modal.animation';

// components
import { TaCheckboxComponent } from '../ta-checkbox/ta-checkbox.component';

//icons
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-checkbox-card',
    templateUrl: './ta-checkbox-card.component.html',
    styleUrls: ['./ta-checkbox-card.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaCheckboxComponent,
    ],
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
    @Input() withoutToggle: boolean = false;
    @Input() animationMarginParams = {
        marginTop: '12px',
        marginBottom: '12px',
    };
    @Input() hasPricingButton: boolean = false;

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

    public writeValue(_: any): void {}

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(_: any): void {}

    public registerOnTouched(_: any): void {}

    public onToggleCard(event: any) {
        event.preventDefault();
        event.stopPropagation();
        const oldNoActive = this.noActive;
        this.noActive = '';

        this._isCardOpen =
            oldNoActive == 'innactive' ? true : !this._isCardOpen;
    }
}
