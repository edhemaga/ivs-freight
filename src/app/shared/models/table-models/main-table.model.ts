import { TemplateRef, ElementRef } from '@angular/core';

export interface ColumnConfig {
    header: string;
    field?: string;
    row?: boolean;
    
    sortable?: boolean;
    reorderable?: boolean;
    hiddeOnTableReduce?: boolean,
    pipeType?: 'currency' | 'date';
    pipeString?: string;
    headerCellType?: 'text' | 'template';
    headerTemplate?: ElementRef<any>;
    cellType: 'text' | 'component' | 'template';
    cellCustomClasses?: string;
    textCustomClasses?: string;
    component?: any; // For custom components
    inputs?: { [key: string]: any }; // Inputs for the custom component
    outputs?: { [key: string]: (event: any) => void }; // Outputs for the custom component
    template?: ElementRef<any>; 
    templateRef?: TemplateRef<any>;
    // Optional template reference
}
