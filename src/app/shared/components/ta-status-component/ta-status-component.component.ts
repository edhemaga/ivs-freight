import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { LoadService } from '@shared/services/load.service';
import type { LoadStatus } from 'appcoretruckassist';

@Component({
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    selector: 'app-ta-status-component',
    templateUrl: './ta-status-component.component.html',
    styleUrls: ['./ta-status-component.component.scss'],
    imports: [
        // modules
        NgbModule,
        CommonModule,
        LoadStatusStringComponent,
    ],
})
export class TaStatusComponentComponent implements OnInit {
    @Input() statusId: number;
    public statusDetails: any = null;
    constructor(private loadService: LoadService) {}

    ngOnInit(): void {
        this.loadService
            .getLoadStatusDropdownOptions(this.statusId)
            .pipe()
            .subscribe((res) => {
                this.statusDetails = res;
            });
    }

    sendStatus(item: any) {
        this.loadService.updateStatus({
            id: this.statusId,
            data: item as LoadStatus,
        });
    }
}
