export const miles_driver_open_loads = [
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
        data_field: "subtotalAmount",
        template: "semibold-normal-template",
        highlighted: true,
        isCurrency: true,
        justifyClass: "just-end"
    }
];


export const miles_driver_open_loads_resizable = [
    {
        field: "Total",
        data_field: "referenceNumber",
        template: "bold-normal-template",
        value: "Total",
        colspan: 2
    },
    {
        field: "",
        data_field: "",
        template: "semibold-normal-template",
        value: "",
        colspan: 1
    },
    {
        field: "",
        data_field: "",
        template: "semibold-normal-template",
        value: "",
        colspan: 1
    },
    {
        field: "",
        data_field: "",
        template: "semibold-normal-template",
        value: "",
        colspan: 1
    },
    {
        field: "Loaded",
        data_field: "loaded",
        template: "semibold-normal-template",
        value: "1,982.7",
        colspan: 1
    },
    {
        field: "Empty",
        data_field: "empty",
        template: "semibold-normal-template",
        value: "503.4",
        colspan: 1
    },
    {
        field: "Miles",
        data_field: "miles",
        template: "semibold-normal-template",
        value: "2,487.1",
        colspan: 1
    },
    {
        field: "Subtotal",
        data_field: "subtotal",
        template: "bold-normal-template",
        highlighted: true,
        value: "$3,316.57",
        colspan: 1,
        justifyClass: "just-end"
    }
];