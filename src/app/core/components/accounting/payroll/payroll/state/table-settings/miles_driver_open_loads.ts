export const miles_driver_open_loads = [
    {
        field: "#",
        isIndexIncrement: true,
        template: "medium-normal-template"
    },
    {
        field: "STOP",
        data_field: "pickup",
        template: "pickup-template"
    },
    {
        field: "DATE",
        data_field: "dateTimeFrom",
        template: "normal-template",
        isDate: true
    },
    {
        field: "TIME",
        data_field: "dateTimeFrom",
        template: "normal-template",
        isTime: true
    },
    {
        field: "LEG",
        data_field: "revenue",
        template: "normal-template"
    },
    {
        field: "LOADED",
        data_field: "revenue",
        template: "normal-template"
    },
    {
        field: "EMPTY",
        data_field: "revenue",
        template: "normal-template"
    },
    {
        field: "MILES",
        data_field: "revenue",
        template: "normal-template"
    },
    {
        field: "SUBTOTAL",
        data_field: "subtotal",
        template: "semibold-normal-template",
        highlighted: true
    }
];