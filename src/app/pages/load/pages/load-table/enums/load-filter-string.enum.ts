export enum LoadFilterStringEnum {
    // Actions
    SET = 'Set',
    CLEAR = 'Clear',

    // Filter Types
    TIME_FILTER = 'timeFilter',
    TIME_FILTER_FUTURE = 'hasFutureTimeFilter',
    STATUS_FILTER = 'statusFilter',
    USER_FILTER = 'userFilter',
    MONEY_FILTER = 'moneyFilter',
    LOAD_TYPE_FILTER = 'loadTypeFilter',
    PICKUP_FILTER = 'pickupFilter',
    DELIVERY_FILTER = 'deliveryFilter',
    LOCATION_FILTER = 'locationFilter',
    TRUCK_TYPE_FILTER = 'truckTypeFilter',
    TRAILER_TYPE_FILTER = 'trailerTypeFilter',

    // Load Tabs
    PENDING = 'pending',
    PENDING_2 = 'Pending',
    ACTIVE = 'active',
    ACTIVE_2 = 'Active',
    CLOSED = 'closed',
    CLOSED_2 = 'Closed',
    LOAD = 'Load',

    // Load Types
    FTL = 'ftl',
    LTL = 'ltl',
    ALL = 'all',

    // Other
    DISPATCH_DATA_UPDATE = 'dispatch-data-update',
    UPDATE = 'update',
}
