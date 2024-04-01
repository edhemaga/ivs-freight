import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LoadResponse } from 'appcoretruckassist';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { LoadMinimalListQuery } from '../../state/load-details-state/load-minimal-list-state/load-details-minimal.query';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

@Component({
    selector: 'app-load-card-view',
    templateUrl: './load-card-view.component.html',
    styleUrls: ['./load-card-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadCardViewComponent implements OnInit, OnChanges {
    @Input() load: LoadResponse | any;
    @Input() templateCard: boolean;
    public loadNote: UntypedFormControl = new UntypedFormControl();
    public loadDropdowns: any[] = [];
    public loadList: any[] = this.lmquery.getAll();
    public currentLoadIndex: any;
    constructor(
        private lmquery: LoadMinimalListQuery,
        private detailsPageDriverSer: DetailsPageService,
        public imageBase64Service: ImageBase64Service,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
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
