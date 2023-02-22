import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface RadioButton {
    id: string;
    label: string;
    value: string;
    name: string; // must be same for all radio buttons
    checked: boolean;
    isActive?: boolean; // this field change in this component
}

@Component({
    selector: 'app-ta-input-radiobuttons',
    templateUrl: './ta-input-radiobuttons.component.html',
    styleUrls: ['./ta-input-radiobuttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class TaInputRadiobuttonsComponent {
    @Input() buttons: RadioButton[] = null;
    @Input() disabled: boolean = false;
    @Input() displayRequiredNote?: boolean = false;

    @Output() changedValue: EventEmitter<RadioButton[]> = new EventEmitter<
        RadioButton[]
    >(null);

    public onChange(button: RadioButton): void {
        this.buttons.filter((item) => (item.checked = false));
        button.checked = true;
        this.changedValue.emit(this.buttons);
    }

    public identity(index: number, item: any): string {
        return item.value;
    }
}
