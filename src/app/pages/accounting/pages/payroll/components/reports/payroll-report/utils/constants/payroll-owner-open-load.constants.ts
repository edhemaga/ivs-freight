export const PayrollOwnerOpenLoads = [
    {
        field: "#",
        isIndexIncrement: true,
        template: "medium-normal-template",
        justifyClass: "just-center"
    },
    {
        field: "INV #",
        data_field: "referenceNumber",
        template: "bold-normal-template"
    },
    {
        field: "BROKER",
        data_field: "broker.businessName",
        template: "normal-template"
    },
    {
        field: "PICKUP",
        data_field: "pickup",
        template: "pickup-template"
    },
    {
        field: "DELIVERY",
        data_field: "delivery",
        template: "delivery-template"
    },
    {
        field: "LOADED",
        data_field: "loaded",
        template: "normal-template"
    },
    {
        field: "EMPTY",
        data_field: "empty",
        template: "normal-template"
    },
    {
        field: "MILES",
        data_field: "miles",
        template: "normal-template"
    },
    {
        field: "REVENUE",
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



export const PayrollOwnerOpenLoadsResizable = [
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
        field: "Revenue",
        data_field: "revenue",
        template: "semibold-normal-template",
        value: "$37,908.15",
        colspan: 1
    },
    {
        field: "Subtotal",
        data_field: "subtotal",
        template: "bold-normal-template",
        highlighted: true,
        value: "$3,316.57",
        colspan: 1
    }
];