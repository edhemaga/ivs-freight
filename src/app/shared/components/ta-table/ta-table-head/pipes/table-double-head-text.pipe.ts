import { Pipe, PipeTransform } from '@angular/core';
import { TableHeadTitleStringEnum } from '../enums/table-head-title-string.enum';
1;
@Pipe({ name: 'tableDoubleHeadText', standalone: true })
export class TableDoubleHeadTextPipe implements PipeTransform {
    transform(column: any, tableData: any): string {
        const { tableHeadTitle, index } = column;
        const { gridNameTitle } = tableData;

        return tableHeadTitle === TableHeadTitleStringEnum.PRIMARY
            ? TableHeadTitleStringEnum.PHONE
            : tableHeadTitle === TableHeadTitleStringEnum.PRIMARY_2
            ? TableHeadTitleStringEnum.EMAIL
            : tableHeadTitle === TableHeadTitleStringEnum.REPAIR_SHOP
            ? TableHeadTitleStringEnum.MVR
            : tableHeadTitle === TableHeadTitleStringEnum.TYPE
            ? TableHeadTitleStringEnum.OWNER
            : tableHeadTitle === TableHeadTitleStringEnum.NAME
            ? TableHeadTitleStringEnum.BANK
            : tableHeadTitle === TableHeadTitleStringEnum.NUMBER
            ? TableHeadTitleStringEnum.FUEL_CARD
            : tableHeadTitle === TableHeadTitleStringEnum.NUMBER_2
            ? TableHeadTitleStringEnum.CDL
            : tableHeadTitle === TableHeadTitleStringEnum.ISSUED
            ? TableHeadTitleStringEnum.TEST
            : tableHeadTitle === TableHeadTitleStringEnum.GENERAL
            ? TableHeadTitleStringEnum.NOTIFICATION
            : tableHeadTitle === TableHeadTitleStringEnum.TRUCK_2
            ? TableHeadTitleStringEnum.ASSIGNED
            : tableHeadTitle === TableHeadTitleStringEnum.NAME_2
            ? TableHeadTitleStringEnum.EMERGENCY_CONTACT
            : tableHeadTitle === TableHeadTitleStringEnum.NAME_3
            ? TableHeadTitleStringEnum.OWNER
            : tableHeadTitle === TableHeadTitleStringEnum.REGISTRATION_DETAIL
            ? TableHeadTitleStringEnum.LICENCE
            : tableHeadTitle === TableHeadTitleStringEnum.FHWA_INSPECTION
            ? TableHeadTitleStringEnum.FHWA
            : tableHeadTitle === TableHeadTitleStringEnum.DRIVER_2
            ? TableHeadTitleStringEnum.ASSIGNED
            : tableHeadTitle === TableHeadTitleStringEnum.GROSS
            ? TableHeadTitleStringEnum.WEIGHT
            : tableHeadTitle === TableHeadTitleStringEnum.TERM
            ? TableHeadTitleStringEnum.FHWA
            : tableHeadTitle === TableHeadTitleStringEnum.NUMBER_3
            ? TableHeadTitleStringEnum.LICENCE
            : tableHeadTitle === TableHeadTitleStringEnum.NUMBER_4
            ? TableHeadTitleStringEnum.TITLE
            : tableHeadTitle === TableHeadTitleStringEnum.PRICE
            ? TableHeadTitleStringEnum.PURCHASE
            : tableHeadTitle === TableHeadTitleStringEnum.TYPE_2
            ? TableHeadTitleStringEnum.FUEL
            : tableHeadTitle === TableHeadTitleStringEnum.TRANSPONDER
            ? TableHeadTitleStringEnum.TOLL_DEVICE
            : tableHeadTitle === TableHeadTitleStringEnum.FRONT
            ? TableHeadTitleStringEnum.WHEEL_COMP
            : tableHeadTitle === TableHeadTitleStringEnum.MODEL
            ? TableHeadTitleStringEnum.TRANSMISSION
            : tableHeadTitle === TableHeadTitleStringEnum.MODEL_2
            ? TableHeadTitleStringEnum.ENGINE
            : tableHeadTitle === TableHeadTitleStringEnum.NAME_4
            ? TableHeadTitleStringEnum.REPAIR_SHOP
            : tableHeadTitle === TableHeadTitleStringEnum.NUMBER_5
            ? TableHeadTitleStringEnum.UNIT
            : tableHeadTitle === TableHeadTitleStringEnum.DESCRIPTION
            ? TableHeadTitleStringEnum.ITEM
            : tableHeadTitle === TableHeadTitleStringEnum.PHYSICAL
            ? TableHeadTitleStringEnum.ADDRESS
            : tableHeadTitle === TableHeadTitleStringEnum.CREDIT_LIMIT
            ? TableHeadTitleStringEnum.BILLING
            : tableHeadTitle === TableHeadTitleStringEnum.EMPTY
            ? TableHeadTitleStringEnum.WEIGHT
            : gridNameTitle === TableHeadTitleStringEnum.DRIVER && index === 12
            ? TableHeadTitleStringEnum.PAY
            : tableHeadTitle === TableHeadTitleStringEnum.BUSSINESS_NAME
            ? TableHeadTitleStringEnum.BROKER_2
            : tableHeadTitle === TableHeadTitleStringEnum.TRUCK_3
            ? TableHeadTitleStringEnum.ASSIGNED
            : tableHeadTitle === TableHeadTitleStringEnum.LOADED
            ? TableHeadTitleStringEnum.MILES
            : tableHeadTitle === TableHeadTitleStringEnum.RATE
            ? TableHeadTitleStringEnum.BILLING
            : tableHeadTitle === TableHeadTitleStringEnum.TERM_3
            ? TableHeadTitleStringEnum.BILLING
            : (tableHeadTitle === TableHeadTitleStringEnum.PHONE ||
                  tableHeadTitle === TableHeadTitleStringEnum.EMAIL) &&
              gridNameTitle === TableHeadTitleStringEnum.USER
            ? TableHeadTitleStringEnum.PERSONAL
            : tableHeadTitle === TableHeadTitleStringEnum.OFFICE &&
              gridNameTitle === TableHeadTitleStringEnum.USER
            ? TableHeadTitleStringEnum.EMPLOYEE
            : tableHeadTitle === TableHeadTitleStringEnum.PAY_TYPE &&
              gridNameTitle === TableHeadTitleStringEnum.USER
            ? TableHeadTitleStringEnum.PAYROLL
            : tableHeadTitle === TableHeadTitleStringEnum.NAME &&
              gridNameTitle === TableHeadTitleStringEnum.USER
            ? TableHeadTitleStringEnum.BANK
            : TableHeadTitleStringEnum.MVR;
    }
}
