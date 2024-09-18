import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';
import { Observable } from 'rxjs';
import { CaMainTableHiddenRowsPipe } from './pipes/ca-main-table-hidden-rows/ca-main-table-hidden-rows.pipe';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragMove,
    CdkDragPlaceholder,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-ca-main-table',
    templateUrl: './ca-main-table.component.html',
    standalone: true,
    imports: [
        CdkDropListGroup,
        CdkDropList,
        CdkDrag,
        CdkDragPlaceholder,
        CaMainTableHiddenRowsPipe,
        CommonModule,
    ],
    styleUrls: ['./ca-main-table.component.scss'],
})
export class CaMainTableComponent implements OnInit {
    // Outputs
    @Output() onPressEvent: EventEmitter<any> = new EventEmitter<any>();

    // Inputs
    @Input() hideFieldsToHide: boolean;
    @Input() columns: ColumnConfig[] = [];
    @Input() data$: Observable<any[]>; // Accepts the data as an observable

    constructor(private injector: Injector, private cdRef: ChangeDetectorRef) {}

    onPressRow(rowData: any) {
        this.onPressEvent.emit(rowData);
    }

    ngOnInit() {
        this.data$.subscribe((data) => {
            // Trigger change detection to update the view when data changes
            this.cdRef.detectChanges();
        });
    }

    createInjector(rowData: any, inputs: { [key: string]: any }): Injector {
        const inputProviders = Object.keys(inputs || {}).map((key) => ({
            provide: key,
            useValue: inputs[key],
        }));
        return Injector.create({
            providers: inputProviders,
            parent: this.injector,
        });
    }

    attachOutputs(
        componentRef: any,
        outputs: { [key: string]: (event: any) => void }
    ): void {
        Object.keys(outputs).forEach((outputKey) => {
            if (componentRef.instance[outputKey]) {
                componentRef.instance[outputKey].subscribe(outputs[outputKey]);
            }
        });
    }

    dropHeader(event: CdkDragDrop<string[]>) {
        console.log('THIS IS DROPPEEDD', event);
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

    drop(event: CdkDragDrop<string[]>) {
        console.log('THIS IS DROPPEEDD', event);
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
}
