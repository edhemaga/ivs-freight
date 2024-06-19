import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';

// modules
import { SharedModule } from '@shared/shared.module';

// store
import { LoadMinimalListQuery } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

// components
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { LoadDetailsTitleCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-title-card/load-details-title-card.component';
import { LoadDetailsBrokerDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-broker-details-card/load-details-broker-details-card.component';
import { LoadDetailsAssignedToCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-assigned-to-card/load-details-assigned-to-card.component';
import { LoadDetailsRequirementCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-requirement-card/load-details-requirement-card.component';
import { LoadDetailsBillingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-billing-card/load-details-billing-card.component';
import { LoadDetailsPaymentCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-payment-card/load-details-payment-card.component';
import { LoadDetailsInvoiceAgingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-invoice-aging-card/load-details-invoice-aging-card.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// enums
import { LoadDetailsCardStringEnum } from '@pages/load/pages/load-details/components/load-details-card/enums/load-details-card-string.enum';
import { ArrowActionsStringEnum } from '@shared/enums/arrow-actions-string.enum';

// models
import { LoadMinimalResponse, LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-card',
    templateUrl: './load-details-card.component.html',
    styleUrls: ['./load-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        SharedModule,

        // components
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaChartComponent,
        TaMapsComponent,
        LoadDetailsTitleCardComponent,
        LoadDetailsBrokerDetailsCardComponent,
        LoadDetailsAssignedToCardComponent,
        LoadDetailsRequirementCardComponent,
        LoadDetailsBillingCardComponent,
        LoadDetailsPaymentCardComponent,
        LoadDetailsInvoiceAgingCardComponent,

        // pipes
        FormatCurrencyPipe,
        FormatDatePipe,
    ],
})
export class LoadDetailsCardComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse;

    public loadsDropdownList: LoadResponse[] = [];

    public loadCurrentIndex: number;

    public loadNote: UntypedFormControl = new UntypedFormControl();

    // note card
    public cardForm: UntypedFormGroup;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private detailsPageDriverService: DetailsPageService,
        public imageBase64Service: ImageBase64Service,

        // store
        private loadMinimalListQuery: LoadMinimalListQuery
    ) {}

    ngOnInit(): void {
        console.log('load', this.load);

        this.createForm();

        this.getCurrentIndex();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.load?.firstChange && changes?.load.currentValue)
            this.getLoadsDropdown();
    }

    private createForm(): void {
        this.cardForm = this.formBuilder.group({
            driverMessage: [null],
            note: [null],
        });

        this.cardForm.patchValue({
            driverMessage: this.load.loadRequirements?.driverMessage,
            note: this.load.note,
        });
    }

    public getLoadsDropdown(): void {
        this.loadsDropdownList = this.loadMinimalListQuery
            .getAll()
            .map((load) => {
                const { id, loadNumber, status, type } = load;

                return {
                    id,
                    name:
                        LoadDetailsCardStringEnum.INVOICE +
                        LoadDetailsCardStringEnum.EMPTY_STRING +
                        loadNumber,
                    svg: type?.name === 'LTL' ? 'ic_ltl-status.svg' : null,
                    folder: LoadDetailsCardStringEnum.COMMON,
                    status: status,
                    active: id === this.load.id,
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
        if (event?.id !== this.load.id) {
            this.loadsDropdownList = this.loadMinimalListQuery
                .getAll()
                .map((load) => {
                    const { id, loadNumber, status, type } = load;

                    return {
                        id,
                        name:
                            LoadDetailsCardStringEnum.INVOICE +
                            LoadDetailsCardStringEnum.EMPTY_STRING +
                            loadNumber,
                        svg: type.name === 'LTL' ? 'ic_ltl-status.svg' : null,
                        folder: LoadDetailsCardStringEnum.COMMON,
                        status,
                        active: id === event.id,
                    };
                });

            this.detailsPageDriverService.getDataDetailId(event.id);
        }
    }

    public onChangeLoad(action: string): void {
        let currentIndex = this.loadsDropdownList.findIndex(
            (brokerId) => brokerId.id === this.load.id
        );

        switch (action) {
            case ArrowActionsStringEnum.PREVIOUS:
                currentIndex = --currentIndex;

                if (currentIndex !== -1) {
                    this.detailsPageDriverService.getDataDetailId(
                        this.loadsDropdownList[currentIndex].id
                    );

                    /*  this.onSelectLoad({ id: this.loadsDropdownList[currentIndex].id }); */
                    this.loadCurrentIndex = currentIndex;
                }

                break;

            case ArrowActionsStringEnum.NEXT:
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.loadsDropdownList.length > currentIndex
                ) {
                    this.detailsPageDriverService.getDataDetailId(
                        this.loadsDropdownList[currentIndex].id
                    );

                    /*    this.onSelectLoad({ id: this.loadsDropdownList[currentIndex].id }); */
                    this.loadCurrentIndex = currentIndex;
                }

                break;
            default:
                break;
        }
    }

    public handleDriverDetailsTitleCardEmit(event: any): void {
        switch (event.type) {
            case LoadDetailsCardStringEnum.SELECT_LOAD:
                /*  if (event.event.name === DriverDetailsCardStringEnum.ADD_NEW) {
                    this.modalService.openModal(DriverModalComponent, {
                        size: DriverDetailsCardStringEnum.MEDIUM,
                    });

                    return;
                } */

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
