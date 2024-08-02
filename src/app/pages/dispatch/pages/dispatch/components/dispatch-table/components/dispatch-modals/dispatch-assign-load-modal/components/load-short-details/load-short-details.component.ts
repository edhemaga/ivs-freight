import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Models
import { AssignedLoadResponse } from 'appcoretruckassist';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-parking-svg-routes';

@Component({
    selector: 'app-load-short-details',
    templateUrl: './load-short-details.component.html',
    styleUrls: ['./load-short-details.component.scss'],
})
export class LoadShortDetailsComponent implements OnInit {
    @Input() load: AssignedLoadResponse;
    @Input() index: number;
    @Input() isAssigned: boolean;
    @Input() activeLoadId: number;
    @Input() isDisabled: boolean;

    // Outputs
    @Output() changeLoadList$: EventEmitter<number> = new EventEmitter();
    @Output() selectLoad$: EventEmitter<number> = new EventEmitter();

    // Svg
    public svgIcons = DispatchParkingSvgRoutes;

    constructor() {}

    ngOnInit(): void {}

    public changeLoadList(): void {
        this.changeLoadList$.emit();
    }

    public selectLoad(): void {
        this.selectLoad$.emit();
    }
}
