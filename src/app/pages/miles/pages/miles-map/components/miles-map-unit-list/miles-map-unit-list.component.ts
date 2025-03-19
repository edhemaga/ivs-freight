import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-miles-map-unit-list',
    templateUrl: './miles-map-unit-list.component.html',
    styleUrl: './miles-map-unit-list.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class MilesMapUnitListComponent {
    public isStopListExpanded: boolean = false;

    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }
}
