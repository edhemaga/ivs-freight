import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-miles-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './miles-map.component.html',
    styleUrl: './miles-map.component.scss',
})
export class MilesMapComponent {
    public isStopListExpanded: boolean = false;

    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }
}
