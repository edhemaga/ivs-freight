import { DatePipe } from '@angular/common';

// enums
import {
    TableStringEnum,
    TooltipColorsStringEnum,
    TrailerNameStringEnum,
    TruckNameStringEnum,
} from '@shared/enums';
import { LoadModalStopItemsStringEnum } from '@pages/load/enums';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';

// helpers
import { AvatarColorsHelper, DataFilterHelper, DropdownMenuContentHelper, LoadStatusHelper, MethodsGlobalHelper } from "@shared/utils/helpers";


// models
import {
    ILoadGridItem,
    IViewModelData,
    LoadModel,
} from '@pages/load/pages/load-table/models/index';
import { Stop } from '@shared/models';

// pipes
import { NameInitialsPipe, ThousandSeparatorPipe } from '@shared/pipes';

export class LoadStoreHelper {
    // #region mapLoadData
    public static mapLoadData(
        data: ILoadGridItem,
        selectedTab: string
    ): IViewModelData {
        const nameInitialsPipe: NameInitialsPipe = new NameInitialsPipe();
        const thousandSeparatorPipe: ThousandSeparatorPipe =
            new ThousandSeparatorPipe();
        const datePipe: DatePipe = new DatePipe('en-US');
        let commentsWithAvatarColor;
        if (data.comments) {
            commentsWithAvatarColor = Object.values(data?.comments).map(
                (comment) => {
                    return {
                        ...comment,
                        avatarColor: AvatarColorsHelper.getAvatarColors(0),
                        textShortName: nameInitialsPipe.transform(
                            comment.companyUser.fullName
                        ),
                    };
                }
            );
        }

        const {
            id,
            billing,
            broker,
            createdAt,
            delivery,
            dispatcher,
            driver,
            fileCount,
            lastStatusPassed,
            loadDetails,
            loadNumber,
            loadRequirements,
            baseRate,
            additionalBillingRatesTotal,
            loadType,
            miles,
            pickup,
            status,
            advancePay,
            totalRate,
            updatedAt,
            paidDate,
            invoicedDate,
            totalAdjustedRate,
        } = data;

        return {
            ...data,
            id,
            loadInvoice: {
                invoice: loadNumber
                    ? loadNumber
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                type: loadType?.name
                    ? loadType.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadDispatcher: {
                name: dispatcher?.fullName
                    ? dispatcher.fullName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                avatar:
                    dispatcher?.avatarFile?.url ??
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            avatarImg: driver?.avatarFile?.url,
            tableDriver: driver?.firstName
                ? driver?.firstName + ' ' + driver?.lastName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTruck: driver?.truckNumber,
            tableTrailer: driver?.trailerNumber,
            loadTotal: {
                total: totalRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparatorPipe.transform(totalRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                subTotal: data?.totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparatorPipe.transform(data.totalAdjustedRate)
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            loadBroker: {
                hasBanDnu: broker?.ban || broker?.dnu,
                isDnu: broker?.dnu,
                name: broker?.businessName
                    ? broker.businessName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            },
            contact: broker?.contact,
            phone: broker?.phone
                ? broker.phone +
                  (broker.phoneExt ? ' x ' + broker.phoneExt : '')
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            referenceNumber: loadDetails?.referenceNumber,
            textCommodity: loadDetails?.generalCommodityName,
            textWeight: loadDetails?.weight,
            tableTrailerColor: MethodsGlobalHelper.getTrailerTooltipColor(
                loadRequirements?.trailerType?.name
            ),
            tableTrailerName: loadRequirements?.trailerType?.name,
            tableTruckColor: this.setTruckTooltipColor(
                loadRequirements?.truckType?.name
            ),
            truckTypeClass: loadRequirements?.truckType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            tableTrailerTypeClass: loadRequirements?.trailerType?.name
                .trim()
                .replace(' ', TableStringEnum.EMPTY_STRING_PLACEHOLDER)
                .toLowerCase(),
            tableTruckName: loadRequirements?.truckType?.name,
            loadTrailerNumber: loadRequirements?.trailerType?.logoName,
            loadTruckNumber:
                loadRequirements?.truckType?.logoName ??
                TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            loadPickup: [
                {
                    count: pickup?.count ?? null,
                    location: pickup?.location,
                    date: pickup?.date
                        ? datePipe.transform(
                              pickup?.date,
                              TableStringEnum.DATE_FORMAT
                          )
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    time: pickup?.time
                        ? pickup?.time
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    delivery: false,
                },
                {
                    count: delivery?.count ?? null,
                    location: delivery?.location,
                    date: delivery?.date
                        ? datePipe.transform(
                              delivery?.date,
                              TableStringEnum.DATE_FORMAT
                          )
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    time: delivery?.time
                        ? delivery?.time
                        : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    delivery: true,
                },
            ],

            loadStatus: {
                status: status?.statusValue?.name
                    ? status?.statusValue?.name
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                color: TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                tab: selectedTab,
                time: LoadStatusHelper.calculateStatusTime(
                    lastStatusPassed as any
                ), //leave this any for now
            },
            total: miles?.totalMiles,
            empty: miles?.emptyMiles,
            loaded: miles?.loadedMiles,
            tableDoorType: loadRequirements?.doorType?.name,
            tableSuspension: loadRequirements?.suspension?.name,
            year: loadRequirements?.year,
            liftgate: loadRequirements?.liftgate
                ? LoadModalStopItemsStringEnum.YES
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAssignedUnitTruck: {
                text: driver?.truckNumber,
                type: driver?.truckType?.name,
                color: this.setTruckTooltipColor(driver?.truckType?.name),
                hover: false,
            },
            tableAssignedUnitTrailer: {
                text: driver?.trailerNumber,
                type: driver?.trailerType?.name,
                color: MethodsGlobalHelper.getTrailerTooltipColor(driver?.trailerType?.name),
                hover: false,
            },
            tabelLength: loadRequirements?.trailerLength?.name
                ? DataFilterHelper.getLengthNumber(
                      loadRequirements?.trailerLength?.name
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textBase: baseRate
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparatorPipe.transform(baseRate)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdditional: additionalBillingRatesTotal
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparatorPipe.transform(additionalBillingRatesTotal)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textAdvance: advancePay
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparatorPipe.transform(advancePay)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textPayTerms: billing?.payTermName
                ? billing?.payTermName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            textDriver:
                data?.driver?.firstName && data?.driver?.lastName
                    ? data?.driver?.firstName.charAt(0) +
                      TableStringEnum.DOT +
                      data?.driver?.lastName
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            comments: commentsWithAvatarColor,
            rate: {
                paid:
                    TableStringEnum.DOLLAR_SIGN +
                    ' ' +
                    thousandSeparatorPipe.transform(billing?.rate),
                paidDue: totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparatorPipe.transform(totalAdjustedRate)
                    : null,
                status: status?.statusValue?.name,
            },
            tableInvoice: invoicedDate
                ? datePipe.transform(invoicedDate, TableStringEnum.DATE_FORMAT)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tablePaid: paidDate
                ? datePipe.transform(paidDate, TableStringEnum.DATE_FORMAT)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            paid:
                billing?.paid !== 0
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparatorPipe.transform(billing?.paid)
                    : TableStringEnum.DOLLAR_SIGN + '0.00',
            payTerm: billing?.payTermName
                ? TableStringEnum.DOLLAR_SIGN +
                  ' ' +
                  thousandSeparatorPipe.transform(billing?.payTermName)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            ageUnpaid:
                billing?.ageUnpaid ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            agePaid:
                billing?.agePaid ?? TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            due: billing?.due
                ? TableStringEnum.DOLLAR_SIGN +
                  ' ' +
                  thousandSeparatorPipe.transform(billing?.due)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,

            tableAdded: createdAt
                ? datePipe.transform(createdAt, TableStringEnum.DATE_FORMAT)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableEdited: updatedAt
                ? datePipe.transform(updatedAt, TableStringEnum.DATE_FORMAT)
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableAttachments: [],
            fileCount: fileCount,
            tableDropdownContent:
                DropdownMenuContentHelper.getLoadDropdownContent(selectedTab),
        };
    }
    // #endregion

    // #region mapTemplateData
    public static mapTemplateData(data: LoadModel): IViewModelData {
        const thousandSeparator: ThousandSeparatorPipe =
            new ThousandSeparatorPipe();
        const datePipe: DatePipe = new DatePipe('en-US');
        const {
            id,
            billing,
            broker,
            createdAt,
            dispatcher,
            dispatch,
            brokerContact,
            weight,
            referenceNumber,
            loadRequirements,
            baseRate,
            additionalBillingRatesTotal,
            generalCommodity,
            stops,
            totalPaid,
            advancePay,
            totalRate,
            totalAdjustedRate,
            updatedAt,
        } = data;

        return {
            ...data,
            id,
            isSelected: false,
            loadTemplateName: data.name,
            loadDispatcher: {
                name: dispatcher?.fullName,
                avatar: dispatcher?.avatarFile?.url,
            },
            avatarImg: dispatch?.driver?.avatarFile?.url,
            tableDriver: dispatch?.driver?.firstName
                ? dispatch?.driver?.firstName + ' ' + dispatch?.driver?.lastName
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTruck: dispatch?.truck?.truckNumber,
            tableTrailer: dispatch?.trailer?.trailerNumber,
            loadTotal: {
                total: totalRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparator.transform(totalRate)
                    : null,
                subTotal: data?.totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparator.transform(data.totalAdjustedRate)
                    : null,
            },
            loadBroker: {
                hasBanDnu: broker?.ban || broker?.dnu,
                isDnu: broker?.dnu,
                name: broker?.businessName,
            },
            contact: brokerContact?.contactName,
            phone: brokerContact?.phone
                ? brokerContact.phone +
                  (brokerContact.phoneExt ? ' x ' + brokerContact.phoneExt : '')
                : null,

            referenceNumber: referenceNumber,
            textCommodity: generalCommodity?.name,
            textWeight: weight,
            tableTrailerColor: MethodsGlobalHelper.getTrailerTooltipColor(
                loadRequirements?.trailerType?.name
            ),
            tableTrailerName: loadRequirements?.trailerType?.name,
            tableTruckColor: this.setTruckTooltipColor(
                loadRequirements?.truckType?.name
            ),
            truckTypeClass: loadRequirements?.truckType?.logoName
                ? loadRequirements?.truckType?.logoName.replace(
                      TableStringEnum.SVG,
                      TableStringEnum.EMPTY_STRING_PLACEHOLDER
                  )
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            tableTrailerTypeClass: loadRequirements?.trailerType?.logoName
                ? loadRequirements?.trailerType?.logoName.replace(
                      TableStringEnum.SVG,
                      TableStringEnum.EMPTY_STRING_PLACEHOLDER
                  )
                : null,
            tableTruckName: loadRequirements?.truckType?.name,
            loadTrailerNumber: loadRequirements?.trailerType?.logoName,
            loadTruckNumber: loadRequirements?.truckType?.logoName,

            loadPickup: [
                {
                    count: this.calculatePickupstops(stops),
                    location: stops[0]?.shipper?.address?.city,
                    delivery: false,
                },
                {
                    count: stops[stops.length - 1]?.stopLoadOrder,
                    location: stops[stops.length - 1]?.shipper?.address?.city,
                    delivery: true,
                },
            ],

            total: data?.totalMiles,
            empty: data?.emptyMiles,
            loaded: data?.loaded,
            tableDoorType: loadRequirements?.doorType?.name,
            tableSuspension: loadRequirements?.suspension?.name,
            year: loadRequirements?.year,
            liftgate: loadRequirements?.liftgate
                ? LoadModalStopItemsStringEnum.YES
                : null,
            tableAssignedUnitTruck: {
                text: dispatch?.truck?.truckNumber,
                type: dispatch?.truck?.model,
                color: this.setTruckTooltipColor(dispatch?.truck?.model),
                hover: false,
            },
            tableAssignedUnitTrailer: {
                text: dispatch?.trailer?.trailerNumber,
                type: dispatch?.trailer?.model,
                color: MethodsGlobalHelper.getTrailerTooltipColor(dispatch?.trailer?.model),
                hover: false,
            },
            tabelLength: loadRequirements?.trailerLength?.name
                ? DataFilterHelper.getLengthNumber(
                      loadRequirements?.trailerLength?.name
                  )
                : null,
            textBase: baseRate
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparator.transform(baseRate)
                : null,
            textAdditional: additionalBillingRatesTotal
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparator.transform(additionalBillingRatesTotal)
                : null,
            textAdvance: advancePay
                ? TableStringEnum.DOLLAR_SIGN +
                  thousandSeparator.transform(advancePay)
                : null,
            textPayTerms: billing?.payTermName ? billing?.payTermName : null,
            textDriver:
                data?.dispatch?.driver?.firstName &&
                data?.dispatch?.driver?.lastName
                    ? data?.dispatch?.driver?.firstName.charAt(0) +
                      TableStringEnum.DOT +
                      data?.dispatch?.driver?.lastName
                    : null,
            rate: {
                paid:
                    TableStringEnum.DOLLAR_SIGN +
                    ' ' +
                    thousandSeparator.transform(totalRate),
                paidDue: totalAdjustedRate
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparator.transform(totalAdjustedRate)
                    : null,
            },
            paid:
                totalPaid !== 0
                    ? TableStringEnum.DOLLAR_SIGN +
                      thousandSeparator.transform(totalPaid)
                    : TableStringEnum.DOLLAR_SIGN + '0.00',

            tableAdded: createdAt
                ? datePipe.transform(createdAt, TableStringEnum.DATE_FORMAT)
                : null,
            tableEdited: updatedAt
                ? datePipe.transform(updatedAt, TableStringEnum.DATE_FORMAT)
                : null,
            tableDropdownContent:
                DropdownMenuContentHelper.getLoadTemplateDropdownContent(),
        };
    }
    // #endregion

    private static setTruckTooltipColor(truckName: string): string {
        switch (truckName) {
            case TruckNameStringEnum.SEMI_TRUCK:
            case TruckNameStringEnum.SEMI_SLEEPER:
                return TooltipColorsStringEnum.BLUE;
            case TruckNameStringEnum.BOX_TRUCK:
            case TruckNameStringEnum.REEFER_TRUCK:
            case TruckNameStringEnum.CARGO_VAN:
                return TooltipColorsStringEnum.YELLOW;
            case TruckNameStringEnum.DUMP_TRUCK:
            case TruckNameStringEnum.CEMENT_TRUCK:
            case TruckNameStringEnum.GARBAGE_TRUCK:
                return TooltipColorsStringEnum.RED;
            case TruckNameStringEnum.TOW_TRUCK:
            case TruckNameStringEnum.CAR_HAULER:
            case TruckNameStringEnum.SPOTTER:
                return TooltipColorsStringEnum.LIGHT_GREEN;
            default:
                return;
        }
    }

    public static calculatePickupstops(stops: Stop[]): number {
        let stopOrder = 0;
        stops.forEach((stop) => {
            if (stop.stopType.name === LoadModalStringEnum.PICKUP_2)
                stopOrder++;
        });

        return stopOrder;
    }
}
