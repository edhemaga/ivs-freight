import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Models
import { LoadStatusHistoryResponse } from 'appcoretruckassist';
import {
    SelectedStatus,
    LoadModalWaitTime,
} from '@pages/load/pages/load-modal/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Pipes
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// Enums
import { LoadModalConfig } from '@pages/load/pages/load-modal/utils/constants';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';

// Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { CaInputComponent  } from 'ca-components';

@Component({
    selector: 'app-load-modal-wait-time',
    templateUrl: './load-modal-wait-time.component.html',
    styleUrls: ['./load-modal-wait-time.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Components
        TaCustomCardComponent,
        LoadStatusStringComponent,
        CaInputComponent,

        // Pipes
        LoadStatusColorPipe,
    ],
})
export class LoadModalWaitTimeComponent implements OnInit {
    public waitTimeForm: UntypedFormGroup;
    public startDateInputConfig: ITaInput = null;
    public startTimeInputConfig: ITaInput = null;
    public endDateInputConfig: ITaInput = null;
    public endTimeInputConfig: ITaInput = null;
    public show: boolean;
    public timeDifferences: Array<LoadModalWaitTime> = [];
    public totalWaitTime: LoadModalWaitTime;
    public statusHistoryDisplayStrings: SelectedStatus[] = [];
    private isFormDisabled = true;

    @Input() statusHistory: Array<LoadStatusHistoryResponse> | null;
    @Output() formChanged = new EventEmitter<
        Array<LoadStatusHistoryResponse>
    >();
    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.generateForm();

        this.mapFieldsToForm();

        this.watchFormChanges();

        // Initial calculation
        this.calculateTotalWaitTime();

