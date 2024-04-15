import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

//Models
import { LoadResponse } from 'appcoretruckassist';

//Services
import { DetailsPageService } from '@shared/services/details-page.service';
import { ImageBase64Service } from '@shared/services/image-base64.service';

//Store
import { LoadMinimalListQuery } from '@pages/load/state/load-details-state/load-minimal-list-state/load-details-minimal.query';

@Component({
    selector: 'app-load-details-card',
    templateUrl: './load-details-card.component.html',
    styleUrls: ['./load-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
