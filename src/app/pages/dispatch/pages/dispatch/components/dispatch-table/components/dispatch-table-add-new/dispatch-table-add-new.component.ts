import { Component, OnInit } from '@angular/core';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

@Component({
    selector: 'app-dispatch-table-add-new',
    templateUrl: './dispatch-table-add-new.component.html',
    styleUrls: ['./dispatch-table-add-new.component.scss'],
})
export class DispatchTableAddNewComponent implements OnInit {
    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor() {}

    ngOnInit(): void {}
}
