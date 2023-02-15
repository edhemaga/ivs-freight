import { CommonModule } from '@angular/common';
import {
    Component,
    Host,
    ViewChild,
    TemplateRef,
    AfterViewInit,
    Input,
} from '@angular/core';
import { NgbTooltip, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'mainTooltip, [mainTooltip]',
    templateUrl: './app-tooltip.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
    providers: [NgbTooltip]

})
export class AppTooltipComponent implements AfterViewInit {
    @Input() mainTooltip: string = '';
    @Input() position: string = '';
    @Input() openTooltipDelay: number = 300;
    @Input() tooltipBackground: string = 'rgb(40, 82, 159)';
    @Input() tooltipColor: string = '#fff';
    @Input() tooltipTextAlign: string = 'left';
    @ViewChild(TemplateRef, { static: false }) template: TemplateRef<void>;

    ngAfterViewInit() {
        this.bindTemplete();
    }
    bindTemplete() {
        if (this.ngbTooltop) {
            this.ngbTooltop.tooltipClass = 'app-main-tooltip';
            this.ngbTooltop.placement = this.position;
            this.ngbTooltop.ngbTooltip = this.template;
            this.ngbTooltop.openDelay = this.openTooltipDelay;
        }
    }
    constructor(@Host() private ngbTooltop: NgbTooltip) {
        this.ngbTooltop.container = 'body';
    }
}
