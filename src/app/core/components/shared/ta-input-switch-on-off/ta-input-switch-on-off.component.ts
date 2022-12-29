import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ta-input-switch-on-off',
    templateUrl: './ta-input-switch-on-off.component.html',
    styleUrls: ['./ta-input-switch-on-off.component.scss'],
})
export class TaInputSwitchOnOffComponent implements OnInit {
    @Input() titleText: string;
    @Input() isRequired?: boolean = false;
    @Input() displayRequiredState: boolean = false;

    @Output() switchStateEmitter = new EventEmitter<any>();

    public isSwitchOn: boolean = null;

    constructor() {}

    ngOnInit(): void {}

    public handleSwitchButton(action: boolean): void {
        if (action) {
            this.isSwitchOn = true;
        } else {
            this.isSwitchOn = false;
        }

        this.switchStateEmitter.emit(this.isSwitchOn);
    }
}
