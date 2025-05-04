// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';
import { eLoadStatusStringType } from '@pages/new-load/enums';

// interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// models
import {
    LoadListDto,
    LoadListResponse,
    LoadTemplateResponse,
} from 'appcoretruckassist';
import { ITableData } from '@shared/models';

// helpers
import { DropdownMenuContentHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

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
                totalPaid,
                createdAt,
                dateCreated,
                updatedAt,
                note,

                loadNumber,
                status,

                totalDue,

                invoicedDate,

                pickup,
                delivery,
            } = load;

            const mapped: IMappedLoad = {
                id,
                isSelected: false,

                ///////////////////////////////////////
                templateName: name,
                loadNumber,
                loadType: loadType?.name ?? type?.name,
                dispatcher,
                companyName: company?.companyName,
                brokerBusinessName: broker?.businessName,
                brokerContact: broker?.contact ?? brokerContact?.contactName,
                brokerPhone: broker?.phone,
                brokerPhoneExt:
                    broker?.phoneExt ?? brokerContact?.extensionPhone,
                referenceNumber:
                    loadDetails?.referenceNumber ?? referenceNumber,
                commodity:
                    loadDetails?.generalCommodityName ?? generalCommodity?.name,
                weight: {
                    value: loadDetails?.weight ?? weight,
                },
                assignedDriver: driver ?? dispatch?.driver,
                assignedDriverTruckNumber:
                    driver?.truckNumber ?? dispatch?.truck?.truckNumber,
                assignedDriverTrailerNumber:
                    driver?.trailerNumber ?? dispatch?.trailer?.trailerNumber,
                status,
                requirementTruck: loadRequirements?.truckType,
                requirementTrailer: loadRequirements?.trailerType,
                requirementLength:
                    loadRequirements?.trailerLength?.name?.replace(/\D/g, ''),
                requirementDoor: loadRequirements?.doorType?.name,
                requirementSuspension: loadRequirements?.suspension?.name,
                requirementYear: loadRequirements?.year,
                requirementLiftgate: loadRequirements?.liftgate,
                driverMessage: loadRequirements?.driverMessage,
                milesLoaded: {
                    value: miles?.loadedMiles ?? totalMiles,
                },
                milesEmpty: miles?.emptyMiles,
                milesTotal: {
                    value: miles?.totalMiles ?? totalMiles,
                },
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
                billingPaid: {
                    value: billing?.paid ?? totalPaid,
                },
                dateCreated: {
                    value: createdAt ?? dateCreated,
                },
                dateEdited: {
                    value: updatedAt,
                },
                note,
                tableDropdownContent:
                    DropdownMenuContentHelper.getLoadDropdownContent(
                        selectedTab
                    ),
                ////////////////////////////////////////////////

                totalDue,

                invoicedDate,

                pickup,
                delivery,

                broker,
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
