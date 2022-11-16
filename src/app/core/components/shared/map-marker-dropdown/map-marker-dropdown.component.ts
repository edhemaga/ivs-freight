import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { card_component_animation } from '../../shared/animations/card-component.animations';

@Component({
    selector: 'app-map-marker-dropdown',
    templateUrl: './map-marker-dropdown.component.html',
    styleUrls: ['./map-marker-dropdown.component.scss'],
    animations: [card_component_animation('showHideCardBody')],
})
export class MapMarkerDropdownComponent implements OnInit {
    @Input() title: string = '';
    @Input() item: any = {};
    @Input() type: string = '';
    @Input() sortCategory: any = {};
    @Input() locationFilterOn: boolean = false;
    @Input() dropdownActions: any[] = [];
    @Input() rating: any = {};
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();

    public copiedPhone: boolean = false;
    public copiedEmail: boolean = false;
    public copiedAddress: boolean = false;
    public showAllDays: boolean = false;

    public fuelPriceColors: any[] = [
        '#4CAF4F',
        '#8AC34A',
        '#FEC107',
        '#FF9800',
        '#EF5350',
        '#919191',
    ];

    constructor(private ref: ChangeDetectorRef) {}

    ngOnInit(): void {}

    expandInfo() {
        this.item.isExpanded = !this.item.isExpanded;
        this.ref.detectChanges();
    }

    public copyText(val: any, copVal: string) {
        switch (copVal) {
            case 'phone':
                this.copiedPhone = true;
                setTimeout(() => {
                    this.copiedPhone = false;
                }, 2100);
                break;

            case 'email':
                this.copiedEmail = true;
                setTimeout(() => {
                    this.copiedEmail = false;
                }, 2100);
                break;

            case 'address':
                this.copiedAddress = true;
                setTimeout(() => {
                    this.copiedAddress = false;
                }, 2100);
                break;
        }

        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        // selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    toggleWorkingHours() {
        this.showAllDays = !this.showAllDays;
    }

    showMoreOptions(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    callBodyAction(action) {
        this.bodyActions.emit(action);
    }

    // RAITING
    onLike(event) {
        event.preventDefault();
        event.stopPropagation();

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'like',
        });
    }

    onDislike(event) {
        event.preventDefault();
        event.stopPropagation();

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'dislike',
        });
    }
}
