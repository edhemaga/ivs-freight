import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';
@Component({
    selector: 'app-navigation-subroute-card',
    templateUrl: './navigation-subroute-card.component.html',
    styleUrls: ['./navigation-subroute-card.component.scss'],
})
export class NavigationSubrouteCardComponent implements OnChanges {
    @Input() isNavigationCardActive: boolean = false;
    @Input() contentHeight: number = 0;
    @Output() subrouteContainerActive = new EventEmitter<Boolean>();
    ngOnChanges() {
        this.subrouteContainerActive.emit(this.isNavigationCardActive);
        console.log(this.isNavigationCardActive);
    }
}
