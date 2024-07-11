import { LoadCardTypes } from "@pages/load/pages/load-card-modal/models/load-card-types.model";

export interface LoadCardData {
    active: LoadCardTypes;
    pending: LoadCardTypes;
    template: LoadCardTypes;
    closed: LoadCardTypes;
}
