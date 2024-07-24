import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

@Component({
    selector: 'app-dispatch-table-driver',
    templateUrl: './dispatch-table-driver.component.html',
    styleUrls: ['./dispatch-table-driver.component.scss'],
})
export class DispatchTableDriverComponent {
    @Input() public driver: any;
    @Input() public rowIndex: number;
    @Input() public driverList: any;
    @Input() public isBoardLocked: boolean;
    @Input() public phone: string;
    @Input() public email: string;
    @Input() public isDrag: boolean;
    @Input() public draggingType: string;
    @Input() public openedDriverDropdown: number;
    @Input() public isActiveLoad: boolean;

    @Output() addDriverEmitter = new EventEmitter<any>();
    @Output() removeDriverEmitter = new EventEmitter<{
        type: string;
        index: number;
    }>();

    public driverFormControl: UntypedFormControl = new UntypedFormControl();

    public driverHover: { indx: number; txt: string } = {
        indx: -1,
        txt: '',
    };
    public driverCopy: { indx: number; txt: string } = {
        indx: -1,
        txt: '',
    };

    public copyIndex: number = -1;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(private ref: ChangeDetectorRef) {}

    public setMouseOver(txt: string, indx: number) {
        this.driverHover = {
            indx: indx,
            txt: txt,
        };
    }

    public setMouseOut() {
        this.driverHover = {
            indx: -1,
            txt: '',
        };
    }

    public copy(text: string, indx: number, type: string): void {
        this.driverCopy = {
            indx: indx,
            txt: type,
        };
        this.copyIndex = indx;

        setTimeout(() => {
            this.driverCopy = {
                indx: -1,
                txt: '',
            };
            this.copyIndex = -1;
            this.ref.detectChanges();
        }, 2000);

        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    public showDriverDropdown(ind: number) {
        this.openedDriverDropdown = ind;
    }
}
