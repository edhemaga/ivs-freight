import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// models
import { DriverResponse, EmploymentHistoryResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-driver-employment-history-card',
    templateUrl: './driver-employment-history-card.component.html',
    styleUrls: ['./driver-employment-history-card.component.scss'],
    providers: [SumArraysPipe],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCustomCardComponent,
    ],
})
export class DriverEmploymentHistoryCardComponent implements OnChanges {
    @Input() cardData: DriverResponse;

    public yearsOfService: number = 0;
    public daysOfService: number = 0;

    public firstEmploymentDate: string;

    public progressBarHoverIndex = -1;

    public employmentHistoryProgressData = [];
    public employmentHistoryData = [];

    constructor(private sumArr: SumArraysPipe) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.createEmploymentHistoryData(
            changes?.cardData?.currentValue?.employmentHistories
        );
    }

    public trackByIdentity(index: number): number {
        return index;
    }

    private createEmploymentHistoryData(
        employmentHistories: EmploymentHistoryResponse[]
    ): void {
        this.getYearsAndDays(employmentHistories);

        this.getProgressBarData(employmentHistories);
    }

    private getYearsAndDays(
        employmentHistories: EmploymentHistoryResponse[]
    ): void {
        let yearsSum = 0;
        let daysSum = 0;

        if (employmentHistories) {
            employmentHistories.forEach((element) => {
                yearsSum += element.duration.Years;
                daysSum += element.duration.Days;
            });

            const dateSum = yearsSum * 365.25 + daysSum;

            this.yearsOfService = Math.trunc(dateSum / 365.25);
            this.daysOfService = Math.trunc(dateSum % 365.25);
        }
    }

    public getProgressBarData(
        employmentHistories: EmploymentHistoryResponse[]
    ): void {
        this.firstEmploymentDate =
            MethodsCalculationsHelper.convertDateFromBackend(
                employmentHistories[0].startDate
            );

        if (employmentHistories) {
            const sumDates = this.sumArr.transform(
                this.cardData?.employmentHistories.map((item) => {
                    return {
                        id: item.id,
                        value:
                            item.duration.Years * 365.25 + item.duration.Days ||
                            1,
                    };
                })
            );

            this.employmentHistoryData = this.cardData?.employmentHistories
                .map((employmentHistory) => {
                    const yearsDaysCount =
                        employmentHistory.duration.Years * 365.25 +
                            employmentHistory.duration.Days || 1;

                    const percents = (
                        (yearsDaysCount / sumDates) *
                        100
                    ).toFixed(1);

                    this.employmentHistoryProgressData = [
                        ...this.employmentHistoryProgressData,
                        {
                            percents,
                            isEmployed: !employmentHistory.isDeactivate,
                        },
                    ];

                    return {
                        isEmployed: !employmentHistory.isDeactivate,
                        startDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                employmentHistory.startDate
                            ),
                        endDate: employmentHistory.endDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  employmentHistory.endDate
                              )
                            : null,
                        yearsOfService: employmentHistory.duration.Years,
                        daysOfService: employmentHistory.duration.Days,
                    };
                })
                .reverse();
        }
    }
}
