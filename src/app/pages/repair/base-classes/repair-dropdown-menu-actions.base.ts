import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { RepairService } from '@shared/services/repair.service';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { CardDetails, TableCardBodyActions } from '@shared/models';
import { RepairResponse, RepairShopResponse } from 'appcoretruckassist';
import { MappedRepairShop } from '@pages/repair/pages/repair-table/models';

export abstract class RepairDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: MappedRepairShop[] | CardDetails[];

    // services
    protected abstract repairService: RepairService;

    constructor() {
        super();
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
            case DropdownMenuStringEnum.OPEN_BUSINESS_TYPE:
            case DropdownMenuStringEnum.CLOSE_BUSINESS_TYPE:
                this.handleRepairShopOpenCloseBusinessAction(event, tableType);

                break;
            case DropdownMenuStringEnum.RATING_LIKE_TYPE:
            case DropdownMenuStringEnum.RATING_DISLIKE_TYPE:
                this.handleRepairShopLikeDislikeAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleAllBillsAction(): void {}

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
    >(event: TableCardBodyActions<T>, tableType: string): void {
        const {
            data: { name, address },
        } = event;

        const adjustedEvent = {
            ...event,
            template: TableStringEnum.INFO,
            subType: TableStringEnum.REPAIR_SHOP,
            subTypeStatus: TableStringEnum.BUSINESS,
            tableType: ConfirmationActivationStringEnum.REPAIR_SHOP_TEXT,
            modalTitle: name,
            modalSecondTitle: address.address,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleRepairShopLikeDislikeAction<T extends RepairShopResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, type, data } = event;

        const thumb = type === DropdownMenuStringEnum.RATING_LIKE_TYPE ? 1 : -1;

        const rating = {
            entityTypeRatingId: 2,
            entityTypeId: id,
            thumb,
            tableData: data,
        };

        const adjustedEvent = {
            ...event,
            rating,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
