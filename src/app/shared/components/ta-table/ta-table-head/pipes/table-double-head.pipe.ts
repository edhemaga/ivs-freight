import { Pipe, PipeTransform } from '@angular/core';
import { TableHeadTitleStringEnum } from '../enums/table-head-title-string.enum';

@Pipe({ name: 'tableDoubleHead', standalone: true })
export class TableDoubleHeadPipe implements PipeTransform {
    transform<
        T extends {
            tableHeadTitle: string;
            index: number;
            gridNameTitle: string;
        }
    >(column: T, tableData: T, isOuterCondition: boolean): boolean {
        const { tableHeadTitle, index } = column;
        const { gridNameTitle } = tableData;

        if (isOuterCondition) {
            const contactsTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.CONTACTS &&
                (tableHeadTitle === TableHeadTitleStringEnum.PRIMARY ||
                    tableHeadTitle === TableHeadTitleStringEnum.PRIMARY_2);

            const pmTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.PM &&
                tableHeadTitle === TableHeadTitleStringEnum.NAME_5;

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
                    tableHeadTitle === TableHeadTitleStringEnum.DRIVER_TYPE ||
                    tableHeadTitle ===
                        TableHeadTitleStringEnum.OFF_DUTY_LOCATION ||
                    tableHeadTitle === TableHeadTitleStringEnum.TWIC_EXP ||
                    tableHeadTitle === TableHeadTitleStringEnum.MEDICAL_EXP ||
                    tableHeadTitle === TableHeadTitleStringEnum.HIRED ||
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
                    tableHeadTitle === TableHeadTitleStringEnum.DESCRIPTION ||
                    tableHeadTitle === TableHeadTitleStringEnum.NAME ||
                    tableHeadTitle === TableHeadTitleStringEnum.SERVICE_TYPE);

            const brokerTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.CUSTOMER &&
                (tableHeadTitle === TableHeadTitleStringEnum.PHYSICAL ||
                    tableHeadTitle === TableHeadTitleStringEnum.CREDIT_LIMIT ||
                    tableHeadTitle === TableHeadTitleStringEnum.LOAD_2);

            const shipperTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.CUSTOMER &&
                (tableHeadTitle === TableHeadTitleStringEnum.PICKUP ||
                    tableHeadTitle === TableHeadTitleStringEnum.SHIPPING);

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

            const fuelTableColumnsCondition =
                gridNameTitle === TableHeadTitleStringEnum.FUEL &&
                (tableHeadTitle === TableHeadTitleStringEnum.DESCRIPTION ||
                    tableHeadTitle === TableHeadTitleStringEnum.NUMBER_2 ||
                    tableHeadTitle === TableHeadTitleStringEnum.FUEL_STOP_NAME);

            if (
                contactsTableColumnsCondition ||
                pmTableColumnsCondition ||
                driverTableColumnsCondition ||
                truckTableColumnsCondition ||
                trailerTableColumnsCondition ||
                repairTableColumnsCondition ||
                brokerTableColumnsCondition ||
                shipperTableColumnsCondition ||
                loadTableColumnsCondition ||
                userTableColumnsCondition ||
                fuelTableColumnsCondition
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
                tableHeadTitle !== TableHeadTitleStringEnum.NAME_5;

            const driverTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.DRIVER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.TYPE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.ISSUED &&
                    tableHeadTitle !== TableHeadTitleStringEnum.GENERAL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRUCK_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DRIVER_TYPE &&
                    tableHeadTitle !==
                        TableHeadTitleStringEnum.OFF_DUTY_LOCATION &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TWIC_EXP &&
                    tableHeadTitle !== TableHeadTitleStringEnum.MEDICAL_EXP &&
                    tableHeadTitle !== TableHeadTitleStringEnum.HIRED &&
                    index !== 12);

            const truckTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.TRUCK ||
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
                    tableHeadTitle !== TableHeadTitleStringEnum.TYPE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRANSPONDER &&
                    tableHeadTitle !== TableHeadTitleStringEnum.FRONT &&
                    tableHeadTitle !== TableHeadTitleStringEnum.MODEL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.MODEL_2);

            const trailerTableColumnsCondition =
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

            const repairTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.REPAIR ||
                (tableHeadTitle !== TableHeadTitleStringEnum.NAME_4 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_5 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DESCRIPTION &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME &&
                    tableHeadTitle !== TableHeadTitleStringEnum.SERVICE_TYPE);

            const brokerTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.CUSTOMER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PHYSICAL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.CREDIT_LIMIT &&
                    tableHeadTitle !== TableHeadTitleStringEnum.LOAD_2);

            const shipperTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.CUSTOMER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PICKUP &&
                    tableHeadTitle !== TableHeadTitleStringEnum.SHIPPING);

            const loadTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.LOAD ||
                (tableHeadTitle !== TableHeadTitleStringEnum.BUSSINESS_NAME &&
                    tableHeadTitle !== TableHeadTitleStringEnum.DRIVER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TRUCK_3 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.LOADED &&
                    tableHeadTitle !== TableHeadTitleStringEnum.RATE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.TERM_3);

            const userTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.USER ||
                (tableHeadTitle !== TableHeadTitleStringEnum.PHONE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.EMAIL &&
                    tableHeadTitle !== TableHeadTitleStringEnum.OFFICE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.PAY_TYPE &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NAME);

            const fuelTableColumnsCondition =
                gridNameTitle !== TableHeadTitleStringEnum.FUEL ||
                (tableHeadTitle !== TableHeadTitleStringEnum.DESCRIPTION &&
                    tableHeadTitle !== TableHeadTitleStringEnum.NUMBER_2 &&
                    tableHeadTitle !== TableHeadTitleStringEnum.FUEL_STOP_NAME);

            return (
                contactsTableColumnsCondition &&
                pmTableColumnsCondition &&
                driverTableColumnsCondition &&
                truckTableColumnsCondition &&
                trailerTableColumnsCondition &&
                repairTableColumnsCondition &&
                brokerTableColumnsCondition &&
                shipperTableColumnsCondition &&
                loadTableColumnsCondition &&
                userTableColumnsCondition &&
                fuelTableColumnsCondition
            );
        }
    }
}
