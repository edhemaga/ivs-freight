// components
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { DetailsDataService } from '@shared/services/details-data.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';
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
    ) {
        const { type } = action;

        const tableType =
            selectedTab === DropdownMenuStringEnum.ACTIVE
                ? DropdownMenuStringEnum.BROKER
                : DropdownMenuStringEnum.SHIPPER;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
            case DropdownMenuStringEnum.ADD_CONTACT_TYPE:
            case DropdownMenuStringEnum.WRITE_REVIEW_TYPE:
                this.handleShipperBrokerEditAction(action, tableType);

                break;
            case DropdownMenuStringEnum.CREATE_LOAD_TYPE:
                this.handleCreateLoadAction();

                break;
            case DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE:
            case DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST_TYPE:
            case DropdownMenuStringEnum.MOVE_TO_DNU_LIST_TYPE:
            case DropdownMenuStringEnum.REMOVE_FROM_DNU_LIST_TYPE:
                this.handleBrokerMoveActions(action, tableType);

                break;
            case DropdownMenuStringEnum.CLOSE_BUSINESS_TYPE:
            case DropdownMenuStringEnum.OPEN_BUSINESS_TYPE:
                this.handleShipperBrokerCloseBusinessActions(action, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
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
    ) {
        const { type } = action;

        this.detailsDataService.setNewData(action.data);

        const openedTab =
            type === DropdownMenuStringEnum.ADD_CONTACT_TYPE
                ? DropdownMenuStringEnum.ADDITIONAL
                : type === DropdownMenuStringEnum.WRITE_REVIEW_TYPE
                  ? DropdownMenuStringEnum.REVIEW
                  : DropdownMenuStringEnum.BASIC;

        const adjustedAction = {
            ...action,
            type: DropdownMenuStringEnum.EDIT_TYPE,
            ...(tableType === DropdownMenuStringEnum.BROKER && {
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
    ) {
        const {
            data: {
                businessName,
                mainAddress: { address },
            },
            type,
        } = action;

        const subType =
            type === DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE ||
            type === DropdownMenuStringEnum.REMOVE_FROM_BAN_LIST_TYPE
                ? DropdownMenuStringEnum.BAN
                : DropdownMenuStringEnum.DNU;

        const modalTitle =
            typeof businessName === 'string' ? businessName : businessName.name;

        const modalType =
            type ===
            (DropdownMenuStringEnum.MOVE_TO_BAN_LIST_TYPE ||
                DropdownMenuStringEnum.MOVE_TO_DNU_LIST_TYPE)
                ? DropdownMenuStringEnum.MOVE
                : DropdownMenuStringEnum.REMOVE;

        const adjustedAction = {
            ...action,
            subType,
            tableType,
            modalTitle,
            modalSecondTitle: address,
        };

        this.modalService.openModal(
            ConfirmationMoveModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            {
                ...adjustedAction,
                type: modalType,
                template: tableType,
            }
        );
    }

    private handleCreateLoadAction() {
        this.loadStoreService.dispatchGetCreateLoadModalData();
    }

    private handleShipperBrokerCloseBusinessActions<
        T extends MappedShipperBroker,
    >(action: TableCardBodyActions<T>, tableType: string) {
        const {
            data: { businessName },
        } = action;

        const subType =
            tableType === DropdownMenuStringEnum.SHIPPER
                ? DropdownMenuStringEnum.SHIPPER_2
                : DropdownMenuStringEnum.BROKER_2;

        const modalTitle =
            typeof businessName === 'string' ? businessName : businessName.name;

        const modalSecondTitle =
        action.data?.mainAddress?.address ?? action.data?.address?.address;

        const adjustedAction = {
            ...action,
            template: DropdownMenuStringEnum.INFO,
            subType,
            subTypeStatus: DropdownMenuStringEnum.BUSINESS,
            tableType,
            modalTitle,
            modalSecondTitle,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleShipperBrokerDeleteAction<T extends MappedShipperBroker>(
        action: TableCardBodyActions<T>,
        tableType: string
    ) {
        const modalHeaderTitle =
            tableType === DropdownMenuStringEnum.SHIPPER
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
