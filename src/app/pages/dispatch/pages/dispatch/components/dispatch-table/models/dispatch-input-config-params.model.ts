import { UntypedFormControl } from '@angular/forms';

export interface DispatchInputConfigParams {
    isInputHoverRows?: boolean[][][];
    groupIndex: number;
    itemIndex: number;
    groupItem?: UntypedFormControl;
    isHoveringRow?: boolean
}
