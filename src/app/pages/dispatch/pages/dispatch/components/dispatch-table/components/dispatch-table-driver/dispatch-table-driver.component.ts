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

// models
import { OpenModal } from '@shared/models/open-modal.model';
import { DriverMinimalResponse, HosResponse } from 'appcoretruckassist';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';

// components
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';

import { ModalService } from '@shared/services/modal.service';

// tooltip
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch.config';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

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
    @Input() public statusOpenedIndex: number;
    @Input() public hoursOfService: HosResponse;
    @Input() public dispatchId: number;

    @Output() addDriverEmitter = new EventEmitter<{
        event: DriverMinimalResponse;
        index: number;
    }>();

    @Output() removeDriverEmitter = new EventEmitter<{
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
    public driverIndex: number = -1;

    public tooltip: NgbTooltip;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(
        private ref: ChangeDetectorRef,
        private modalService: ModalService
    ) {}

    get driverInputConfig(): ITaInput {
        return DispatchConfig.getDriverInputConfig();
    }

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

        const el = document.createElement(DispatchTableStringEnum.TEXTAREA);
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand(DispatchTableStringEnum.COPY);
        document.body.removeChild(el);
    }

    public addDriver<T extends OpenModal>(event: T): void {
        if (event) {
            if (event.canOpenModal) {
                this.modalService.setProjectionModal({
                    action: DispatchTableStringEnum.OPEN,
                    payload: {
                        key: DispatchTableStringEnum.DRIVER_MODAL,
                        value: null,
                    },
                    component: DriverModalComponent,
                    size: DispatchTableStringEnum.SMALL,
                });
            } else {
                this.addDriverEmitter.emit({
                    event: event as DriverMinimalResponse,
                    index: this.rowIndex,
                });
            }
        }
    }

    public removeDriver(index: number): void {
        if (this.isActiveLoad) return;

        this.removeDriverEmitter.emit({
            index,
        });
    }

    public showDriverDropdown(ind: number) {
        this.openedDriverDropdown = ind;
    }

    public toggleHos(tooltip: NgbTooltip, data: any) {
        if (!data || data.length === 0)
            data = [
                {
                    start: 0,
                    end: new Date().getHours() * 60 + new Date().getMinutes(),
                    flag: DispatchTableStringEnum.OFF_2,
                    indx: 0,
                },
            ];

        this.tooltip = tooltip;

        //this.openedHosData = data; leave this for now

        if (tooltip.isOpen()) tooltip.close();
        else tooltip.open();
    }

    public identity(index: number, item: any): number {
        //leave this any for now
        return item.id;
    }
}
