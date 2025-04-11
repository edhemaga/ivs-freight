import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { takeUntil, take, Subject } from 'rxjs';

// services
import { DetailsPageService } from '@shared/services/details-page.service';
import { RoadsideService } from '@pages/safety/violation/services/roadside.service';

// store
import { RoadsideDetailsListQuery } from '@pages/safety/violation/state/roadside-details-state/roadside-details-list-state/roadside-details-list.query';

// models
import { LoadResponse, RoadsideInspectionResponse } from 'appcoretruckassist';

// enums
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-violation-details',
    templateUrl: './violation-details.component.html',
    styleUrls: ['./violation-details.component.scss'],
    providers: [DetailsPageService],
})
export class ViolationDetailsComponent implements OnInit {
    public violationInitCongif: any[] = [];
    public violationData: any;
    private destroy$ = new Subject<void>();
    public violationDrop: any;
    public violationId: number;
    constructor(
        private act_route: ActivatedRoute,
        private router: Router,
        private detailsPageService: DetailsPageService,
        private rsdlq: RoadsideDetailsListQuery,
        private roadSer: RoadsideService
    ) {}

    ngOnInit(): void {
        this.initOptions();
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.rsdlq.hasEntity(id)) {
                    query = this.rsdlq.selectEntity(id).pipe(take(1));
                } else {
                    query = this.roadSer.getRoadsideById(id);
                }
                query.pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: LoadResponse) => {
                        this.violationConfig(res);
                        this.router.navigate([
                            `/safety/violation/${res.id}/details`,
                        ]);
                    },
                    error: () => {},
                });
            });
        this.violationConfig(this.act_route.snapshot.data.roadItem);
    }
    /**Function for dots in cards */
    public initOptions(): void {
        this.violationDrop = {
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
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    show: true,
                },

                {
                    title: 'Edit',
                    name: eGeneralActions.EDIT_LOWERCASE,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                },

                {
                    title: 'Add Citation',
                    name: 'add-citation',
                    svg: 'assets/svg/common/ic_plus.svg',
                    show: true,
                },
            ],
            export: true,
        };
    }
    /**Default names for header */
    public violationConfig(data: RoadsideInspectionResponse) {
        this.violationInitCongif = [
            {
                id: 0,
                name: 'Roadside Insp. Detail',
                template: 'general',
                data: data,
                secondName: '',
            },
            {
                id: 1,
                name: 'Team',
                template: 'violation',
                data: data,
                hide: true,
                customText: 'Time Weight',
                hasArrow: false,
                length: data?.violations?.length ? data.violations.length : 0,
                counterViolation: data?.timeWeight ? data.timeWeight : 0,
                secondName: 'Violation',
            },
            {
                id: 2,
                name: 'Citation',
                template: 'citation',
                data: data,
                length: 12,
                secondName: '',
            },
        ];
        this.violationId = data?.id ? data.id : null;
    }

    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }
}
