export const small_table_config = [
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

export const small_table_config_resize = [
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