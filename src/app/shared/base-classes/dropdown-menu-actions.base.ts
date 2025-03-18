import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { ModalService } from '@shared/services/modal.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

// models
import { TableCardBodyActions } from '@shared/models';
import {
    CreateRatingCommand,
    PMTrailerUnitResponse,
    PMTruckUnitResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

export abstract class DropdownMenuActionsBase {
    protected destroy$: Subject<void>;

    // router
    protected router: Router;

    // services
    protected abstract modalService: ModalService;

    protected reviewsRatingService: ReviewsRatingService;

    constructor() {}

    protected handleSharedDropdownMenuActions<T>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, data, type } = action;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleEditAction(action, tableType);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleDeleteAction(action, tableType);

                break;
            case eDropdownMenu.VIEW_DETAILS_TYPE:
                this.handleViewDetailsAction(id, tableType);

                break;
            case eDropdownMenu.SHOW_MORE:
                this.handleShowMoreAction();

                break;
            case eDropdownMenu.SHARE_TYPE:
                this.handleShareAction();

                break;
            case eDropdownMenu.PRINT_TYPE:
                this.handlePrintAction();

                break;
            case eDropdownMenu.SEND_MESSAGE_TYPE:
                this.handleSendMessageAction();

                break;
            case eDropdownMenu.ADD_REPAIR_BILL_TYPE:
            case eDropdownMenu.ADD_PM_ITEM:
                this.handleAddRepairBillAction(data, tableType);

                break;
            case eDropdownMenu.OPEN_BUSINESS_TYPE:
            case eDropdownMenu.CLOSE_BUSINESS_TYPE:
                this.handleOpenCloseBusinessAction(action);

                break;
            case eDropdownMenu.ACTIVATE_TYPE:
            case eDropdownMenu.DEACTIVATE_TYPE:
                this.handleActivateDeactivateAction(action);

                break;
            case eDropdownMenu.REGISTRATION_TYPE:
            case eDropdownMenu.FHWA_INSPECTION_TYPE:
            case eDropdownMenu.TITLE_TYPE:
                this.handleTruckTrailerAddActions(action);

                break;
            case eDropdownMenu.RATING_LIKE_TYPE:
            case eDropdownMenu.RATING_DISLIKE_TYPE:
                this.handleLikeDislikeAction(action);

                break;
            default:
                break;
        }
    }

    private handleEditAction<T>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const editActionModalComponent =
            DropdownMenuActionsHelper.getEditActionModalComponent(tableType);

        this.modalService.openModal(
            editActionModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...action,
            }
        );
    }

    private handleDeleteAction<T>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...action,
                template: tableType,
            }
        );
    }

    private handleViewDetailsAction(id: number, tableType: string): void {
        const link = DropdownMenuActionsHelper.createViewDetailsActionLink(
            id,
            tableType
        );

        this.router.navigate([link]);
    }

    private handleShareAction(): void {}

    private handlePrintAction(): void {}

    private handleSendMessageAction(): void {}

    private handleAddRepairBillAction(
        data: PMTruckUnitResponse | PMTrailerUnitResponse | RepairShopResponse,
        tableType: string
    ): void {
        const { id, isTruckUnit } = DropdownMenuActionsHelper.getPmRepairUnitId(
            data,
            tableType
        );

        const type =
            tableType === eDropdownMenu.PM
                ? isTruckUnit
                    ? eDropdownMenu.ADD_REPAIR_BILL_TRUCK
                    : eDropdownMenu.ADD_REPAIR_BILL_TRAILER
                : eDropdownMenu.ADD_REPAIR_BILL_SHOP;

        const modalData = {
            type,
            preSelectedUnit: tableType === eDropdownMenu.PM && id,
            data: tableType !== eDropdownMenu.PM && { id: data.id },
            title: eDropdownMenu.TITLE_TYPE in data ? data.title : null,
        };

        this.modalService.openModal(
            RepairOrderModalComponent,
            { size: TableStringEnum.LARGE },
            {
                ...modalData,
            }
        );
    }

    private handleOpenCloseBusinessAction<T extends { status?: number }>(
        action: TableCardBodyActions<T>
    ): void {
        const {
            data: { status },
        } = action;

        const type = status ? TableStringEnum.CLOSE : TableStringEnum.OPEN;

        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...action,
                type,
            }
        );
    }

    private handleActivateDeactivateAction<T>(
        action: TableCardBodyActions<T>
    ): void {
        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: eDropdownMenu.SMALL },
            {
                ...action,
            }
        );
    }

    private handleTruckTrailerAddActions<T>(
        action: TableCardBodyActions<T>
    ): void {
        const { type } = action;

        const addAdditionalModalComponent =
            DropdownMenuActionsHelper.getAddTruckTrailerAdditionalModalComponent(
                type
            );

        this.modalService.openModal(
            addAdditionalModalComponent,
            { size: eDropdownMenu.SMALL },
            {
                ...action,
            }
        );
    }

    private handleLikeDislikeAction<T extends { rating?: CreateRatingCommand }>(
        action: TableCardBodyActions<T>
    ): void {
        const {
            data: { rating },
        } = action;

        this.reviewsRatingService
            .addRating(rating)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    // protected abstract - dependency
    protected abstract handleShowMoreAction(): void;
}
