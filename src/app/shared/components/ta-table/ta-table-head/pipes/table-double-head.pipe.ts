import { Pipe, PipeTransform } from '@angular/core';
import { TableHeadTitleStringEnum } from '../enums/table-head-title-string.enum';

@Pipe({ name: 'tableDoubleHead', standalone: true })
export class TableDoubleHeadPipe implements PipeTransform {
    transform(column: any, tableData: any, isOuterCondition: boolean): boolean {
        const { tableHeadTitle, index } = column;
        const { gridNameTitle } = tableData;

        if (isOuterCondition) {
            const contactsTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.CONTACTS &&
                (tableHeadTitle === TableHeadTitleStringEnum.PRIMARY ||
                    tableHeadTitle === TableHeadTitleStringEnum.PRIMARY_2);

            const pmTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.PM &&
                tableHeadTitle === TableHeadTitleStringEnum.REPAIR_SHOP;

            const driverTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.DRIVER &&
                (tableHeadTitle === TableHeadTitleStringEnum.TYPE ||
                    tableHeadTitle === TableHeadTitleStringEnum.NAME ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.ISSUED ||
                    tableHeadTitle === TableHeadTitleStringEnum.GENERAL ||
                    tableHeadTitle === TableHeadTitleStringEnum.TRUCK_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.NAME_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.TERM_2 ||
                    index === 12);

            const truckTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.TRUCK &&
                (tableHeadTitle === TableHeadTitleStringEnum.NAME_3 ||
                    tableHeadTitle ===
                        TableHeadTitleStringEnum.REGISTRATION_DETAIL ||
                    tableHeadTitle ===
                        TableHeadTitleStringEnum.FHWA_INSPECTION ||
                    tableHeadTitle === TableHeadTitleStringEnum.DRIVER_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.GROSS ||
                    tableHeadTitle === TableHeadTitleStringEnum.TERM ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_3 ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_4 ||
                    tableHeadTitle === TableHeadTitleStringEnum.PRICE ||
                    tableHeadTitle === TableHeadTitleStringEnum.TYPE ||
                    tableHeadTitle === TableHeadTitleStringEnum.TRANSPONDER ||
                    tableHeadTitle === TableHeadTitleStringEnum.FRONT ||
                    tableHeadTitle === TableHeadTitleStringEnum.MODEL ||
                    tableHeadTitle === TableHeadTitleStringEnum.MODEL_2);

            const trailerTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.TRAILER &&
                (tableHeadTitle === TableHeadTitleStringEnum.EMPTY ||
                    tableHeadTitle ===
                        TableHeadTitleStringEnum.FHWA_INSPECTION ||
                    tableHeadTitle === TableHeadTitleStringEnum.DRIVER_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_3 ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_4 ||
                    tableHeadTitle === TableHeadTitleStringEnum.PRICE ||
                    tableHeadTitle === TableHeadTitleStringEnum.TYPE_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.TERM);
            const repairTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.REPAIR &&
                (tableHeadTitle === TableHeadTitleStringEnum.NAME_4 ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_5 ||
                    tableHeadTitle === TableHeadTitleStringEnum.DESCRIPTION);
            const brokerTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.CUSTOMER &&
                (tableHeadTitle === TableHeadTitleStringEnum.PHYSICAL ||
                    tableHeadTitle === TableHeadTitleStringEnum.CREDIT_LIMIT);

            const loadTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.LOAD &&
                (tableHeadTitle === TableHeadTitleStringEnum.BUSSINESS_NAME ||
                    tableHeadTitle === TableHeadTitleStringEnum.DRIVER_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.TRUCK_3 ||
                    tableHeadTitle === TableHeadTitleStringEnum.LOADED ||
                    tableHeadTitle === TableHeadTitleStringEnum.RATE ||
                    tableHeadTitle === TableHeadTitleStringEnum.TERM_3);

            const userTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.USER &&
                (tableHeadTitle === TableHeadTitleStringEnum.PHONE ||
                    tableHeadTitle === TableHeadTitleStringEnum.EMAIL ||
                    tableHeadTitle === TableHeadTitleStringEnum.OFFICE ||
                    tableHeadTitle === TableHeadTitleStringEnum.PAY_TYPE ||
                tableHeadTitle === TableHeadTitleStringEnum.NAME);

            if (
                contactsTableColumnsCondition ||
                pmTableColumnsCondition ||
                driverTableColumnsCondition ||
                truckTableColumnsCondition ||
                repairTableColumnsCondition ||
                brokerTableColumnsCondition ||
                trailerTableColumnsCondition ||
                loadTableColumnsCondition ||
                userTableColumnsCondition
            ) {
                return true;
            }

            return;
        } else {
            const contactsTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.CONTACTS ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PRIMARY &&
                    tableHeadTitle !== TableHeadTitleStringEnum.PRIMARY_2);

            const pmTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.PM ||
                tableHeadTitle !== TableHeadTitleStringEnum.REPAIR_SHOP;

            const driverTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.DRIVER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.TYPE_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.ISSUED &&
                    tableHeadTitle !== TableHeadTitleStringEnum.GENERAL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRUCK_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM_2 &&
                    index !== 12);

            const repairTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.REPAIR ||
                (tableHeadTitle !== TableHeadTitleStringEnum.NAME_4 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_5 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DESCRIPTION);

            const brokerTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.CUSTOMER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PHYSICAL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.CREDIT_LIMIT);

            const truckTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.TRUCK_2 ||
                (tableHeadTitle !== TableHeadTitleStringEnum.NAME_3 &&
                    tableHeadTitle !==
                        TableHeadTitleStringEnum.REGISTRATION_DETAIL &&
                    tableHeadTitle !==
                        TableHeadTitleStringEnum.FHWA_INSPECTION &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DRIVER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.GROSS &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_3 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.PRICE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_4 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TYPE_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRANSPONDER &&
                    tableHeadTitle !== TableHeadTitleStringEnum.FRONT &&
                    tableHeadTitle !== TableHeadTitleStringEnum.MODEL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.MODEL_2);
            const TrailerTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.TRAILER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.EMPTY &&
                    tableHeadTitle !==
                        TableHeadTitleStringEnum.FHWA_INSPECTION &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DRIVER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_3 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.PRICE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_4 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TYPE_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM);

            const LoadTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.LOAD ||
                (tableHeadTitle !== TableHeadTitleStringEnum.BUSSINESS_NAME &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DRIVER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRUCK_3 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.LOADED &&
                    tableHeadTitle !== TableHeadTitleStringEnum.RATE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM_3);

            const UserTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.USER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PHONE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.EMAIL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.OFFICE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.PAY_TYPE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME);

            return (
                contactsTableColumnsCondition &&
                pmTableColumnsCondition &&
                driverTableColumnsCondition &&
                repairTableColumnsCondition &&
                brokerTableColumnsCondition &&
                truckTableColumnsCondition &&
                repairTableColumnsCondition &&
                TrailerTableColumnsCondition &&
                LoadTableColumnsCondition &&
                UserTableColumnsCondition
            );
        }
    }
}
