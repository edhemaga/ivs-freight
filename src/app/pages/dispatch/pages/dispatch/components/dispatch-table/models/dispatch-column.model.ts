import { UntypedFormControl } from '@angular/forms';

export interface DispatchColumn {
    ngTemplate?: string;
    title?: string;
    field?: string;
    groupName?: string;
    name?: string;
    sortName?: string;
    hidden?: boolean;
    isPined?: boolean;
    minWidth?: number;
    width?: number;
    maxWidth?: number;
}
