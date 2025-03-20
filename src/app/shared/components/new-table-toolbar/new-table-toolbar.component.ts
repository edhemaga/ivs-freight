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
    imports: [CommonModule, AngularSvgIconModule, SvgIconComponent],
    templateUrl: './new-table-toolbar.component.html',
    styleUrl: './new-table-toolbar.component.scss',
    standalone: true,
})
export class NewTableToolbarComponent {
    // Inputs
    @Input() title: string;
    @Input() leftSide: TemplateRef<any>;
    @Input() rightSide: TemplateRef<any>;
    @Input() showPlusIcon: boolean = true;
    @Input() isMarginTopDisabled: boolean = false;

    // Outputs
    @Output() onPlusClick: EventEmitter<boolean> = new EventEmitter();

    public plusIcon = SharedSvgRoutes.PLUS_ICON;

    constructor() {}
}
