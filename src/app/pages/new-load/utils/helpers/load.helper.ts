// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eSharedString } from '@shared/enums';

// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// Models
import { ITableData } from '@shared/models';

// Modesl
import {
    LoadListDto,
    LoadListResponse,
    LoadTemplateResponse,
} from 'appcoretruckassist';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';
import { MethodsCalculationsHelper } from '@shared/utils/helpers';

export class LoadHelper {
    static loadMapper(
        loads: LoadListDto[] | LoadTemplateResponse[],
        selectedTab: eLoadStatusStringType
    ): IMappedLoad[] {
        return loads.map((load) => {
            const {
                id,
                loadNumber,
                status,
                dispatcher,
                loadDetails,
                totalDue,
                broker,
                driver,
                miles,
                billing,
                invoicedDate,
                generalCommodity,
                note,
                loadType,
                type,
                loadRequirements,
                company,
                dispatch,
                pickup,
                delivery,
                totalMiles,
                dateCreated,
                createdAt,
                comments,
            } = load;

            const mapped: IMappedLoad = {
                id,
                edit: true,
                isSelected: false,
                loadNumber,
                templateName: load.name,
                status,
                dispatcher,
                referenceNumber: loadDetails?.referenceNumber,
                tableDropdownContent:
                    DropdownMenuContentHelper.getLoadDropdownContent(
                        selectedTab
                    ),
                totalDue,
                loadType: loadType?.name ?? type?.name,
                broker,
                brokerContact: broker?.contact,
                comments,
                commodity:
                    loadDetails?.generalCommodityName ?? generalCommodity?.name,
                brokerBusinessName: broker?.businessName,
                driverInfo: driver ? driver : dispatch?.driver,
                assignedDriverTruckNumber: driver?.truckNumber,
                assignedDriverTrailerNumber: driver?.trailerNumber,
                milesLoaded: miles?.loadedMiles,
                milesEmpty: miles?.emptyMiles,
                milesTotal: miles?.totalMiles ?? totalMiles,
                billingRatePerMile: billing?.rpm,
                billingRate: billing?.rate,
                companyName: company?.companyName,
                invoicedDate,
                note,
                requirementTruck: loadRequirements?.truckType,
                requirementTrailer: loadRequirements?.trailerType,
                requirementLength:
                    loadRequirements?.trailerLength?.name?.replace(/\D/g, ''),
                requirementDoor: loadRequirements?.doorType?.name,
                requirementSuspension: loadRequirements?.suspension?.name,
                requirementYear: loadRequirements?.year,
                requirementLiftgate: loadRequirements?.liftgate
                    ? eSharedString.YES
                    : eSharedString.EMPTY_STRING_PLACEHOLDER,
                driverMessage: loadRequirements?.driverMessage,
                pickup,
                delivery,
                dateCreated: MethodsCalculationsHelper.convertDateFromBackend(
                    selectedTab === eLoadStatusStringType.TEMPLATE
                        ? dateCreated
                        : createdAt
                ),
            };
            return mapped;
        });
    }

    static updateTabsCount = (
        listResponse: LoadListResponse,
        toolbarTabs: ITableData[]
    ): ITableData[] => {
        return [
            {
                ...toolbarTabs[0],
                length: listResponse.templateCount,
            },
            {
                ...toolbarTabs[1],
                length: listResponse.pendingCount,
            },
            {
                ...toolbarTabs[2],
                length: listResponse.activeCount,
            },
            {
                ...toolbarTabs[3],
                length: listResponse.closedCount,
            },
        ];
    };

    static loadStatusTypeToStringMap: Record<
        eLoadStatusType,
        eLoadStatusStringType
    > = {
        [eLoadStatusType.Template]: eLoadStatusStringType.TEMPLATE,
        [eLoadStatusType.Pending]: eLoadStatusStringType.PENDING,
        [eLoadStatusType.Active]: eLoadStatusStringType.ACTIVE,
        [eLoadStatusType.Closed]: eLoadStatusStringType.CLOSED,
    };
}
