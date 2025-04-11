import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString, eColor, eStringPlaceholder } from '@shared/enums';

// SVG routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { LoadRequirementsFormatPipe } from '@pages/new-load/pages/new-load-details/pipes';

// Components
import { CaSkeletonComponent } from '@shared/components/ca-skeleton/ca-skeleton.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { CaUnitInfoBoxComponent } from '@shared/components/ca-unit-info-box/ca-unit-info-box.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import {
    CaLoadStatusComponent,
    CaDetailsTitleCardComponent,
    LoadStatusColorsPipe,
} from 'ca-components';

@Component({
    selector: 'app-load-details-general',
    templateUrl: './load-details-general.component.html',
    styleUrl: './load-details-general.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,

        // Pipes
        FormatDatePipe,
        LoadStatusColorsPipe,
        LoadRequirementsFormatPipe,

        // Components
        CaSkeletonComponent,
        SvgIconComponent,
        CaUnitInfoBoxComponent,
        TaAppTooltipV2Component,
        CaLoadStatusComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        CaDetailsTitleCardComponent,
    ],
})
export class LoadDetailsGeneralComponent {
    @ViewChild('detailsTitleCard')
    detailsTitleCard: CaDetailsTitleCardComponent<LoadDetailsGeneralComponent>;

    // assets
    public sharedIcons = SharedSvgRoutes;

    // enums
    public eStringPlaceholder = eStringPlaceholder;
    public eSharedString = eSharedString;
    public eColor = eColor;

    public isBillingExpanded: boolean = false;
    public isPaymentExpanded: boolean = false;
    public isInvoiceAgeingExpanded: boolean = false;

    public cardForm: UntypedFormGroup;

    constructor(
        protected loadStoreService: LoadStoreService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    public toggleBilling(): void {
        this.isBillingExpanded = !this.isBillingExpanded;
    }

    public togglePayment(): void {
        this.isPaymentExpanded = !this.isPaymentExpanded;
    }

    public toggleInvoiceAgeing(): void {
        this.isInvoiceAgeingExpanded = !this.isInvoiceAgeingExpanded;
    }

    private createForm(): void {
        this.cardForm = this.formBuilder.group({
            driverMessage: [],
            note: [],
        });
    }

    public onNextAction(): void {}

    public onPreviousAction(): void {}

    public onDropdownItemAction(): void {
        this.detailsTitleCard.dropdownPopover?.close();
    }

    public onAddNewItemAction(): void {
        this.detailsTitleCard.dropdownPopover?.close();
    }
}
