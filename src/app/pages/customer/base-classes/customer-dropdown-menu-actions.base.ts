// components
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { DetailsDataService } from '@shared/services/details-data.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// enums
import { eDropdownMenu } from '@shared/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

// models
import { MappedShipperBroker } from '@pages/customer/pages/customer-table/models/mapped-shipper-broker.model';
import { TableCardBodyActions } from '@shared/models';

export abstract class CustomerDropdownMenuActionsBase extends DropdownMenuActionsBase {
    // services
    protected abstract detailsDataService: DetailsDataService;
    protected abstract loadStoreService: LoadStoreService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends MappedShipperBroker>(
        action: TableCardBodyActions<T>,
        selectedTab: string
    ): void {
        const { type } = action;

        const tableType =
            selectedTab === eDropdownMenu.ACTIVE
                ? eDropdownMenu.BROKER
                : eDropdownMenu.SHIPPER;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
            case eDropdownMenu.ADD_CONTACT_TYPE:
            case eDropdownMenu.WRITE_REVIEW_TYPE:
                this.handleShipperBrokerEditAction(action, tableType);

                break;
            case eDropdownMenu.CREATE_LOAD_TYPE:
                this.handleCreateLoadAction();

                break;
            case eDropdownMenu.MOVE_TO_BAN_LIST_TYPE:
            case eDropdownMenu.REMOVE_FROM_BAN_LIST_TYPE:
            case eDropdownMenu.MOVE_TO_DNU_LIST_TYPE:
            case eDropdownMenu.REMOVE_FROM_DNU_LIST_TYPE:
                this.handleBrokerMoveActions(action, tableType);

                break;
            case eDropdownMenu.CLOSE_BUSINESS_TYPE:
            case eDropdownMenu.OPEN_BUSINESS_TYPE:
                this.handleShipperBrokerCloseBusinessActions(action, tableType);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleShipperBrokerDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleShipperBrokerEditAction<T extends MappedShipperBroker>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = action;

        this.detailsDataService.setNewData(action.data);

        const openedTab =
            type === eDropdownMenu.ADD_CONTACT_TYPE
                ? eDropdownMenu.ADDITIONAL
                : type === eDropdownMenu.WRITE_REVIEW_TYPE
                  ? eDropdownMenu.REVIEW
                  : eDropdownMenu.BASIC;

        const adjustedAction = {
            ...action,
            type: eDropdownMenu.EDIT_TYPE,
            ...(tableType === eDropdownMenu.BROKER && {
                dnuButton: true,
                bfbButton: true,
                tab: 3,
            }),
            openedTab,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleBrokerMoveActions<T extends MappedShipperBroker>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: {
                businessName,
                mainAddress: { address },
            },
            type,
        } = action;

        const subType =
            type === eDropdownMenu.MOVE_TO_BAN_LIST_TYPE ||
            type === eDropdownMenu.REMOVE_FROM_BAN_LIST_TYPE
                ? eDropdownMenu.BAN
                : eDropdownMenu.DNU;

        const modalTitle =
            typeof businessName === 'string' ? businessName : businessName.name;

        const modalType =
            type === eDropdownMenu.MOVE_TO_BAN_LIST_TYPE ||
            type === eDropdownMenu.MOVE_TO_DNU_LIST_TYPE
                ? eDropdownMenu.MOVE
                : eDropdownMenu.REMOVE;

        const adjustedAction = {
            ...action,
            subType,
            tableType,
            modalTitle,
            modalSecondTitle: address,
        };

        this.modalService.openModal(
            ConfirmationMoveModalComponent,
            { size: eDropdownMenu.SMALL },
            {
                ...adjustedAction,
                type: modalType,
                template: tableType,
            }
        );
    }

    private handleCreateLoadAction(): void {
        this.loadStoreService.dispatchGetCreateLoadModalData();
    }

    private handleShipperBrokerCloseBusinessActions<
        T extends MappedShipperBroker,
    >(action: TableCardBodyActions<T>, tableType: string): void {
        const {
            data: { businessName },
        } = action;

        const subType =
            tableType === eDropdownMenu.SHIPPER
                ? eDropdownMenu.SHIPPER_2
                : eDropdownMenu.BROKER_2;

        const modalTitle =
            typeof businessName === 'string' ? businessName : businessName.name;

        const modalSecondTitle =
            action.data?.mainAddress?.address ?? action.data?.address?.address;

        const adjustedAction = {
            ...action,
            template: eDropdownMenu.INFO,
            subType,
            subTypeStatus: eDropdownMenu.BUSINESS,
            tableType,
            modalTitle,
            modalSecondTitle,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleShipperBrokerDeleteAction<T extends MappedShipperBroker>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const modalHeaderTitle =
            tableType === eDropdownMenu.SHIPPER
                ? ConfirmationModalStringEnum.DELETE_SHIPPER
                : ConfirmationModalStringEnum.DELETE_BROKER;

        const adjustedAction = {
            ...action,
            svg: true,
            modalHeaderTitle,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
