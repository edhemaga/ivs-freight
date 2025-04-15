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
    CaStatusChangeDropdownComponent,
    CaCheckboxComponent,
    CaLoadStatusComponent,
    CaCheckboxSelectedCountComponent,
    ePosition,
} from 'ca-components';
import { NewTableComponent } from '@shared/components/new-table/new-table.component';

// Models
import { LoadStatusResponse } from 'appcoretruckassist';

// Mixing
import { DestroyableMixin } from '@shared/mixins';

@Component({
    selector: 'app-new-load-table',
    templateUrl: './new-load-table.component.html',
    styleUrl: './new-load-table.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        NgbPopover,

        // Components
        NewTableComponent,
        CaLoadStatusComponent,
        CaCheckboxComponent,
        CaCheckboxSelectedCountComponent,
        CaStatusChangeDropdownComponent,
    ],
})
export class NewLoadTableComponent
    extends DestroyableMixin(class {})
    implements OnInit
{
    public changeStatusPopover: NgbPopover;

    public eColor = eColor;
    public ePosition = ePosition;

    constructor(protected loadStoreService: LoadStoreService) {
        super();
    }

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

    public onHandleShowMoreClick(): void {
        this.loadStoreService.getNewPage();
    }

    public onNextStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchUpdateLoadStatus(status);
    }

    public onPreviousStatus(status: LoadStatusResponse): void {
        this.loadStoreService.dispatchRevertLoadStatus(status);
    }

    public onOpenChangeStatusDropdown(
        tooltip: NgbPopover,
        loadId: number
    ): void {
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

    public onCheckboxCountClick(action: string): void {
        this.loadStoreService.onSelectAll(action);
    }

    public onSelectLoad(id: number): void {
        this.loadStoreService.onSelectLoad(id);
    }
}
