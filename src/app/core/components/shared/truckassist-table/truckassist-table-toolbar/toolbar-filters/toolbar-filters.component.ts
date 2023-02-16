import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarrierSearchComponent } from 'src/app/core/components/standalone-components/carrier-search/carrier-search.component';
import { FilterComponent } from '../../../../standalone-components/filter/filter.component';
import { MapsService } from 'src/app/core/services/shared/maps.service';

@Component({
    selector: 'app-toolbar-filters',
    templateUrl: './toolbar-filters.component.html',
    styleUrls: ['./toolbar-filters.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, CarrierSearchComponent, FilterComponent]
})
export class ToolbarFiltersComponent implements OnInit, OnChanges {
    @Output() toolbarFilter: EventEmitter<any> = new EventEmitter();
    @Input() options: any;
    @Input() activeTableData: any;

    activeViewMode: any = {name: 'List', active: true};

    constructor(private mapsService: MapsService) {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {}

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.options?.firstChange && changes?.options) {
            this.options = changes.options.currentValue;
        }

        if (
            !changes?.activeTableData?.firstChange &&
            changes?.activeTableData
        ) {
            this.activeTableData = changes.activeTableData.currentValue;
        }
    }

    changeModeView(modeView: string) {
        this.options.toolbarActions.viewModeOptions =
            this.options.toolbarActions.viewModeOptions.map((viewMode: any) => {
                viewMode.active = viewMode.name === modeView;

                if ( viewMode.active ) this.activeViewMode = viewMode;

                return viewMode;
            });

        this.toolbarFilter.emit({
            mode: modeView,
        });
    }

    setFilterEvent(event) {
        if ( this.activeViewMode.name == 'Map' ) {
            console.log('setFilterEvent', event);
            console.log('setFilterEvent activeViewMode', this.activeViewMode);
            this.mapsService.toggleFilter(event);
        }
    }
}
