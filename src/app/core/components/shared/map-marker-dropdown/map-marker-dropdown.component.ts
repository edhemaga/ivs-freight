import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

@Component({
    selector: 'app-map-marker-dropdown',
    templateUrl: './map-marker-dropdown.component.html',
    styleUrls: ['./map-marker-dropdown.component.scss'],
    animations: [card_component_animation('showHideCardBody')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapMarkerDropdownComponent implements OnInit {
    @Input() title: string = '';
    @Input() item: any = {};
    @Input() type: string = '';
    @Input() sortCategory: any = {};
    @Input() locationFilterOn: boolean = false;
    @Input() dropdownActions: any[] = [];
    @Input() rating: any = {};
    @Input() cluster: any = {};
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    @Output() showClusterItemInfo: EventEmitter<any> = new EventEmitter();
    @Output() loadMoreData: EventEmitter<any> = new EventEmitter();

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

    public copyPhoneHover: boolean = false;
    public copyEmailHover: boolean = false;
    public copyAddressHover: boolean = false;

    constructor(
        private ref: ChangeDetectorRef,
        private detailsDataService: DetailsDataService
    ) {}

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
                    this.ref.detectChanges();
                }, 2100);
                break;

            case 'email':
                this.copiedEmail = true;
                setTimeout(() => {
                    this.copiedEmail = false;
                    this.ref.detectChanges();
                }, 2100);
                break;

            case 'address':
                this.copiedAddress = true;
                setTimeout(() => {
                    this.copiedAddress = false;
                    this.ref.detectChanges();
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
        
        this.ref.detectChanges();
    }

    toggleWorkingHours() {
        this.showAllDays = !this.showAllDays;
        this.ref.detectChanges();
    }

    showMoreOptions() {
        //event.preventDefault();
        //event.stopPropagation();

        this.ref.detectChanges();
    }

    callBodyAction(action) {
        this.bodyActions.emit(action);
    }

    // RAITING
    onLike(event) {
        event.preventDefault();
        event.stopPropagation();

        this.detailsDataService.setNewData(this.item);
        this.detailsDataService.changeRateStatus(
            'like',
            !this.rating?.hasLiked
        );

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'like',
        });
    }

    onDislike(event) {
        event.preventDefault();
        event.stopPropagation();

        this.detailsDataService.setNewData(this.item);
        this.detailsDataService.changeRateStatus(
            'dislike',
            !this.rating?.hasDislike
        );

        this.bodyActions.emit({
            data: this.item,
            type: 'raiting',
            subType: 'dislike',
        });
    }

    openClusterItemInfo(item2) {
        
        this.showClusterItemInfo.emit([this.item, item2]);
    }

    clusterListScroll(event) {
        var element = event.target;
        if (
            Math.abs(
                element.scrollHeight - element.scrollTop - element.clientHeight
            ) <= 3.0
        ) {
            this.loadMoreData.emit(this.item);
        }
    }
    
    copyHover(type, hover) {
        if ( type == 'address' ) {
            this.copyAddressHover = hover;
        } else if ( type == 'phone' ) {
            this.copyPhoneHover = hover;
        } else {
            this.copyEmailHover = hover;
        }
        
        this.ref.detectChanges();
    }
}
