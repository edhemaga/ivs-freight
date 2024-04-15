export const PayrollMilesDriverOpenLoads = [
    {
        field: "#",
        isIndexIncrement: true,
        template: "medium-normal-template",
        justifyClass: "just-center"
    },
    {
        field: "STOP",
        data_field: "pickup",
        template: "pickup-delivery-template"
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
        data_field: "legMiles",
        template: "normal-template"
    },
    {
        field: "LOADED",
        data_field: "loadedMiles",
        template: "normal-template"
    },
    {
        field: "EMPTY",
        data_field: "emptyMiles",
        template: "normal-template"
    },
    {
        field: "MILES",
        data_field: "totalMiles",
        template: "normal-template"
    },
    {
        field: "SUBTOTAL",
        data_field: "subtotal",
        template: "semibold-normal-template",
        highlighted: true,
        isCurrency: true,
        justifyClass: "just-end"
    }
];


export const PayrollMilesDriverOpenLoadsResizable = [
    {
        field: "Total",
        data_title: true,
        isTitleIndex: true,
        template: "bold-normal-template",
        value: "Total",
        colspan: 2
    },
    {
        field: "",
        template: "semibold-normal-template",
        colspan: 1
    },
    {
        field: "",
        template: "semibold-normal-template",
        colspan: 1
    },
    {
        field: "",
        template: "semibold-normal-template",
        colspan: 1
    },
    {
        field: "Loaded",
        data_field: "loadedMilesPay",
        template: "semibold-normal-template",
        isCurrency: true,
        colspan: 1
    },
    {
        field: "Empty",
        data_field: "emptyMilesPay",
        template: "semibold-normal-template",
        isCurrency: true,
        colspan: 1
    },
    {
        field: "Miles",
        data_field: "milesPay",
        template: "semibold-normal-template",
        isCurrency: true,
        colspan: 1
    },
    {
        field: "Subtotal",
        data_field: "milesPay",
        template: "bold-normal-template",
        highlighted: true,
        colspan: 1,
        isCurrency: true,
        justifyClass: "just-end"
    }
];