import { TruckDetailsEnum } from '@pages/truck/pages/truck-details/enums/truck-details.enum';

export class TruckDetailsConstants {
    static ownerHistoryHeader: { label: string }[] = [
        { label: TruckDetailsEnum.COMPANY },
        { label: TruckDetailsEnum.FROM_TO },
        { label: TruckDetailsEnum.DURATION },
    ];
}