        this.createFormFields();
    }

    private generateForm() {
        this.waitTimeForm = this.formBuilder.group({
            statusHistory: this.formBuilder.array([]),
        });
    }

    private mapFieldsToForm() {
        this.statusHistory.forEach((status, index) => {
            this.statusHistoryForm().push(this.mapHistoryStatus(status, index));
        });
    }

    private watchFormChanges() {
        this.statusHistoryForm().valueChanges.subscribe(() => {
            this.updateTimeDifferences();
            this.calculateTotalWaitTime();

            if (this.show) {
                this.updateStatusHistory();
            }
        });
    }

    private createFormFields() {
        this.startDateInputConfig = LoadModalConfig.getWaitTimeStartDateConfig(
            this.isFormDisabled
        );
        this.startTimeInputConfig = LoadModalConfig.getWaitTimeStartTimeConfig(
            this.isFormDisabled
        );
        this.endDateInputConfig = LoadModalConfig.getWaitTimeEndDateConfig(
            this.isFormDisabled
        );
        this.endTimeInputConfig = LoadModalConfig.getWaitTimeEndTimeConfig(
            this.isFormDisabled
        );

        this.show = true;
    }

    public mapHistoryStatus(
        status: LoadStatusHistoryResponse,
        index: number
    ): UntypedFormGroup {
        const [startDate, startTime] = this.splitDateTime(status.dateTimeFrom);
        const [endDate, endTime] = this.splitDateTime(status.dateTimeTo);
        const timeDifference = this.calculateTimeDifference(
            status.dateTimeFrom,
            status.dateTimeTo
        );
        this.timeDifferences[index] = timeDifference;
        const statusString = status.statusString.split(' ');
        this.statusHistoryDisplayStrings.push({
            name: status.statusString,
            id: status.id,
            valueForRequest: status.status.name,
        });

        return this.formBuilder.group({
            statusName: [status.status.name],
            status: [statusString[0]],
            statusNumber: [statusString[1]],
            startDate: [startDate],
            startTime: [startTime],
            endDate: [endDate],
            endTime: [endTime],
            id: [status.id],
        });
    }

    public statusHistoryForm(): UntypedFormArray {
        return this.waitTimeForm.get(
            LoadModalStringEnum.STATUS_HISTORY
        ) as UntypedFormArray;
    }

    private splitDateTime(dateTime: string): [string | null, string | null] {
        if (!dateTime) {
            return [null, null];
        }

        const [date, time] = dateTime.split('T');
        const formattedTime = time ? time.split('.')[0] : null;
        return [date, formattedTime];
    }

    private calculateTimeDifference(
        dateTimeFrom: string,
        dateTimeTo: string
    ): {
        displayString: string;
        totalMinutes: number;
    } {
        if (!dateTimeFrom || !dateTimeTo) {
            return {
                displayString: '',
                totalMinutes: 0,
            };
        }

        const startDate = new Date(dateTimeFrom);
        const endDate = new Date(dateTimeTo);
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        return {
            displayString: this.formatTimeDifference(diffMins),
            totalMinutes: diffMins,
        };
    }

    private formatTimeDifference(diffMins: number): string {
        const absDiffMins = Math.abs(diffMins);
        const hours = Math.floor(absDiffMins / 60);
        const minutes = absDiffMins % 60;

        let result = '';
        if (hours !== 0) {
            result += `${hours}h `;
        }
        result += `${minutes}m`;

        return result.trim();
    }

    private updateTimeDifferences(): void {
        this.statusHistoryForm().controls.forEach((control, index) => {
            const startDate = control.get(
                LoadModalStringEnum.WAIT_TIME_START_DATE
            ).value;
            const startTime = control.get(
                LoadModalStringEnum.WAIT_TIME_START_TIME
            ).value;
            const endDate = control.get(
                LoadModalStringEnum.WAIT_TIME_END_DATE
            ).value;
            const endTime = control.get(
                LoadModalStringEnum.WAIT_TIME_END_TIME
            ).value;

            if (startDate && startTime && endDate && endTime) {
                const dateTimeFrom = this.parseDateTime(startDate, startTime);
                const dateTimeTo = this.parseDateTime(endDate, endTime);
                this.timeDifferences[index] = this.calculateTimeDifference(
                    dateTimeFrom,
                    dateTimeTo
                );
            } else {
                this.timeDifferences[index] = {
                    displayString: '',
                    totalMinutes: 0,
                };
            }
        });
    }

    private parseDateTime(date: string, time: string): string {
        const [month, day, year] = date.split('/');
        const fullYear = `20${year}`;
        return `${fullYear}-${month}-${day}T${time}:00`;
    }

    private calculateTotalWaitTime(): void {
        const totalMinutes = this.timeDifferences.reduce(
            (acc, curr) => acc + curr.totalMinutes,
            0
        );
        this.totalWaitTime = {
            displayString: this.formatTimeDifference(totalMinutes),
            totalMinutes,
        };
    }

    private updateStatusHistory(): void {
        const updatedStatusHistory = this.statusHistoryForm().controls.map(
            (control) => {
                const startDate = control.get(
                    LoadModalStringEnum.WAIT_TIME_START_DATE
                ).value;
                const startTime = control.get(
                    LoadModalStringEnum.WAIT_TIME_START_TIME
                ).value;
                const endDate = control.get(
                    LoadModalStringEnum.WAIT_TIME_END_DATE
                ).value;
                const endTime = control.get(
                    LoadModalStringEnum.WAIT_TIME_END_TIME
                ).value;
                const dateTimeFrom =
                    startDate && startTime ? `${startDate}T${startTime}` : null;
                const dateTimeTo =
                    endDate && endTime ? `${endDate}T${endTime}` : null;
                const timeDifference = this.calculateTimeDifference(
                    dateTimeFrom,
                    dateTimeTo
                );

                control.patchValue(
                    {
                        timeDifference: timeDifference.displayString,
                        totalMinutes: timeDifference.totalMinutes,
                    },
                    { emitEvent: false }
                );

                return {
                    ...control.value,
                    dateTimeFrom,
                    dateTimeTo,
                };
            }
        );

        this.formChanged.emit(updatedStatusHistory);
    }
}
