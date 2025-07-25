import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// base classes
import { LoadDropdownMenuActionsBase } from '@pages/load/base-classes';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';
import { ModalService } from '@shared/services';

// Components
import { LoadDetailsAdditionalComponent } from '@pages/new-load/pages/new-load-details/components/load-details-additional/load-details-additional.component';
import { LoadDetailsGeneralComponent } from '@pages/new-load/pages/new-load-details/components/load-details-general/load-details-general.component';
import { LoadDetailsStopsComponent } from '@pages/new-load/pages/new-load-details/components/load-details-stops/load-details-stops.component';
import { TaDetailsPageTitleComponent } from '@shared/components/ta-details-page-title/ta-details-page-title.component';

// Pipes
import { StatusClassPipe } from '@pages/new-load/pages/new-load-details/pipes/status-class.pipe';

// Models
import { DetailsDropdownOptions } from '@shared/models';
import { LoadResponse } from 'appcoretruckassist';

// Enums
import { eLoadRouting } from '@pages/new-load/enums';
import { eDropdownMenu } from '@shared/enums';

// Interfaces
import {
    IDropdownMenuItem,
    IDropdownMenuOptionEmit,
} from '@ca-shared/components/ca-dropdown-menu/interfaces';

// Helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers';

@Component({
    selector: 'app-new-load-details',
    templateUrl: './new-load-details.component.html',
    styleUrls: ['./new-load-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        LoadDetailsGeneralComponent,
        LoadDetailsStopsComponent,
        LoadDetailsAdditionalComponent,
        TaDetailsPageTitleComponent,

        // Pipes
        StatusClassPipe,
    ],
})
export class NewLoadDetailsComponent
    extends LoadDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    protected destroy$ = new Subject<void>();

    private load: LoadResponse;

    public detailsDropdownOptions!: DetailsDropdownOptions;
    public dropdownMenuOptions: IDropdownMenuItem[];
    public eLoadRouting = eLoadRouting;

    constructor(
        protected loadStoreService: LoadStoreService,
        protected modalService: ModalService,
        protected tableService: TruckassistTableService,
        protected confirmationResetService: ConfirmationResetService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getStoreData();
    }

    private getStoreData(): void {
        // TODO: Dragan, do we need this?
        this.loadStoreService.loadDetailsSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.load = res.data;

                this.setDropdownMenuOptions(res?.data.statusType?.name);
            });
    }

    private setDropdownMenuOptions(statusType: string): void {
        this.dropdownMenuOptions =
            DropdownMenuContentHelper.getLoadDropdownContent(statusType, true);
    }

    public onDetailsDropdownMenuActions(action: IDropdownMenuOptionEmit): void {
        const { type } = action;
        const { id, statusType } = this.load;

        const mappedAction = {
            type,
            id,
            data: this.load,
        };

        this.handleDropdownMenuActions(
            mappedAction,
            eDropdownMenu.LOAD,
            statusType.name,
            true
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
