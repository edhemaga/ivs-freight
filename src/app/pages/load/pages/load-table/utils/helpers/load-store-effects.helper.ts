// components
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';

// enums
import { TableStringEnum } from '@shared/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// models
import {
    DispatcherFilterResponse,
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadTemplateResponse,
    UpdateLoadStatusCommand,
} from 'appcoretruckassist';
import { ConfirmationActivation } from '@shared/components/ta-shared-modals/confirmation-activation-modal/models';

export class LoadStoreEffectsHelper {
    public static getCreateLoadModalData(
        modalService: ModalService,
        loadModalData: LoadModalResponse
    ): void {
        modalService.openModal(
            LoadModalComponent,
            { size: TableStringEnum.LOAD },
            {
                loadModalData: {
                    ...loadModalData,
                },
            }
        );
    }

    public static getLoadOrTemplateByIdEditModal(
        modalService: ModalService,
        selectedTab: eLoadStatusType,
        eventType: string,
        response: LoadResponse | LoadTemplateResponse,
        statusDropdownResponse: LoadPossibleStatusesResponse,
        modalResponse: LoadModalResponse
    ): void {
        const editData = {
            data: {
                ...response,
            },
            statusDropdownData: {
                ...statusDropdownResponse,
            },
            loadModalData: {
                ...modalResponse,
            },
            type: eventType,
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
        response: LoadResponse | LoadTemplateResponse,
        modalResponse: LoadModalResponse
    ): void {
        const editData = {
            data: {
                ...response,
            },
            loadModalData: {
                ...modalResponse,
            },
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
}
