import { Subject, takeUntil, tap } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

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
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { type } = event;

        const tabSelected = event.data?.status
            ? TableStringEnum.ACTIVE
            : TableStringEnum.INACTIVE;

        switch (type) {
            case DropdownMenuStringEnum.EDIT_TYPE:
                this.handleDriverEditAction(event, tableType);

                break;
            case DropdownMenuStringEnum.CDL_TYPE:
            case DropdownMenuStringEnum.TEST_TYPE:
            case DropdownMenuStringEnum.MEDICAL_EXAM_TYPE:
            case DropdownMenuStringEnum.MVR_TYPE:
                this.handleDriverAddActions(event, tabSelected);

                break;
            case DropdownMenuStringEnum.ACTIVATE_TYPE:
            case DropdownMenuStringEnum.DEACTIVATE_TYPE:
                this.handleDriverActivateDeactivateAction(event, tableType);

                break;
            case DropdownMenuStringEnum.DELETE_TYPE:
                this.handleDriverDeleteAction(event, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(event, tableType);

                break;
        }
    }

    private handleDriverEditAction<T extends DriverMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const {
            id,
            data: { avatarImg, avatarColor, textShortName, fullName, tableDOB },
            type,
        } = event;

        this.driverService
            .getDriverById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((driver) => {
                    const adjustedEvent = {
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
                        adjustedEvent,
                        tableType
                    );
                })
            )
            .subscribe();
    }

    private handleDriverAddActions<T>(
        event: TableCardBodyActions<T>,
        tabSelected: string
    ) {
        const { type } = event;

        const addAdditionalModalComponent =
            DropdownMenuActionsHelper.getAddDriverAdditionalModalComponent(
                type
            );

        this.modalService.openModal(
            addAdditionalModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            { ...event, tableActiveTab: tabSelected }
        );
    }

    private handleDriverActivateDeactivateAction<T extends DriverMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { fullName },
            type,
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
                name: fullName,
            },
            template: TableStringEnum.DRIVER_1,
            subType: TableStringEnum.DRIVER_1,
            type,
            tableType,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleDriverDeleteAction<T extends DriverMapped>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const {
            data: { fullName },
            type,
        } = event;

        const adjustedEvent = {
            ...event,
            data: {
                ...event.data,
                name: fullName,
            },
            template: DropdownMenuStringEnum.DRIVER,
            type,
            image: true,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }
}
