import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { RepairService } from '@shared/services/repair.service';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { CardDetails, TableCardBodyActions } from '@shared/models';
import { RepairResponse, RepairShopResponse } from 'appcoretruckassist';
import { MappedRepairShop } from '@pages/repair/pages/repair-table/models';

export abstract class RepairDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData:
        | MappedRepairShop[]
        | CardDetails[]
        | RepairResponse[];

    // services
    protected abstract repairService: RepairService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends RepairResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, type } = action;

        switch (type) {
            case eDropdownMenu.ALL_BILLS_TYPE:
                this.handleAllBillsAction();

                break;
            case eDropdownMenu.FINISH_ORDER_TYPE:
            case eDropdownMenu.WRITE_REVIEW_TYPE:
                this.handleConvertedToEditTypeAction(action, tableType);

                break;
            case eDropdownMenu.ALL_ORDERS_TYPE:
                this.handleAllOrdersAction();

                break;
            case eDropdownMenu.MARK_AS_FAVORITE_TYPE:
            case eDropdownMenu.UNMARK_FAVORITE_TYPE:
                this.handleFavoriteAction(id);

                break;
            case eDropdownMenu.OPEN_BUSINESS_TYPE:
            case eDropdownMenu.CLOSE_BUSINESS_TYPE:
                this.handleRepairShopOpenCloseBusinessAction(action, tableType);

                break;
            case eDropdownMenu.RATING_LIKE_TYPE:
            case eDropdownMenu.RATING_DISLIKE_TYPE:
                this.handleRepairShopLikeDislikeAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleAllBillsAction(): void {}

    private handleConvertedToEditTypeAction<T>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = action;

        const additionalProperties =
            DropdownMenuActionsHelper.createEditActionModalAdditionalProperties(
                type
            );

        const adjustedAction = {
            ...action,
            type: eDropdownMenu.EDIT_TYPE,
            ...additionalProperties,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleAllOrdersAction(): void {}

    private handleFavoriteAction(repairShopId: number): void {
        this.repairService
            .updateRepairShopFavorite(repairShopId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.viewData.sort(
                    (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
                );
            });
    }

    private handleRepairShopOpenCloseBusinessAction<
        T extends RepairShopResponse,
    >(action: TableCardBodyActions<T>, tableType: string): void {
        const {
            data: { name, address },
        } = action;

        const adjustedAction = {
            ...action,
            template: TableStringEnum.INFO,
            subType: TableStringEnum.REPAIR_SHOP,
            subTypeStatus: TableStringEnum.BUSINESS,
            tableType: ConfirmationActivationStringEnum.REPAIR_SHOP_TEXT,
            modalTitle: name,
            modalSecondTitle: address.address,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleRepairShopLikeDislikeAction<T extends RepairShopResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, type, data } = action;

        const thumb = type === eDropdownMenu.RATING_LIKE_TYPE ? 1 : -1;

        const rating = {
            entityTypeRatingId: 2,
            entityTypeId: id,
            thumb,
            tableData: data,
        };

        const adjustedAction = {
            ...action,
            rating,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
