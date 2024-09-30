export class UserModalConfig {
    static MODAL_MAIN_TABS = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
            disabled: true,
        },
    ];

    static TYPE_OF_EMPLOYEE = [
        {
            id: 3,
            name: 'User',
            checked: true,
        },
        {
            id: 4,
            name: 'Admin',
            checked: false,
        },
    ];

    static TYPE_OF_PAYROLL = [
        {
            id: 5,
            name: '1099',
            checked: true,
        },
        {
            id: 6,
            name: 'W-2',
            checked: false,
        },
    ];
}
