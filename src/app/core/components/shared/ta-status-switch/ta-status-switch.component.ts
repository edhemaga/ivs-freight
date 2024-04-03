import { Subject } from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import moment from 'moment-timezone';
import { StatusPipe } from '../../../../shared/pipes/status-pipe.pipe';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchService } from 'appcoretruckassist';

export interface IDispatchModel {
    id: number;
    name: string;
}

@Component({
    selector: 'app-ta-status-switch',
    templateUrl: './ta-status-switch.component.html',
    styleUrls: ['./ta-status-switch.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [StatusPipe],
    standalone: true,
    imports: [CommonModule, FormsModule, StatusPipe, NgbModule],
    animations: [
        trigger('shadowAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('100ms', style({ opacity: '*' })),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class TaStatusSwitchComponent implements OnInit {
    @Input() status: {
        statusValue: IDispatchModel;
        statusString: string;
    };
    @Input() nextStopType: IDispatchModel;
    @Input() currentStopType: IDispatchModel;
    @Input() dispatchboardId: number;
    @Input() pickupCount: number;
    @Input() deliveryCount: number;

    @Input() statusDate: Date = new Date();
    private destroy$ = new Subject<void>();
    @Input() statusLoadCount: number = 0;
    @Input() statusMainIndex: number;
    @Input() openedStatus: number;
    @Input() statusHeight: number;
    @Input() withStatusAgo: boolean;
    @Input() dispatchId: number;

    statusAgo: string = '';
    changeIndex: any;
    changedStatusLoadCount: any;
    items: any = [];
    statusMainSignal = 0;
    @Input() possibleNextStatuses: any;

    @Output() openIndex: EventEmitter<any> = new EventEmitter();
    @Output() changeStatus: EventEmitter<any> = new EventEmitter();

    constructor(
        private cdr: ChangeDetectorRef,
        private dispatchService: DispatchService
    ) {}

    ngOnInit(): void {
        let status_time = moment(new Date(this.statusDate).getTime()).format(
            'YYYY-MM-DD HH:mm'
        );

        this.statusAgo = this.timeSince(new Date(status_time));

        this.changeIndex = this.status.statusValue.id;
        this.changedStatusLoadCount = this.statusLoadCount;
    }

    public openMainIndex(): void {
        this.openIndex.emit(this.statusMainIndex);
    }

    onClose() {
        this.openIndex.emit(-1);
    }

    public setStatus(status, indx): void {
        this.changeStatus.emit(status);
    }

    public updateStatusFilter() {}

    public async openPopover(t2) {
        if (this.dispatchId) {
            this.dispatchService
                .apiDispatchNextstatusesIdGet(this.dispatchId)
                .subscribe((statuses) => {
                    t2.open({ data: statuses });
                    this.openMainIndex();
                });
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    timeSince(date: any) {
        var new_date: any = new Date();

        var seconds = Math.floor((new_date - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + 'y. ago';
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + 'm. ago';
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + 'd. ago';
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + 'h. ago';
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + 'm. ago';
        }
        return Math.floor(seconds) + 's. ago';
    }
}
