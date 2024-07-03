import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

// Models
import { SelectedStatus } from '@pages/load/pages/load-modal/models/load-modal-status.model';

// Pipes
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

@Component({
    selector: 'app-load-status-string',
    templateUrl: './load-status-string.component.html',
    styleUrls: ['./load-status-string.component.scss'],
    standalone: true,
    imports: [
      CommonModule,

      // Pipes
      LoadStatusColorPipe
    ],
})
export class LoadStatusStringComponent implements OnInit {
    @Input() status: SelectedStatus;
    public displayString: string[] = [];
    public className: string;
    constructor() {}

    ngOnInit(): void {
      this.displayString = this.status.name.split(' ');
      this.className = this.status.valueForRequest.toLowerCase();
    }
}
