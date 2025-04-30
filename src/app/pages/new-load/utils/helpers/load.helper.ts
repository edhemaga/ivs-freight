// Enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';
import { eSharedString } from '@shared/enums';

// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// Models
import { ITableData } from '@shared/models';

// Models
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
            console.log(selectedTab + ' LOAD', load);
            const {
                id,
                name,
                loadType,
                type,
                dispatcher,
                company,
                broker,
                brokerContact,
                referenceNumber,
                loadDetails,
                generalCommodity,
                weight,
                driver,
                dispatch,
                loadRequirements,
                miles,
                totalMiles,
                billing,
                rpm,
                additionalBillingRates,
                totalRate,
                totalAdjustedRate,

                loadNumber,
                status,

                totalDue,

                invoicedDate,

                note,

                pickup,
                delivery,

                dateCreated,
                createdAt,
            } = load;

            const mapped: IMappedLoad = {
                id,
                isSelected: false,

                ///////////////////////////////////////
                templateName: name,
                loadType: loadType?.name ?? type?.name,
                dispatcher,
                companyName: company?.companyName,
                brokerBusinessName: broker?.businessName,
                brokerContact: brokerContact?.contactName ?? broker?.contact,
                brokerPhone: broker?.phone,
                brokerPhoneExt: broker?.phoneExt,
                referenceNumber:
                    referenceNumber ?? loadDetails?.referenceNumber,
                commodity:
                    generalCommodity?.name ?? loadDetails?.generalCommodityName,
                weight: weight ?? loadDetails?.weight,
                assignedDriver: driver ?? dispatch?.driver,
                assignedDriverTruckNumber:
                    driver?.truckNumber ?? dispatch?.truck?.truckNumber,
                assignedDriverTrailerNumber:
                    driver?.trailerNumber ?? dispatch?.trailer?.trailerNumber,
                requirementTruck: loadRequirements?.truckType,
                requirementTrailer: loadRequirements?.trailerType,
                requirementLength:
                    loadRequirements?.trailerLength?.name?.replace(/\D/g, ''),
                requirementDoor: loadRequirements?.doorType?.name,
                requirementSuspension: loadRequirements?.suspension?.name,
                requirementYear: loadRequirements?.year,
                requirementLiftgate: loadRequirements?.liftgate
                    ? eSharedString.YES
                    : null,
                driverMessage: loadRequirements?.driverMessage,
                milesLoaded: miles?.loadedMiles ?? totalMiles,
                milesEmpty: miles?.emptyMiles,
                milesTotal: miles?.totalMiles ?? totalMiles,
                billingRatePerMile: {
                    value: billing?.rpm ?? rpm,
                },
                billingLayover: {
                    value:
                        additionalBillingRates &&
                        additionalBillingRates[0]?.rate,
                },
                billinglumper: {
                    value:
                        additionalBillingRates &&
                        additionalBillingRates[1]?.rate,
                },
                billingFuelSurcharge: {
                    value:
                        additionalBillingRates &&
                        additionalBillingRates[2]?.rate,
                },
                billingEscort: {
                    value:
                        additionalBillingRates &&
                        additionalBillingRates[3]?.rate,
                },
                billingDetention: {
                    value:
                        additionalBillingRates &&
                        additionalBillingRates[4]?.rate,
                },
                billingRate: totalRate,
                billingAdjustedRate: totalAdjustedRate,

                ////////////////////////////////////////////////
                edit: true,
                loadNumber,
                status,

                tableDropdownContent:
                    DropdownMenuContentHelper.getLoadDropdownContent(
                        selectedTab
                    ),
                totalDue,

                broker,

                invoicedDate,
                note,

                pickup,
                delivery,
                dateCreated: MethodsCalculationsHelper.convertDateFromBackend(
                    selectedTab === eLoadStatusStringType.TEMPLATE
                        ? dateCreated
                        : createdAt
                ),
            };

            console.log('MAPPED TEMPLATE LOAD', mapped);

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
