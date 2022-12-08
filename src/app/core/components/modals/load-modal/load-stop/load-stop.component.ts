import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-load-stop',
    templateUrl: './load-stop.component.html',
    styleUrls: ['./load-stop.component.scss'],
})
export class LoadStopComponent {
    @Input() firstOrLast: boolean = false;
    @Input() isDelivery: boolean = false;
    @Input() stopNumber: number;
    @Input() shipper: string;
    @Input() shipperAddress: string;
    @Input() dateRange: any;
    @Input() timeRange: any;
    @Input() legMile: string;
    @Input() isEmptyLoad: boolean;
    @Input() shipperContact: {
        fullName: string;
        avatar: string;
    };

    public activeStop: boolean = false;

    @Output('toggle') toggleEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    public toggleStop() {
        this.activeStop = !this.activeStop;
        this.toggleEvent.emit(this.activeStop);
    }
}
