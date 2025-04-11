import { eLoadModalActions } from '@pages/new-load/enums';

export interface ILoadModal {
    isTemplate: boolean;
    isEdit: boolean;
    id: number;
    type?:
        | eLoadModalActions.CREATE_LOAD_FROM_TEMPLATE
        | eLoadModalActions.CREATE_TEMPLATE_FROM_LOAD;
}
