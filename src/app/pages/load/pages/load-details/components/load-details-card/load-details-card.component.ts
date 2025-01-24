import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

// store
import { LoadMinimalListQuery } from '@pages/load/state_old/load-details-state/load-minimal-list-state/load-details-minimal.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ModalService } from '@shared/services/modal.service';

// components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { LoadDetailsTitleCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-title-card/load-details-title-card.component';
import { LoadDetailsBrokerDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-broker-details-card/load-details-broker-details-card.component';
import { LoadDetailsAssignedToCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-assigned-to-card/load-details-assigned-to-card.component';
import { LoadDetailsRequirementCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-requirement-card/load-details-requirement-card.component';
import { LoadDetailsBillingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-billing-card/load-details-billing-card.component';
import { LoadDetailsPaymentCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-payment-card/load-details-payment-card.component';
import { LoadDetailsInvoiceAgingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-invoice-aging-card/load-details-invoice-aging-card.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// enums
import { LoadDetailsCardStringEnum } from '@pages/load/pages/load-details/components/load-details-card/enums/load-details-card-string.enum';
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';
import { LoadStatusEnum } from '@shared/enums/load-status.enum';

// models
import { LoadMinimalResponse, LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-card',
    templateUrl: './load-details-card.component.html',
    styleUrls: ['./load-details-card.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        LoadDetailsTitleCardComponent,
        LoadDetailsBrokerDetailsCardComponent,
        LoadDetailsAssignedToCardComponent,
        LoadDetailsRequirementCardComponent,
        LoadDetailsBillingCardComponent,
        LoadDetailsPaymentCardComponent,
        LoadDetailsInvoiceAgingCardComponent,
    ],
})
export class LoadDetailsCardComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse;

    public cardForm: UntypedFormGroup;

    public loadsDropdownList: LoadMinimalResponse[] = [];

    public loadCurrentIndex: number;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private cdRef: ChangeDetectorRef,

        // services
        private detailsPageDriverService: DetailsPageService,
        private modalService: ModalService,

        // store
        private loadMinimalListQuery: LoadMinimalListQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getCurrentIndex();

        this.getLoadsDropdown();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.load?.firstChange && changes?.load.currentValue)
            this.getLoadsDropdown();
    }

    private createForm(): void {
        this.cardForm = this.formBuilder.group({
            driverMessage: [this.load.loadRequirements?.driverMessage],
            note: [this.load.note],
        });
    }

    public getLoadsDropdown(): void {
        this.loadsDropdownList = this.loadMinimalListQuery
            .getAll()
            .map((load) => {
                const { id, loadNumber, status, ...loadData } = load;

                let stopType: string;

                if (load?.status?.statusCheckInNumber) {
                    const pickupStatus = [
                        LoadStatusEnum[4],
                        LoadStatusEnum[46],
                        LoadStatusEnum[48],
                        LoadStatusEnum[50],
                        LoadStatusEnum[53],
                    ];
                    const deliveryStatus = [
                        LoadStatusEnum[5],
                        LoadStatusEnum[47],
                        LoadStatusEnum[49],
                        LoadStatusEnum[51],
                        LoadStatusEnum[54],
                    ];

                    stopType = pickupStatus.includes(status.statusValue.name)
                        ? LoadDetailsCardStringEnum.PICKUP
                        : deliveryStatus.includes(status.statusValue.name)
                        ? LoadDetailsCardStringEnum.DELIVERY
                        : LoadDetailsCardStringEnum.EMPTY_STRING;
                }

                return {
                    ...loadData,
                    id,
                    name: loadNumber,
                    active: id === this.load.id,
                    status,
                    stopType,
                };
            });
    }

    private getCurrentIndex(): void {
        setTimeout(() => {
            const currentIndex = this.loadsDropdownList.findIndex(
                (load) => load.id === this.load.id
            );

            this.loadCurrentIndex = currentIndex;
        }, 300);
    }

    public onSelectLoad(event: LoadMinimalResponse): void {
        if (event && event?.id !== this.load.id) {
            this.getLoadsDropdown();

            this.detailsPageDriverService.getDataDetailId(event.id);

            this.cdRef.detectChanges();
        }
    }

    public onChangeLoad(action: string): void {
        let currentIndex = this.loadsDropdownList.findIndex(
            (brokerId) => brokerId.id === this.load.id
        );

        switch (action) {
            case ArrowActionsStringEnum.PREVIOUS:
                currentIndex = (currentIndex - 1 + this.loadsDropdownList.length) % this.loadsDropdownList.length;
    
                this.detailsPageDriverService.getDataDetailId(
                    this.loadsDropdownList[currentIndex].id
                );
    
                this.loadCurrentIndex = currentIndex;
                break;
    
            case ArrowActionsStringEnum.NEXT:
                currentIndex = (currentIndex + 1) % this.loadsDropdownList.length;
    
                this.detailsPageDriverService.getDataDetailId(
                    this.loadsDropdownList[currentIndex].id
                );
    
                this.loadCurrentIndex = currentIndex;
                break;
    
            default:
                break;
        }
    }

    public handleDriverDetailsTitleCardEmit(event: any): void {
        switch (event.type) {
            case LoadDetailsCardStringEnum.SELECT_LOAD:
                if (event.event.name === LoadDetailsCardStringEnum.ADD_NEW) {
                    this.modalService.openModal(LoadModalComponent, {
                        size: LoadDetailsCardStringEnum.MEDIUM,
                    });

                    return;
                }

                this.onSelectLoad(event.event);

                break;
            case LoadDetailsCardStringEnum.CHANGE_LOAD:
                this.onChangeLoad(event.event);

                break;
            default:
                break;
        }
    }
}
