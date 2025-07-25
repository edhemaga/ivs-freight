import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-navigation-subroute-card',
    templateUrl: './navigation-subroute-card.component.html',
    styleUrls: ['./navigation-subroute-card.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class NavigationSubrouteCardComponent implements OnChanges {
    @Input() isNavigationCardActive: boolean;
    @Input() contentHeight: number = 0;
    @Input() isRouteActive: boolean = false;
    @Input() slowAnimation: boolean = false;

    @Output() subrouteContainerActive = new EventEmitter<Boolean>();

    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnChanges() {
        this.subrouteContainerActive.emit(this.isNavigationCardActive);
        this.cdRef.detectChanges();
    }
}
