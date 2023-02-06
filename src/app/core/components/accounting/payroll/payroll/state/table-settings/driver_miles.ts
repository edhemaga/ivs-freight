export const driver_miles_table_settings = [
    {
        field: "NAME",
        template: "bold-image-template",
        data_field: "driver.fullName",
        image_field: "driver.avatar"
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
        data_field: "period",
        isDate: true
    },
    {
        field: "TOTAL",
        hasBorder: "left",
        textAbove: "MILES",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "EMPTY",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "LOADED",
        hasBorder: "right",
        template: "normal-template",
        hideNotExpanded: true
    },
    {
        field: "MI PAY",
        textAbove: "SUMMARY",
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