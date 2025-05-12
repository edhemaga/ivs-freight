import { eGeneralActions } from '@shared/enums';

export type ModalActionType =
    | eGeneralActions.SAVE_AND_ADD_NEW
    | eGeneralActions.SAVE
    | null;
