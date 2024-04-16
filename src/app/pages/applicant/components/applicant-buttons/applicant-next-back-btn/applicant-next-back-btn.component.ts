import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

@Component({
    selector: 'app-applicant-next-back-btn',
    templateUrl: './applicant-next-back-btn.component.html',
    styleUrls: ['./applicant-next-back-btn.component.scss'],
})
export class ApplicantNextBackBtnComponent implements OnChanges {
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode?.previousValue !== changes.mode?.currentValue) {
            this.selectedMode = changes.mode?.currentValue;
        }
    }

    public onStepAction(action: string): void {
        this.stepEvent.emit({ action });
    }
}
