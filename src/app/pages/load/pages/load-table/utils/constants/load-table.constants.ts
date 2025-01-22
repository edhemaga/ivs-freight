// appcoretruckassist
import { LoadListResponse, TableType } from "appcoretruckassist";

// enums
import { TableStringEnum } from "@shared/enums";

// models
import { ITableData } from "@shared/models/table-data.model";

export class LoadTableConstants {
    static TABLE_DATA_DEFAULT: ITableData[] = [
        {
            title: TableStringEnum.TEMPLATE_2,
            field: TableStringEnum.TEMPLATE,
            length: 0,
            data: [],
            extended: false,
            gridNameTitle: TableStringEnum.LOAD,
            moneyCountSelected: false,
            stateName: TableStringEnum.LOADS,
            tableConfiguration: TableType.LoadTemplate,
            isActive: false,
            gridColumns: []
        },
        {
            title: TableStringEnum.PENDING_2,
            field: TableStringEnum.PENDING,
            length: 0,
            data: [],
            extended: false,
            moneyCountSelected: false,
            gridNameTitle: TableStringEnum.LOAD,
            stateName: TableStringEnum.LOADS,
            tableConfiguration: TableType.LoadRegular,
            isActive: false,
            gridColumns: []
        },
        {
            title: TableStringEnum.ACTIVE_2,
            field: TableStringEnum.ACTIVE,
            length: 0,
            data: [],
            moneyCountSelected: false,
            extended: false,
            gridNameTitle: TableStringEnum.LOAD,
            stateName: TableStringEnum.LOADS,
            tableConfiguration: TableType.LoadRegular,
            isActive: true,
            gridColumns: []
        },
        {
            title: TableStringEnum.CLOSED_2,
            field: TableStringEnum.CLOSED,
            length: 0,
            moneyCountSelected: false,
            data: [],
            extended: false,
            gridNameTitle: TableStringEnum.LOAD,
            stateName: TableStringEnum.LOADS,
            tableConfiguration: TableType.LoadClosed,
            isActive: false,
            gridColumns: []
        },
    ];

    static PAYLOAD_DEFAULT: LoadListResponse = {
        activeCount: 0,
        closedCount: 0,
        pagination: {},
        pendingCount: 0,
        templateCount: 0,
        totalSum: 0
    };
}