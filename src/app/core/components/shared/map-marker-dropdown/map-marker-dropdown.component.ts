import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';
import { card_component_animation } from '../../shared/animations/card-component.animations';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { Router } from '@angular/router';
import { MapsService } from '../../../services/shared/maps.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { ProfileImagesComponent } from '../profile-images/profile-images.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DetailsDropdownComponent } from '../details-page-dropdown/details-dropdown';
import { TaCounterComponent } from '../../../../shared/components/ta-counter/ta-counter.component';
import { GpsProgressbarComponent } from '../gps-progressbar/gps-progressbar.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-map-marker-dropdown',
    templateUrl: './map-marker-dropdown.component.html',
    styleUrls: ['./map-marker-dropdown.component.scss'],
    animations: [card_component_animation('showHideCardBody')],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TaThousandSeparatorPipe],
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        FormsModule,
        AngularSvgIconModule,

        // Components
        ProfileImagesComponent,
        DetailsDropdownComponent,
        TaCounterComponent,
        GpsProgressbarComponent,

        // Pipes
        formatDatePipe,
        TaThousandSeparatorPipe,
    ],
})
export class MapMarkerDropdownComponent implements OnInit {
    private destroy$ = new Subject<void>();

    @Input() title: string = '';
    @Input() item: any = {};
    @Input() type: string = '';
    @Input() sortCategory: any = {};
    @Input() locationFilterOn: boolean = false;
    @Input() rating: any = {};
    @Input() cluster: any = {};
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
    @Output() showClusterItemInfo: EventEmitter<any> = new EventEmitter();
    @Output() loadMoreData: EventEmitter<any> = new EventEmitter();
    @Output() assignUnitToDevice: EventEmitter<any> = new EventEmitter();
    @ViewChild('detailsDropdown') detailsDropdown: any;

    public dropdownActions: any = [];

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
        private detailsDataService: DetailsDataService,
        private router: Router,
        private mapsService: MapsService
    ) {}

    ngOnInit(): void {
        this.getDropdownActions();

        this.mapsService.markerUpdateChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((item) => {
                if (
                    (item.id != null && item.id == this.item.id) ||
                    (item.deviceId != null &&
                        item.deviceId == this.item.deviceId)
                ) {
                    this.item = item;
                    this.getDropdownActions();
                    this.ref.detectChanges();
                }
            });

        this.mapsService.selectedMarkerChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id != this.item.id && this.detailsDropdown?.tooltip) {
                    this.detailsDropdown.dropDownActive = -1;
                    this.detailsDropdown.tooltip.close();
                }
            });

        this.mapsService.selectedMapListCardChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                if (id != this.item.id && this.detailsDropdown?.tooltip) {
                    this.detailsDropdown.dropDownActive = -1;
                    this.detailsDropdown.tooltip.close();
                }
            });
    }

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
            ) <= 30.0
        ) {
            this.loadMoreData.emit(this.item);
        }
    }

    copyHover(type, hover) {
        if (type == 'address') {
            this.copyAddressHover = hover;
        } else if (type == 'phone') {
            this.copyPhoneHover = hover;
        } else {
            this.copyEmailHover = hover;
        }

        this.ref.detectChanges();
    }

    goToDetails() {
        this.mapsService.goToDetails(this.item, this.type);
    }

    getDropdownActions() {
        this.dropdownActions = this.mapsService.getDropdownActions(
            this.item,
            this.type
        );
    }

    assignUnit() {
        this.assignUnitToDevice.emit(this.item);
    }
}
