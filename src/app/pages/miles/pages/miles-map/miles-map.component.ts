import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-miles-map',
    templateUrl: './miles-map.component.html',
    styleUrl: './miles-map.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class MilesMapComponent {
    public isStopListExpanded: boolean = false;

    public toogleStopList(): void {
        this.isStopListExpanded = !this.isStopListExpanded;
    }
}
