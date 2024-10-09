import { DispatchResizedColumnsModel } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

export class DispatchTableColumnWidthsConstants {
    static DispatchColumnWidths: DispatchResizedColumnsModel = {
        truckNumber: 122,
        trailerNumber: 122,
        firstName: 242,
        city: 162,
        status: 142,
        pickup_delivery: 342,
        progress: 228,
        slotNumber: 102,
        dispatcher: 36,
        note: 36,
    };

    static DispatchColumnWidthsExpanded: DispatchResizedColumnsModel = {
        truckNumber: 162,
        trailerNumber: 162,
        firstName: 302,
        city: 162,
        status: 142,
        pickup_delivery: 342,
        progress: 228,
        slotNumber: 102,
        dispatcher: 36,
        note: 238,
    };
}
