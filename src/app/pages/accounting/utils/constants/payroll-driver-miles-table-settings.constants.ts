export const PayrollDriverMilesTableSettingsConstants = [
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
        data_field: "miles.mileageAmount",
        hideNotExpanded: true
    },
    {
        field: "EMPTY",
        template: "normal-template",
        data_field: "miles.mileageEmpty",
        hideNotExpanded: true
    },
    {
        field: "LOADED",
        hasBorder: "right",
        template: "normal-template",
        data_field: "miles.mileageLoaded",
        hideNotExpanded: true
    },
    {
        field: "MI PAY",
        textAbove: "SUMMARY",
        template: "normal-template",
        data_field: "summary.amount",
        hideNotExpanded: true,
        isCurrency: true
    },
    {
        field: "SALARY",
        template: "normal-template",
        data_field: "summary.salary",
        hideNotExpanded: true,
        isCurrency: true
    },
    {
        field: "TOTAL",
        template: "bold-normal-template",
        data_field: "summary.total",
        isCurrency: true,
    },
    {
        field: "STATUS",
        template: "status-template",
        data_field: "payDeadline"
    }
];