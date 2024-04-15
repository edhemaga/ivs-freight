export const PayrollSmallTableConfigConstants = [
    {
        field: "#",
        isIndexIncrement: true,
        template: "medium-normal-template",
        justifyClass: "just-center"
    },
    {
        field: "DETAILS",
        template: "small-details-template"
    },
    {
        field: "SUBTOTAL",
        data_field: "amount",
        template: "semibold-normal-template",
        highlighted: true,
        isCurrency: true,
        justifyClass: "just-end"
    }
];