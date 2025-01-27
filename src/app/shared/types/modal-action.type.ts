import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

export type ModalActionType =
    | TaModalActionEnum.SAVE_AND_ADD_NEW
    | TaModalActionEnum.SAVE
    | null;
