import { UntypedFormControl } from '@angular/forms';

export interface GetDispatchInputConfig {
    isInputHoverRows: boolean[][][];
    groupIndex: number;
    itemIndex: number;
    groupItem?: UntypedFormControl;
}
