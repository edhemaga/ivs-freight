export const owner_table_settings = [
    {
        field: "TRUCK",
        data_field: "truck.truckNumber",
        template: "bold-normal-template"
    },
    {
        field: "NAME",
        template: "bold-normal-template",
        data_field: "owner.name",
    },
    {
        field: "PAYROLL",
        template: "normal-template",
        data_field: "payrollNumber",
        hideNotExpanded: true
    },
    {
        field: "PERIOD",
        template: "normal-template",
        data_field: "period"
    },
    {
        field: "LOAD",
        template: "normal-template",
        data_field: "loadsCount",
        hideNotExpanded: true
    },
    {
        field: "REVENUE",
        hasBorder: "left",
        textAbove: "COMMISION",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "PAY",
        hasBorder: "right",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "SALARY",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "TOTAL",
        template: "bold-normal-template",
        data_field: "totalAmount"
    },
    {
        field: "STATUS",
        template: "status-template"
    }
];