import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnInit,
} from '@angular/core';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ca-main-table',
    templateUrl: './ca-main-table.component.html',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./ca-main-table.component.scss'],
})
export class CaMainTableComponent implements OnInit {
    @Input() columns: ColumnConfig[] = [];
    @Input() data$: Observable<any[]>; // Accepts the data as an observable

    constructor(private injector: Injector, private cdRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.data$.subscribe((data) => {
            // Trigger change detection to update the view when data changes
            this.cdRef.detectChanges();
        });
    }

    createInjector(rowData: any, inputs: { [key: string]: any }): Injector {
        const inputProviders = Object.keys(inputs || {}).map(key => ({
          provide: key,
          useValue: inputs[key]
        }));
        return Injector.create({
          providers: inputProviders,
          parent: this.injector
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
}
