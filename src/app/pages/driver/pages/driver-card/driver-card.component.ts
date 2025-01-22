import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

// model
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { DriverService } from '@pages/driver/services/driver.service';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// components
import { ApplicantModalComponent } from '@pages/applicant/pages/applicant-modal/applicant-modal.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { DriverCdlModalComponent } from '@pages/driver/pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverMedicalModalComponent } from '@pages/driver/pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// svg-routes
import { DriverCardSvgRoutes } from '@pages/driver/pages/driver-card/utils/svg-routes/driver-card-svg-routes';

@Component({
    selector: 'app-driver-card',
    templateUrl: './driver-card.component.html',
    styleUrls: ['./driver-card.component.scss'],
    providers: [CardHelper],
})
export class DriverCardComponent implements OnInit, OnDestroy {
    // All data
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }
    @Input() selectedTab: string;

    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;
    public _viewData: CardDetails[];
    public isCardFlippedCheckInCards: number[] = [];

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    public driverImageRoutes = DriverCardSvgRoutes;

    constructor(
        private router: Router,

        //Services
        private modalService: ModalService,
        private tableService: TruckassistTableService,
        private driverService: DriverService,

        //Helpers
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public trackCard(id: number): number {
        return id;
    }

    public onCardActions(event: any): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                name: event.data?.fullName,
            },
        };
        if (event.type === TableStringEnum.EDIT) {
            if (this.selectedTab === TableStringEnum.APPLICANTS) {
                this.modalService.openModal(
                    ApplicantModalComponent,
                    {
                        size: TableStringEnum.SMALL,
                    },
                    {
                        id: 1,
                        type: TableStringEnum.EDIT,
                    }
                );
            } else {
                this.getDriverById(event.id);
            }
        } else if (event.type === TableStringEnum.NEW_LICENCE) {
            this.modalService.openModal(
                DriverCdlModalComponent,
                { size: TableStringEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.VIEW_DETAILS) {
            this.router.navigate([`/list/driver/${event.id}/details`]);
        } else if (event.type === TableStringEnum.NEW_MEDICAL) {
            this.modalService.openModal(
                DriverMedicalModalComponent,
                {
                    size: TableStringEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.NEW_MVR) {
            this.modalService.openModal(
                DriverMvrModalComponent,
                { size: TableStringEnum.SMALL },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.NEW_DRUG) {
            this.modalService.openModal(
                DriverDrugAlcoholTestModalComponent,
                {
                    size: TableStringEnum.SMALL,
                },
                { ...event, tableActiveTab: this.selectedTab }
            );
        } else if (event.type === TableStringEnum.ACTIVATE_ITEM) {
            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    subType: TableStringEnum.DRIVER_1,
                    type:
                        event.data.status === 1
                            ? TableStringEnum.DEACTIVATE
                            : TableStringEnum.ACTIVATE,
                    template: TableStringEnum.DRIVER_1,
                    tableType: TableStringEnum.DRIVER,
                }
            );
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    template: TableStringEnum.DRIVER,
                    type: TableStringEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    public goToDetailsPage(id: number): void {
        this.router.navigate([`/list/driver/${id}/details`]);
    }

    private getDriverById(id: number): void {
        this.driverService
            .getDriverById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((driver) => {
                    const selectedDriver = this._viewData.find(
                        (driver) => driver.id === id
                    );

                    const editData = {
                        data: {
                            ...driver,
                            avatarImg: selectedDriver.avatarImg,
                            avatarColor: selectedDriver.avatarColor,
                            textShortName: selectedDriver.textShortName,
                            name: selectedDriver.fullName,
                            tableDOB: selectedDriver.tableDOB,
                        },
                        type: TableStringEnum.EDIT,
                        id,
                        disableButton: true,
                    };

                    this.modalService.openModal(
                        DriverModalComponent,
                        { size: TableStringEnum.MEDIUM },
                        {
                            ...editData,
                        }
                    );
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
