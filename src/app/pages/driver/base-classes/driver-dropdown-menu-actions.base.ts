import { Subject, takeUntil, tap } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// components
import { DriverCdlModalComponent } from '../pages/driver-modals/driver-cdl-modal/driver-cdl-modal.component';
import { DriverDrugAlcoholTestModalComponent } from '../pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';
import { DriverMedicalModalComponent } from '../pages/driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverMvrModalComponent } from '../pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import { DriverResponse } from 'appcoretruckassist';

export abstract class DriverDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;

    // services
    protected abstract driverService: DriverService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T>(
        event: TableCardBodyActions<any>,
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
                this.handleDriverAddCdlAction(event, tabSelected);

                break;
            case DropdownMenuStringEnum.TEST_TYPE:
                this.handleDriverAddTestAction(event, tabSelected);

                break;
            case DropdownMenuStringEnum.MEDICAL_EXAM_TYPE:
                this.handleDriverAddMedicalExamAction(event, tabSelected);

                break;
            case DropdownMenuStringEnum.MVR_TYPE:
                this.handleDriverAddMvrAction(event, tabSelected);

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

    private handleDriverEditAction<T>(
        event: TableCardBodyActions<any>,
        tableType: string
    ) {
        const {
            data: { avatarImg, avatarColor, textShortName, fullName, tableDOB },
            id,
        } = event;
        this.driverService
            .getDriverById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((driver: DriverResponse) => {
                    const editData = {
                        data: {
                            ...driver,
                            avatarImg: avatarImg,
                            avatarColor: avatarColor,
                            textShortName: textShortName,
                            name: fullName,
                            tableDOB: tableDOB,
                        },
                        type: DropdownMenuStringEnum.EDIT_TYPE,
                        id,
                        disableButton: true,
                        isDeactivateOnly: true,
                    };

                    super.handleSharedDropdownMenuActions(editData, tableType);
                })
            )
            .subscribe();
    }

    private handleDriverAddCdlAction<T>(
        event: TableCardBodyActions<T>,
        tabSelected: string
    ) {
        this.modalService.openModal(
            DriverCdlModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            { ...event, tableActiveTab: tabSelected }
        );
    }

    private handleDriverAddTestAction<T>(
        event: TableCardBodyActions<T>,
        tabSelected: string
    ) {
        this.modalService.openModal(
            DriverDrugAlcoholTestModalComponent,
            {
                size: DropdownMenuStringEnum.SMALL,
            },
            { ...event, tableActiveTab: tabSelected }
        );
    }

    private handleDriverAddMedicalExamAction<T>(
        event: TableCardBodyActions<T>,
        tabSelected: string
    ) {
        this.modalService.openModal(
            DriverMedicalModalComponent,
            {
                size: DropdownMenuStringEnum.SMALL,
            },
            { ...event, tableActiveTab: tabSelected }
        );
    }

    private handleDriverAddMvrAction<T>(
        event: TableCardBodyActions<T>,
        tabSelected: string
    ) {
        this.modalService.openModal(
            DriverMvrModalComponent,
            { size: DropdownMenuStringEnum.SMALL },
            { ...event, tableActiveTab: tabSelected }
        );
    }

    private handleDriverActivateDeactivateAction<T>(
        event: TableCardBodyActions<any>,
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
            template: DropdownMenuStringEnum.DRIVER_1,
            subType: DropdownMenuStringEnum.DRIVER_1,
            type,
            tableType,
        };

        super.handleSharedDropdownMenuActions(adjustedEvent, tableType);
    }

    private handleDriverDeleteAction<T>(
        event: TableCardBodyActions<any>,
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
