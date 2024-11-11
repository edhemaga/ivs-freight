import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { map, Subject, takeUntil } from 'rxjs';

// store
import { RepairDetailsQuery } from '@pages/repair/state/repair-details-state/repair-details.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// components
import { RepairShopDetailsOpenHoursCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-open-hours-card/repair-shop-details-open-hours-card.component';
import { RepairShopDetailsServicesCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-services-card/repair-shop-details-services-card.component';
import { RepairShopDetailsBankCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-bank-card/repair-shop-details-bank-card.component';
import { RepairShopDetailsRepairExpenseCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-repair-expense-card/repair-shop-details-repair-expense-card.component';
import { RepairShopDetailsMapCoverCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-map-cover-card/repair-shop-details-map-cover-card.component';
import { RepairShopDetailsTitleCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-title-card/repair-shop-details-title-card.component';

import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// enums
import { RepairShopDetailsStringEnum } from '@pages/repair/pages/repair-shop-details/enums';

// models
import { RepairShopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-repair-shop-details-card',
    templateUrl: './repair-shop-details-card.component.html',
    styleUrls: ['./repair-shop-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        RepairShopDetailsOpenHoursCardComponent,
        RepairShopDetailsServicesCardComponent,
        RepairShopDetailsBankCardComponent,
        RepairShopDetailsRepairExpenseCardComponent,
        RepairShopDetailsMapCoverCardComponent,
        RepairShopDetailsTitleCardComponent,

        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
    ],
})
export class RepairShopDetailsCard implements OnInit, OnChanges, OnDestroy {
    @Input() repairShop: RepairShopResponse;

    private destroy$ = new Subject<void>();

    public repairShopCurrentIndex: number;

    public repairShopsDropdownList: RepairShopResponse[] = [];

    // note card
    public noteForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // router
        private act_route: ActivatedRoute,

        // services
        private detailsPageDriverSer: DetailsPageService,
        private tableService: TruckassistTableService,

        // ref
        private cdRef: ChangeDetectorRef,

        // store
        private repairDetailsQuery: RepairDetailsQuery
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes?.repairShop?.firstChange &&
            changes?.repairShop.currentValue
        ) {
            this.getRepairShopsDropdownList();
        }
    }

    ngOnInit(): void {
        console.log('repairShop', this.repairShop);
        this.createForm();

        /* this.tableService.currentActionAnimation
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                if (res?.animation && res.tab === 'repair-shop') {
                    this.repairShop = res.data;
                    this.cdRef.detectChanges();
                }
            }); */

        this.getCurrentIndex();

        this.getRepairShopsDropdownList();
    }

    private createForm(): void {
        this.noteForm = this.formBuilder.group({
            note: [this.repairShop?.note],
        });
    }

    private getCurrentIndex(): void {
        setTimeout(() => {
            const currentIndex = this.repairShopsDropdownList.findIndex(
                (repairShop) => repairShop.id === this.repairShop.id
            );

            this.repairShopCurrentIndex = currentIndex;
        }, 300);
    }

    public getRepairShopsDropdownList(): void {
        this.repairDetailsQuery.repairShopMinimal$
            .pipe(
                takeUntil(this.destroy$),
                map((data) => {
                    return data?.pagination?.data?.map(
                        (repairShop: RepairShopResponse) => {
                            const { id, name, address, pinned, status } =
                                repairShop;

                            return {
                                id,
                                name,
                                address,
                                pinned,
                                repairs: '10', // dummy w8 for back
                                expense: '45334.34', // dummy w8 for back
                                status,
                                isRepairShopDetails: true,
                                svg: pinned
                                    ? RepairShopDetailsStringEnum.STAR_ROUTE
                                    : !status
                                    ? RepairShopDetailsStringEnum.CLOSED_ROUTE
                                    : RepairShopDetailsStringEnum.EMPTY_STRING,
                                folder: RepairShopDetailsStringEnum.COMMON,
                            };
                        }
                    );
                })
            )
            .subscribe((repairShops) => {
                this.repairShopsDropdownList = repairShops;
            });
    }

    public onSelectedShop(event: any) {
        if (event && event.id !== +this.act_route.snapshot.params['id']) {
            this.repairShopsDropdownList = this.repairShopsDropdownList.map(
                (item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        status: item.status,
                        svg: item.pinned ? 'ic_star.svg' : null,
                        folder: 'common',
                        active: item.id === event.id,
                    };
                }
            );

            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }

    public onChangeShop(action: string) {
        let currentIndex; /*  = this.repairShopsDropdownList.findIndex(
            (item) => item.active
        );
 */
        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.onSelectedShop(
                        this.repairShopsDropdownList[currentIndex]
                    );
                    this.repairShopCurrentIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.repairShopsDropdownList.length > currentIndex
                ) {
                    this.onSelectedShop({
                        id: this.repairShopsDropdownList[currentIndex].id,
                    });
                    this.repairShopCurrentIndex = currentIndex;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.tableService.sendActionAnimation({});
    }
}
