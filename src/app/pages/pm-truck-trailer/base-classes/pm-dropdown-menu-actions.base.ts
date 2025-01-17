// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// components
import { PmModalComponent } from '@pages/pm-truck-trailer/pages/pm-modal/pm-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';

// enums
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';

// helpers
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// models
import { TableCardBodyActions } from '@shared/models';
import { PMTrailerUnitResponse, PMTruckUnitResponse } from 'appcoretruckassist';

export abstract class PmDropdownMenuActionsBase extends DropdownMenuActionsBase {
    constructor(
        // services
        protected modalService: ModalService
    ) {
        super(modalService);
    }

    protected handleDropdownMenuActions<
        T extends PMTruckUnitResponse | PMTrailerUnitResponse,
    >(event: TableCardBodyActions<T>, tableType: string) {
        const { data, type } = event;

        type === DropdownMenuStringEnum.CONFIGURE_TYPE
            ? this.handleConfigureAction(data)
            : // call the parent class method to handle shared cases
              super.handleDropdownMenuActions(event, tableType);
    }

    private handleConfigureAction(
        data: PMTruckUnitResponse | PMTrailerUnitResponse
    ): void {
        const { id, isTruckUnit } =
            DropdownMenuActionsHelper.getPmRepairUnitId(data);

        const header = isTruckUnit
            ? TableStringEnum.CONFIGURE_TRUCK_PM_HEADER
            : TableStringEnum.CONFIGURE_TRAILER_PM_HEADER;

        this.modalService.openModal(
            PmModalComponent,
            { size: TableStringEnum.SMALL },
            {
                id,
                data,
                header,
                type: DropdownMenuStringEnum.EDIT_TYPE,
                action: TableStringEnum.UNIT_PM,
            }
        );
    }
}
