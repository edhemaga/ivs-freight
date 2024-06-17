import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';

// modules
import { SharedModule } from '@shared/shared.module';

// store
import { LoadMinimalListQuery } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.query';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

// components
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// models
import { LoadResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-card',
    templateUrl: './load-details-card.component.html',
    styleUrls: ['./load-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,

        // components
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,

        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        TaMapsComponent,

        // pipes
        FormatCurrencyPipe,
        FormatDatePipe,
    ],
})
export class LoadDetailsCardComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse | any;
    @Input() templateCard: boolean;
    public loadNote: UntypedFormControl = new UntypedFormControl();
    public loadDropdowns: any[] = [];
    public loadList: any[] = this.lmquery.getAll();
    public currentLoadIndex: any;
    constructor(
        private lmquery: LoadMinimalListQuery,
        private detailsPageDriverSer: DetailsPageService,
        public imageBase64Service: ImageBase64Service
    ) {}

    ngOnChanges(): void {
        this.getLoadDropdown();
    }
    ngOnInit(): void {
        this.loadNote.patchValue(this.load?.note);
        let currentIndex = this.loadList.findIndex(
            (brokerId) => brokerId.id === this.load.id
        );
        this.currentLoadIndex = currentIndex;
    }
    public getLoadDropdown() {
        this.loadDropdowns = this.lmquery.getAll().map((item) => {
            return {
                id: item.id,
                name: 'Invoice' + ' ' + item.loadNumber,
                svg: item?.type?.name === 'LTL' ? 'ic_ltl-status.svg' : null,
                folder: 'common',
                status: item.status,
                active: item.id === this.load.id,
            };
        });
    }
    public onSelectLoad(event: any) {
        if (event.id !== this.load.id) {
            this.loadList = this.lmquery.getAll().map((item) => {
                return {
                    id: item.id,
                    name: 'Invoice' + ' ' + item.loadNumber,
                    // svg: item.type.name === 'LTL' ? 'ic_ltl-status.svg' : null,
                    // folder: 'common',
                    status: item.status,
                    active: item.id === event.id,
                };
            });
            this.detailsPageDriverSer.getDataDetailId(event.id);
        }
    }
    public onChangeLoad(action: string) {
        let currentIndex = this.loadList.findIndex(
            (brokerId) => brokerId.id === this.load.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.loadList[currentIndex].id
                    );
                    this.onSelectLoad({ id: this.loadList[currentIndex].id });
                    this.currentLoadIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.loadList.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.loadList[currentIndex].id
                    );
                    this.onSelectLoad({ id: this.loadList[currentIndex].id });
                    this.currentLoadIndex = currentIndex;
                }
                break;
            }

            default: {
                break;
            }
        }
    }
}
