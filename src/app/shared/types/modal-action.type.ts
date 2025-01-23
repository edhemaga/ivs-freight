import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

export type ModalActionType =
    | TaModalActionEnums.SAVE_AND_ADD_NEW
    | TaModalActionEnums.SAVE
    | null;
