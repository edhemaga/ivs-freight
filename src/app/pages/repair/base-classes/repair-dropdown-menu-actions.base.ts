import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';
import { RepairService } from '@shared/services/repair.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { CardDetails, TableCardBodyActions } from '@shared/models';
import { RepairResponse } from 'appcoretruckassist';
import { MappedRepairShop } from '@pages/repair/pages/repair-table/models';

export abstract class RepairDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: MappedRepairShop[] | CardDetails[];

    constructor(
        protected router: Router,

        // services
        protected modalService: ModalService,
        protected repairService: RepairService
    ) {
        super(modalService, router);
    }

    protected handleDropdownMenuActions<T extends RepairResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.ALL_BILLS_TYPE:
                this.handleAllBillsAction();

                break;
            case DropdownMenuStringEnum.FINISH_ORDER_TYPE:
            case DropdownMenuStringEnum.WRITE_REVIEW_TYPE:
                this.handleConvertedToEditTypeAction(event, tableType);

                break;
            case DropdownMenuStringEnum.ALL_ORDERS_TYPE:
                this.handleAllOrdersAction();

                break;
            case DropdownMenuStringEnum.MARK_AS_FAVORITE_TYPE:
            case DropdownMenuStringEnum.UNMARK_FAVORITE_TYPE:
                this.handleFavoriteAction(id);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleAllBillsAction(): void {}

    private handleAllOrdersAction(): void {}

    private handleFavoriteAction(repairShopId: number): void {
        this.repairService
            .updateRepairShopFavorite(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData.sort(
                    (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
                );

                const favoritedRepairShop = this.viewData.find(
                    (item) => item.id === repairShopId
                );

                this.updateMapItem(favoritedRepairShop);
            });
    }

    private handleConvertedToEditTypeAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = event;

        const additionalProperties =
            DropdownMenuActionsHelper.createEditActionModalAdditionalProperties(
                type
            );

        const adjustedEvent = {
            ...event,
            type: DropdownMenuStringEnum.EDIT_TYPE,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    // protected abstract - dependency
    protected abstract updateMapItem<T>(repairShop?: T): void;
}
