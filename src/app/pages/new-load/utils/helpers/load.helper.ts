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

export class LoadHelper {
    static loadMapper(
        loads: LoadListDto[] | LoadTemplateResponse[]
    ): IMappedLoad[] {
        return loads.map((load) => {
            return {
                id: load.id,
                edit: true,
                isSelected: false,
                loadNumber: load.loadNumber,
                templateName: load.name,
                status: load.status,
                dispatcher: load.dispatcher,
                referenceNumber: load.loadDetails?.referenceNumber,
                totalDue: load.totalDue,
                broker: load.broker,
                templateCreated: load.dateCreated,
                templateCommodity: load.generalCommodity,
                brokerBusinessName: load.broker?.businessName,
                brokerContact: load.brokerContact?.contactName,
                brokerPhone: load.broker?.phone,
                assignedDriver: load.driver,
                assignedDriverTruckNumber: load.driver?.truckNumber,
                assignedDriverTrailerNumber: load.driver?.trailerNumber,
                milesLoaded: load.miles?.loadedMiles,
                milesEmpty: load.miles?.emptyMiles,
                milesTotal: load.miles?.totalMiles,
                billingRatePerMile: load.billing?.rpm,
                billingRate: load.billing?.rate,
                invoiceDate: load.invoicedDate
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
