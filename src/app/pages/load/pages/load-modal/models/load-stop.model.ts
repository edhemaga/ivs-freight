import { LoadStopCommand, ShipperLoadModalResponse } from "appcoretruckassist";
import { LoadModalTab } from "./load-modal-tab.model";

export interface LoadStop extends Omit<LoadStopCommand, 'timeType'> {
    timeType: number | LoadModalTab;
    shipper: ShipperLoadModalResponse
}