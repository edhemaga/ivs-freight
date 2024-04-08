import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';

// services
import { DetailsPageService } from 'src/app/shared/services/details-page.service';
import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';

// animations
import {
    animate,
    style,
    transition,
    trigger,
    state,
} from '@angular/animations';
import { cardComponentAnimation } from 'src/app/shared/animations/card-component.animation';

// store
import { TrailersMinimalListQuery } from '../../../../state/trailer-minimal-list-state/trailer-minimal.query';

// models
import { TrailerDropdown } from '../../models/trailer-dropdown.model';
import { TrailerMinimalResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-trailer-details-card',
    templateUrl: './trailer-details-card.component.html',
    styleUrls: ['./trailer-details-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        cardComponentAnimation('showHideCardBody'),
        trigger('ownerDetailsAnimation', [
            state(
                'true',
                style({
                    height: '*',
                    overflow: 'hidden',
                    opacity: 1,
                })
            ),
            state(
                'false',
                style({
                    height: '0px',
                    overflow: 'hidden',
                    opacity: 0,
                })
            ),
            transition('false <=> true', [animate('0.2s ease')]),
            transition('true <=> false', [animate('0.2s ease')]),
        ]),
    ],
})
export class TrailerDetailsCardComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() trailer: any;
    @Input() templateCard: boolean = false;

    private destroy$ = new Subject<void>();
    public note: UntypedFormControl = new UntypedFormControl();
    public titleNote: UntypedFormControl = new UntypedFormControl();
    public registrationNote: UntypedFormControl = new UntypedFormControl();
    public inspectionNote: UntypedFormControl = new UntypedFormControl();
    public toggler: boolean[] = [];
    public dataEdit;
    public toggleOwner: boolean;
    public trailerDropDowns: TrailerDropdown[] = [];
    public trailer_list: TrailerMinimalResponse[] =
        this.trailerMinimalQuery.getAll();
    public trailerIndex: number;
    public ownerCardOpened: boolean = true;

    constructor(
        public imageBase64Service: ImageBase64Service,
        private detailsPageDriverSer: DetailsPageService,
        private trailerMinimalQuery: TrailersMinimalListQuery
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.trailer?.firstChange) {
            this.getTrailerDropdown();
            this.note.patchValue(changes.trailer.currentValue.note);
        }
        this.trailerMinimalQuery.selectAll().subscribe((item) => {
            this.trailer_list = item;
        });
    }

    ngOnInit(): void {
        this.initTableOptions();
        this.getTrailerDropdown();

        setTimeout(() => {
            let currentIndex = this.trailerDropDowns.findIndex(
                (trailer) => trailer.id === this.trailer.id
            );

            this.trailerIndex = currentIndex;
        }, 300);
    }

    /**Function for toggle page in cards */
    public toggleResizePage(value: number, indexName: string): void {
        this.toggler[value + indexName] = !this.toggler[value + indexName];
    }

    /**Function for dots in cards */
    public initTableOptions(): void {
        this.dataEdit = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: 'edit',
                    class: 'regular-text',
                    contentType: 'edit',
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    class: 'delete-text',
                    contentType: 'delete',
                },
            ],
            export: true,
        };
    }

    /**Function return format date from DB */
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    public getTrailerDropdown(): void {
        this.trailerDropDowns = this.trailerMinimalQuery
            .getAll()
            .map((item) => {
                return {
                    id: item.id,
                    name: item.trailerNumber,
                    svg: item.trailerType.logoName,
                    folder: 'common/trailers',
                    status: item.status,
                    active: item.id === this.trailer.id,
                };
            });

        this.trailerDropDowns = this.trailerDropDowns.sort(
            (x, y) => Number(y.status) - Number(x.status)
        );
    }

    public onSelectedTrailer(event: { id: number }): void {
        if (event && event.id !== this.trailer.id) {
            this.trailerDropDowns = this.trailerMinimalQuery
                .getAll()
                .map((item) => {
                    return {
                        id: item.id,
                        name: item.trailerNumber,
                        status: item.status,
                        svg: item.trailerType.logoName,
                        folder: 'common/trailers',
                        active: item.id === event.id,
                    };
                });
            this.detailsPageDriverSer.getDataDetailId(event.id);

            this.trailerDropDowns = this.trailerDropDowns.sort(
                (x, y) => Number(y.status) - Number(x.status)
            );
        }
    }

    public onChangeTrailer(action: string): void {
        let currentIndex = this.trailerDropDowns.findIndex(
            (trailer) => trailer.id === this.trailer.id
        );

        switch (action) {
            case 'previous': {
                currentIndex = --currentIndex;
                if (currentIndex != -1) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }
                break;
            }
            case 'next': {
                currentIndex = ++currentIndex;
                if (
                    currentIndex !== -1 &&
                    this.trailerDropDowns.length > currentIndex
                ) {
                    this.detailsPageDriverSer.getDataDetailId(
                        this.trailerDropDowns[currentIndex].id
                    );
                    this.onSelectedTrailer({
                        id: this.trailerDropDowns[currentIndex].id,
                    });
                    this.trailerIndex = currentIndex;
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    public sortKeys = (a, b) => {
        return a.value.id > b.value.id ? -1 : 1;
    };

    public onOpenCloseCard(isCardOpen: boolean): void {
        this.ownerCardOpened = isCardOpen;
    }

    public getLastSixChars(copyValue): string | string[] {
        let lastSixChars = copyValue;

        if (copyValue.length > 6) {
            lastSixChars = copyValue.slice(-6);

            const stringLength = copyValue.length;
            const firsNum = stringLength - 6;
            lastSixChars = [copyValue.slice(0, firsNum), copyValue.slice(-6)];
        }

        return lastSixChars;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
