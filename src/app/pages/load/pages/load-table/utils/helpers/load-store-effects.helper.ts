// components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// enums
import { TableStringEnum } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// models
import {
    DispatcherFilterResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models';

export class LoadStoreEffectsHelper {
    public static getCreateLoadModalData(
        modalService: ModalService
    ): void {
        modalService.openModal(
            LoadModalComponent,
            { size: TableStringEnum.LOAD },
            {
                type: LoadModalStringEnum.CREATE
            }
        );
    }

    public static getLoadOrTemplateByIdEditModal(
        modalService: ModalService,
        selectedTab: eLoadStatusType,
        eventType: string
    ): void {
        const editData = {
            type: eventType,
            eventType: eventType,
            selectedTab: eLoadStatusType[selectedTab]?.toLowerCase(),
        };

        modalService.openModal(
            LoadModalComponent,
            { size: TableStringEnum.LOAD },
            {
                ...editData,
                disableButton: false,
            }
        );
    }

    public static getConvertToLoadOrTemplateModalData(
        modalService: ModalService,
        selectedTab: eLoadStatusType,
        eventType: string,
    ): void {
        const editData = {
            type: eventType,
            selectedTab: eLoadStatusType[selectedTab]?.toLowerCase(),
        };

        modalService.openModal(
            LoadModalComponent,
            { size: TableStringEnum.LOAD },
            {
                ...editData,
                disableButton: false,
                loadAction: eventType,
                selectedTab:
                    eventType ===
                    TableStringEnum.CONVERT_TO_TEMPLATE
                        ? TableStringEnum.TEMPLATE
                        : null,
            }
        );
    }

    public static composeUpdateLoadStatusCommand(param: ConfirmationActivation): UpdateLoadStatusCommand {
        const { data, newLocation, id } = (param as any) || {};
        const { nameBack } = data || {};
        const { address, longLat } = newLocation || {};
        const { longitude, latitude } = longLat || {};

        const result: UpdateLoadStatusCommand = {
            id,
            status: nameBack,
            repairLocation: address,
            longitude,
            latitude,
        };

        return result;
    }

    public static getLoadStatusFilter(tableService: TruckassistTableService, dispatcherFilterResponse: DispatcherFilterResponse[], selectedTab: eLoadStatusType ): void {
        const _options = dispatcherFilterResponse.map(_ => {
            return {
                ..._,
                isSelected: false
            }
        });
        const filterOptionsData = {
            selectedTab: eLoadStatusType[selectedTab],
            options: [..._options]
        };

        tableService.sendLoadStatusFilter(
            filterOptionsData
        );
    }
}
