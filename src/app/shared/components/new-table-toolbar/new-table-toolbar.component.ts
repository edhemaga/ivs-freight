import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-new-table-toolbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './new-table-toolbar.component.html',
    styleUrl: './new-table-toolbar.component.scss',
})
export class NewTableToolbarComponent {
    @Input() title: string;
    @Input() leftSide: TemplateRef<any>;
    @Input() rightSide: TemplateRef<any>;
    constructor() {}
}
