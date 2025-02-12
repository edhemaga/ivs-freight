import { Router } from '@angular/router';

// components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { RepairOrderModalComponent } from '@pages/repair/pages/repair-modals/repair-order-modal/repair-order-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { ModalService } from '@shared/services/modal.service';

// models
import { TableCardBodyActions } from '@shared/models';
import {
    PMTrailerUnitResponse,
    PMTruckUnitResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

export abstract class DropdownMenuActionsBase {
    // router
    protected router: Router;

    // services
    protected abstract modalService: ModalService;

    constructor() {}

    protected handleSharedDropdownMenuActions<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, data, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleEditAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleDeleteAction(event, tableType);

                break;
            case DropdownMenuStringEnum.VIEW_DETAILS_TYPE:
                this.handleViewDetailsAction(id, tableType);

                break;
            case DropdownMenuStringEnum.SHOW_MORE:
                this.handleShowMoreAction();

                break;
            case DropdownMenuStringEnum.SHARE_TYPE:
                this.handleShareAction();

                break;
            case DropdownMenuStringEnum.PRINT_TYPE:
                this.handlePrintAction();

                break;
            case DropdownMenuStringEnum.SEND_MESSAGE_TYPE:
                this.handleSendMessageAction();

                break;
            case DropdownMenuStringEnum.ADD_REPAIR_BILL_TYPE:
                this.handleAddRepairBillAction(data, tableType);

                break;
            case DropdownMenuStringEnum.OPEN_BUSINESS_TYPE:
            case DropdownMenuStringEnum.CLOSE_BUSINESS_TYPE:
                this.handleOpenCloseBusinessAction(event);

                break;
            case DropdownMenuStringEnum.ACTIVATE_TYPE:
            case DropdownMenuStringEnum.DEACTIVATE_TYPE:
                this.handleActivateDeactivateAction(event);

                break;
            case DropdownMenuStringEnum.REGISTRATION_TYPE:
            case DropdownMenuStringEnum.FHWA_INSPECTION_TYPE:
            case DropdownMenuStringEnum.TITLE_TYPE:
                this.handleTruckTrailerAddActions(event);

                break;
            case DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE:
            case DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST_TYPE:
            case DropdownMenuStringEnum.MOVE_TO_DNU_LIST_TYPE:
            case DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST_TYPE:
                this.handleMoveAction(event, tableType);

                break;
            default:
                break;
        }
    }

    private handleEditAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const editActionModalComponent =
            DropdownMenuActionsHelper.getEditActionModalComponent(tableType);

        this.modalService.openModal(
            editActionModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
            }
        );
    }

    private handleDeleteAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
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
            tableType === DropdownMenuStringEnum.PM
                ? isTruckUnit
                    ? DropdownMenuStringEnum.ADD_REPAIR_BILL_TRUCK
                    : DropdownMenuStringEnum.ADD_REPAIR_BILL_TRAILER
                : DropdownMenuStringEnum.ADD_REPAIR_BILL_SHOP;

        const modalData = {
            type,
            preSelectedUnit: tableType === DropdownMenuStringEnum.PM && id,
            data: tableType !== DropdownMenuStringEnum.PM && { id: data.id },
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
        event: TableCardBodyActions<T>
    ): void {
        const {
            data: { status },
        } = event;

        const type = status ? TableStringEnum.CLOSE : TableStringEnum.OPEN;

        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
                type,
            }
        );
    }

    private handleActivateDeactivateAction<T>(
        event: TableCardBodyActions<T>
    ): void {
        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            {
                ...event,
            }
        );
    }

    private handleTruckTrailerAddActions<T>(
        event: TableCardBodyActions<T>
    ): void {
        const { type } = event;

        const addAdditionalModalComponent =
            DropdownMenuActionsHelper.getAddTruckTrailerAdditionalModalComponent(
                type
            );

        this.modalService.openModal(
            addAdditionalModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            {
                ...event,
            }
        );
    }

    private handleMoveAction<T>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = event;
        const eventType =
            type ===
            (DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE ||
                DropdownMenuStringEnum.MOVE_TO_DNU_LIST_TYPE)
                ? DropdownMenuStringEnum.MOVE
                : DropdownMenuStringEnum.REMOVE;

        this.modalService.openModal(
            ConfirmationMoveModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
                type: eventType,
                template: tableType,
            }
        );
    }

    // protected abstract - dependency
    protected abstract handleShowMoreAction(): void;
}

/*   const raitingData = {
                entityTypeRatingId: 2,
                entityTypeId: event.data.id,
                thumb: event.subType === TableStringEnum.LIKE ? 1 : -1,
                tableData: event.data,
            };

            this.reviewRatingService
                .addRating(raitingData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    const newViewData = this.viewData.map((data) =>
                        data.id === event.data.id
                            ? {
                                  ...data,
                                  actionAnimation: TableStringEnum.UPDATE,
                                  tableShopRaiting: {
                                      hasLiked:
                                          res.currentCompanyUserRating === 1,
                                      hasDislike:
                                          res.currentCompanyUserRating === -1,
                                      likeCount: res.upCount,
                                      dislikeCount: res.downCount,
                                  },
                              }
                            : data
                    );

                    this.viewData = [...newViewData];

                    this.handleCloseAnimationAction(false);

                    this.mapsService.addRating(res);

                    this.updateMapItem(
                        this.viewData.find((item) => item.id === event.data.id)
                    );
                }); */
