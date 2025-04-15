import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// Enums
import { eColor } from '@shared/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// Components
import {
    CaLoadStatusComponent,
    CaStatusChangeDropdownComponent,
} from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

// Models
import { LoadStatusResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbPopoverModule,
        // Components
        NewTableComponent,
        CaLoadStatusComponent,
        CaStatusChangeDropdownComponent,
    ],
})
export class NewLoadTableComponent implements OnInit {
    public destroy$ = new Subject<void>();
    public changeStatusPopover: NgbPopover;

    public eColor = eColor;

    constructor(protected loadStoreService: LoadStoreService) {}

    ngOnInit(): void {
        this.initChangeStatusDropdownListener();
    }

    public navigateToLoadDetails(id: number): void {
        this.loadStoreService.navigateToLoadDetails(id);
    }

    public onOpenModal(id: number, selectedTab: eLoadStatusStringType): void {
        const isTemplate = selectedTab === eLoadStatusStringType.TEMPLATE;

        this.loadStoreService.onOpenModal({
            id,
            isTemplate,
            isEdit: true,
        });
    }

    public onNextStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchUpdateLoadStatus(status);
    }

    public onPreviousStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchRevertLoadStatus(status);
    }

    public openChangeStatuDropdown(tooltip: NgbPopover, loadId: number): void {
        this.changeStatusPopover = tooltip;
        this.loadStoreService.dispatchOpenChangeStatuDropdown(loadId);
    }

    public initChangeStatusDropdownListener(): void {
        this.loadStoreService.changeDropdownpossibleStatusesSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) this.changeStatusPopover.open();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
