export const PayrollCommisionDriverOpenLoads = [
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