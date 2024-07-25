export enum LoadFilterStringEnum {
    // Actions
    SET = 'Set',
    CLEAR = 'Clear',

    // Filter Types
    TIME_FILTER = 'timeFilter',
    STATUS_FILTER = 'statusFilter',
    USER_FILTER = 'userFilter',
    MONEY_FILTER = 'moneyFilter',
    LOAD_TYPE_FILTER = 'loadTypeFilter',
    PICKUP_FILTER = 'pickupFilter',
    DELIVERY_FILTER = 'deliveryFilter',

    // Load Tabs
    PENDING = 'pending',
    ACTIVE = 'active',
    CLOSED = 'closed',

    // Load Types
    FTL = 'ftl',
    LTL = 'ltl',
    ALL = 'all',

    // Other
    DISPATCH_DATA_UPDATE = 'dispatch-data-update',
}
