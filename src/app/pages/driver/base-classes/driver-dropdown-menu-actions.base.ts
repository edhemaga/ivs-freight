import { Subject, takeUntil, tap } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// enums
import { eDropdownMenu, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { TableCardBodyActions } from '@shared/models';
import { DriverMapped } from '@pages/driver/models/driver-mapped.model';

export abstract class DriverDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;

    // services
    protected abstract driverService: DriverService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends DriverMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { type } = action;

        const tabSelected = action.data?.status
            ? TableStringEnum.ACTIVE
            : TableStringEnum.INACTIVE;

        switch (type) {
            case eDropdownMenu.EDIT_TYPE:
                this.handleDriverEditAction(action, tableType);

                break;
            case eDropdownMenu.CDL_TYPE:
            case eDropdownMenu.TEST_TYPE:
            case eDropdownMenu.MEDICAL_EXAM_TYPE:
            case eDropdownMenu.MVR_TYPE:
                this.handleDriverAddActions(action, tabSelected);

                break;
            case eDropdownMenu.ACTIVATE_TYPE:
            case eDropdownMenu.DEACTIVATE_TYPE:
                this.handleDriverActivateDeactivateAction(action, tableType);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleDriverDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleDriverEditAction<T extends DriverMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            id,
            data: { avatarImg, avatarColor, textShortName, fullName, tableDOB },
            type,
        } = action;

        this.driverService
            .getDriverById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((driver) => {
                    const adjustedAction = {
                        data: {
                            ...driver,
                            avatarImg,
                            avatarColor,
                            textShortName,
                            name: fullName,
                            tableDOB,
                        },
                        type,
                        id,
                        disableButton: true,
                        isDeactivateOnly: true,
                    };

                    super.handleSharedDropdownMenuActions(
                        adjustedAction,
                        tableType
                    );
                })
            )
            .subscribe();
    }

    private handleDriverAddActions<T>(
        action: TableCardBodyActions<T>,
        tabSelected: string
    ): void {
        const { type } = action;

        const addAdditionalModalComponent =
            DropdownMenuActionsHelper.getAddDriverAdditionalModalComponent(
                type
            );

        this.modalService.openModal(
            addAdditionalModalComponent,
            { size: eDropdownMenu.SMALL },
            { ...action, tableActiveTab: tabSelected }
        );
    }

    private handleDriverActivateDeactivateAction<T extends DriverMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { fullName },
            type,
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...action.data,
                name: fullName,
            },
            template: TableStringEnum.DRIVER_1,
            subType: TableStringEnum.DRIVER_1,
            type,
            tableType,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }

    private handleDriverDeleteAction<T extends DriverMapped>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { fullName },
            type,
        } = action;

        const adjustedAction = {
            ...action,
            data: {
                ...action.data,
                name: fullName,
            },
            template: eDropdownMenu.DRIVER,
            type,
            image: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
