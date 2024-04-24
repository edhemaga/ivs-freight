import { RepairOrderModalStringEnum } from '@pages/repair/pages/repair-modals/repair-order-modal/enums/repair-order-modal-string.enum';

export class RepairOrderHelper {
    static premapPayType(payType: string): string {
        const validTypes = {
            [RepairOrderModalStringEnum.WIRE_TRANSFER]:
                RepairOrderModalStringEnum.WIRE_TRANSFER_2,
            [RepairOrderModalStringEnum.CASH]: [
                RepairOrderModalStringEnum.WIRE_TRANSFER,
            ],
            [RepairOrderModalStringEnum.CHECK]:
                RepairOrderModalStringEnum.CHECK,
            [RepairOrderModalStringEnum.MONEY_CODE]:
                RepairOrderModalStringEnum.MONEY_CODE_2,
            [RepairOrderModalStringEnum.QUICK]:
                RepairOrderModalStringEnum.QUICK,
            [RepairOrderModalStringEnum.ZELLE]:
                RepairOrderModalStringEnum.ZELLE_2,
            [RepairOrderModalStringEnum.VENMO]:
                RepairOrderModalStringEnum.VENMO_2,
            [RepairOrderModalStringEnum.CASHAPP]:
                RepairOrderModalStringEnum.CASHAPP_2,
            [RepairOrderModalStringEnum.PAYPAL]:
                RepairOrderModalStringEnum.PAYPAL,
        };

        return validTypes[payType] || payType;
    }
}
