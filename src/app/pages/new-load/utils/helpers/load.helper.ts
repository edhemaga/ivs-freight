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
            const {
                id,
                name,
                loadNumber,
                loadType,
                type,
                dispatcher,
                companyName,
                company,
                broker,
                brokerContact,
                referenceNumber,
                loadDetails,
                generalCommodity,
                weight,
                driver,
                dispatch,
                status,
                pickup,
                delivery,
                loadRequirements,
                miles,
                totalMiles,
                billing,
                rpm,
                additionalBillingRates,
                totalRate,
                totalAdjustedRate,
                totalPaid,
                totalDue,
                invoicedDate,
                paidDate,
                createdAt,
                dateCreated,
                updatedAt,
                note,
            } = load;

            const requirementLength =
                loadRequirements?.trailerLength?.name?.replace(/\D/g, '');
            const billingPayTerm = billing?.payTermName?.replace(/\D/g, '');

            const mappedLoad: IMappedLoad = {
                id,
                isSelected: false,
                templateName: name,
                loadNumber,
                loadType: loadType?.name ?? type?.name,
                dispatcher,
                companyName: companyName ?? company?.companyName,
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
                pickup,
                delivery,
                requirementTruck: loadRequirements?.truckType,
                requirementTrailer: loadRequirements?.trailerType,
                requirementLength,
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
                billingPayTerm,
                billingAgeUnpaid: {
                    value: billing?.ageUnpaid,
                },
                billingAgePaid: {
                    value: billing?.agePaid,
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
                billingDue: {
                    value: billing?.due,
                },
                totalDue,
                dateInvoiced: {
                    value: invoicedDate,
                },
                datePaid: {
                    value: paidDate,
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
            };

            return mappedLoad;
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
