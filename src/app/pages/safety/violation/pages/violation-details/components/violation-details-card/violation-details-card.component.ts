import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// services
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';

// store
import { RoadsideMinimalListQuery } from '../../../../state/roadside-details-state/roadside-minimal-list-state/roadside-minimal.query';

@Component({
    selector: 'app-violation-details-card',
    templateUrl: './violation-details-card.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./violation-details-card.component.scss'],
})
export class ViolationDetailsCardComponent implements OnInit, OnChanges {
    @Input() public violationCardData: any;
    @Input() public templateCard: boolean;
    public violationDropdown: any;
    public noteControl: UntypedFormControl = new UntypedFormControl();
    public dummyDataSpecial: any;
    public violationList: any[] = this.violationMinimalQuery.getAll();
    public specialChecksCounter: number = 0;
    constructor(
        private violationMinimalQuery: RoadsideMinimalListQuery,
        private detailsPageDriverSer: DetailsPageService
    ) {}
    ngOnChanges(): void {
        this.getViolationDropdown();
    }
    ngOnInit(): void {
        this.noteControl.patchValue(
            'How to pursue pleasure rationally encounter consequences that are extremely painful.'
        );
    }
    public getViolationDropdown() {
        this.violationDropdown = this.violationMinimalQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.report,
                    active: item.id === this.violationCardData.id,
                };
            });
    }

    public onSelectViolation(event: any) {
        if (event.id !== this.violationCardData.id) {
            this.violationList = this.violationMinimalQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.report,
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeViolation(action: string) {
        let currentIndex = this.violationList.findIndex(
            (violationId) => violationId.id === this.violationCardData.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.violationList[currentIndex].id
                    );
                    this.onSelectViolation({
                        id: this.violationList[currentIndex].id,
                    });
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.violationList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.violationList[currentIndex].id
                    );
                    this.onSelectViolation({
                        id: this.violationList[currentIndex].id,
                    });
                }
                break;
            }

            default: {
                break;
            }
        }
    }
}
