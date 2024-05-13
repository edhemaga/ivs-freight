export const PayrollSmallTableConfigResizeConstants = [
    {
        field: "Total",
        data_title: true,
        template: "bold-normal-template",
        value: "Total",
        colspan: 2
    },
    {
        field: "Subtotal",
        data_field: "amount",
        template: "bold-normal-template",
        highlighted: true,
        isCurrency: true,
        colspan: 1,
        justifyClass: "just-end"
    }
];