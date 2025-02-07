import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-table-toolbar',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, SvgIconComponent],
    templateUrl: './new-table-toolbar.component.html',
    styleUrl: './new-table-toolbar.component.scss',
})
export class NewTableToolbarComponent {
    // Inputs
    @Input() title: string;
    @Input() leftSide: TemplateRef<any>;
    @Input() rightSide: TemplateRef<any>;
    @Input() showPlusIcon: boolean = true;

    // Outputs
    @Output() onPlusClick: EventEmitter<boolean> = new EventEmitter();

    public plusIcon = SharedSvgRoutes.PLUS_ICON;

    constructor() {}
}
