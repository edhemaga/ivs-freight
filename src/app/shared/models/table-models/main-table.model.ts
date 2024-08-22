import { TemplateRef, ElementRef } from '@angular/core';

export interface ColumnConfig {
    header: string;
    field: string;
    sortable?: boolean;
    reorderable?: boolean;
    cellType: 'text' | 'textWithImage' | 'component' | 'template';
    component?: any; // For custom components
    inputs?: { [key: string]: any }; // Inputs for the custom component
    outputs?: { [key: string]: (event: any) => void }; // Outputs for the custom component
    template?: ElementRef<any>; // Optional template reference
}
