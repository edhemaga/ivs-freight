// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

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

export class LoadHelper {
    static loadMapper(
        loads: LoadListDto[] | LoadTemplateResponse[],
        selectedTab: eLoadStatusStringType
    ): IMappedLoad[] {
        return loads.map((load) => {
            const {id, loadNumber, status, dispatcher, loadDetails, totalDue, broker, brokerContact, driver, miles, billing, invoicedDate} = load;
            return {
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
                broker,
                templateCreated: load.dateCreated,
                templateCommodity: load.generalCommodity,
                brokerBusinessName: broker?.businessName,
                brokerContact: brokerContact?.contactName,
                brokerPhone: broker?.phone,
                driverInfo: driver,
                assignedDriverTruckNumber: driver?.truckNumber,
                assignedDriverTrailerNumber: driver?.trailerNumber,
                milesLoaded: miles?.loadedMiles,
                milesEmpty: miles?.emptyMiles,
                milesTotal: miles?.totalMiles,
                billingRatePerMile: billing?.rpm,
                billingRate: billing?.rate,
                invoicedDate
            };
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
