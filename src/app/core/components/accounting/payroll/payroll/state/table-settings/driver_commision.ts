export const driver_commision_table_settings = [
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
        data_field: "period"
    },
    {
        field: "LOAD",
        template: "normal-template",
        data_field: "loadsCount",
        hideNotExpanded: true
    }, 
    {
        field: "MILEAGE",
        template: "normal-template",
        data_field: "mileageAmount",
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
        textAbove: "SUMMARY",
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