import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

// models
import { OpenModal } from '@shared/models/open-modal.model';
import {
    DriverListItemResponse,
    DriverMinimalResponse,
    DriverResponse,
    EnumValue,
    HosResponse,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';

// components
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';

import { ModalService } from '@shared/services/modal.service';

// tooltip
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// config
import { DispatchConfig } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/configs/dispatch.config';

@Component({
    selector: 'app-dispatch-table-driver',
    templateUrl: './dispatch-table-driver.component.html',
    styleUrls: ['./dispatch-table-driver.component.scss'],
})
export class DispatchTableDriverComponent {
    @Input() public driver: DriverResponse;
    @Input() public rowIndex: number;
    @Input() public driverList: DriverListItemResponse[];
    @Input() public isBoardLocked: boolean;
    @Input() public phone: string;
    @Input() public email: string;
    @Input() public isDrag: boolean;
    @Input() public draggingType: string;
    @Input() public openedDriverDropdown: number;
    @Input() public isActiveLoad: boolean;
    @Input() public hoursOfService: HosResponse;
    @Input() public dispatchId: number;
    @Input() public isHoveringRow: boolean;
    @Input() public openedHosData: any; //leave this any because we are not doing this now

    @Input() set driverDropdownWidth(value: number) {
        this._driverDropdownWidth = value - 2;
    }

    @Output() addDriverEmitter = new EventEmitter<{
        event: DriverMinimalResponse;
        index: number;
    }>();

    @Output() removeDriverEmitter = new EventEmitter<{
        index: number;
    }>();

    @Output() setDriverDropdownIndexEmitter = new EventEmitter<{
        index: number;
    }>();

    @Output() driverVacationEmitter = new EventEmitter<{}>();

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
    public _driverDropdownWidth: number;

    public tooltip: NgbTooltip;

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(
        private ref: ChangeDetectorRef,
        private modalService: ModalService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {}

    get driverInputConfig(): ITaInput {
        return DispatchConfig.getDriverInputConfig(this._driverDropdownWidth);
    }

    public identity(_: number, item: EnumValue): number {
        return item.id;
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

        const el = this.renderer.createElement(
            DispatchTableStringEnum.TEXTAREA
        );

        this.renderer.setProperty(el, DispatchTableStringEnum.VALUE, text);
        this.renderer.appendChild(this.el.nativeElement, el);

        el.select();
        document.execCommand(DispatchTableStringEnum.COPY);

        this.renderer.removeChild(this.el.nativeElement, el);
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

        this.openedDriverDropdown = -1;
        this.setDriverDropdownIndexEmitter.emit({
            index: this.openedDriverDropdown,
        });
    }

    public removeDriver(index: number): void {
        if (this.isActiveLoad) return;

        this.removeDriverEmitter.emit({
            index,
        });
    }

    public showDriverDropdown(ind: number) {
        this.openedDriverDropdown = ind;
        this.setDriverDropdownIndexEmitter.emit({
            index: this.openedDriverDropdown,
        });
    }

    public toggleHos(tooltip: NgbTooltip, data: any): void {
        if (!data.length)
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

    public userChangeEnd(item: any): void {
        //leave this any because we are not doing this now
        const index = item.indx;
        const nextHos = index + 1;
        if (this.openedHosData[nextHos])
            setTimeout(() => {
                this.changeHosDataPositions(index);
            });
    }

    private changeHosDataPositions(index: number): void {
        const nextHos = index + 1;
        if (this.openedHosData[nextHos])
            this.openedHosData[nextHos].start = this.openedHosData[index].end;
    }

    public addHOS(hosType: string): void {
        this.openedHosData = [...this.openedHosData];
        this.openedHosData.push({
            start: this.openedHosData[this.openedHosData.length - 1].end,
            end: new Date().getHours() * 60 + new Date().getMinutes(),
            flag: { name: hosType },
            indx: this.openedHosData.length,
        });
    }

    public removeHos(item: any): void {
        //leave this any because we are not doing this now
        this.openedHosData = this.openedHosData.filter(
            (hos: any) => hos.indx !== item.indx //leave this any because we are not doing this now
        );
    }

    public handleDriverVacation(): void {
        this.driverVacationEmitter.emit();
    }
}
