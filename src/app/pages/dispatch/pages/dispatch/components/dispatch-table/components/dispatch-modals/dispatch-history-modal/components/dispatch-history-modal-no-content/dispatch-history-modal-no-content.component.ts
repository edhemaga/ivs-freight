import { Component, EventEmitter, Input, Output } from '@angular/core';

// svg routes
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';

@Component({
    selector: 'app-dispatch-history-modal-no-content',
    templateUrl: './dispatch-history-modal-no-content.component.html',
    styleUrls: ['./dispatch-history-modal-no-content.component.scss'],
})
export class DispatchHistoryModalNoContentComponent {
    @Input() hasNoneSelected: boolean;

    @Output() resetFiltersEmitter = new EventEmitter<boolean>();

    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    public handleResetFiltersClick(): void {
        this.resetFiltersEmitter.emit(true);
    }
}
