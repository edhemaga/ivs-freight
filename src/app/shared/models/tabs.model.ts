import { ElementRef } from "@angular/core";

export interface Tabs {
    id: number;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    color?: string;
    tabTemplate?: ElementRef<any>
}
