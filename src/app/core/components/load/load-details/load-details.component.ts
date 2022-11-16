import {
    Component,
    OnInit,
    OnChanges,
    SimpleChanges,
    OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { DetailsPageService } from 'src/app/core/services/details-page/details-page-ser.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { LoadResponse } from '../../../../../../appcoretruckassist/model/loadResponse';
import { LoadDetailsListQuery } from '../state/load-details-state/load-details-list-state/load-d-list.query';
import { LoadTService } from '../state/load.service';

@Component({
    selector: 'app-load-details',
    templateUrl: './load-details.component.html',
    styleUrls: ['./load-details.component.scss'],
    providers: [DetailsPageService],
})
export class LoadDetailsComponent implements OnInit, OnChanges, OnDestroy {
    public loadConfig: any;
    private destroy$ = new Subject<void>();
    public statusIsClosed: boolean;
    constructor(
        private activated_route: ActivatedRoute,
        private detailsPageService: DetailsPageService,
        private loadTservice: LoadTService,
        private router: Router,
        private notificationService: NotificationService,
        private ldlQuery: LoadDetailsListQuery
    ) {}
    ngOnChanges(changes: SimpleChanges) {}
    ngOnInit(): void {
        this.detailsPageService.pageDetailChangeId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
                let query;
                if (this.ldlQuery.hasEntity(id)) {
                    query = this.ldlQuery.selectEntity(id).pipe(take(1));
                } else {
                    query = this.loadTservice.getLoadById(id);
                }
                query.pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: LoadResponse) => {
                        this.detailCongif(res);
                        this.router.navigate([`/load/${res.id}/details`]);
                        this.notificationService.success(
                            'Load successfully changed',
                            'Success:'
                        );
                    },
                    error: () => {
                        this.notificationService.error(
                            "Load can't be loaded",
                            'Error:'
                        );
                    },
                });
            });
        this.detailCongif(this.activated_route.snapshot.data.loadItem);
    }
    /**Function template and names for header and other options in header */
    public detailCongif(data: LoadResponse) {
        if (data?.statusType?.name === 'Closed') {
            this.statusIsClosed = true;
        } else {
            this.statusIsClosed = false;
        }

        this.loadConfig = [
            {
                id: 0,
                name: `${data?.statusType?.name} Load Details`,
                template: 'general',
                data: data,
            },
            {
                id: 1,
                name: 'Finance',
                template: 'finance',
                req: false,
                hide: true,
                data: data,
                pl: true,
            },
            {
                id: 2,
                name: 'Stop',
                template: 'stop',
                req: false,
                hide: true,
                data: data,
                pl: false,
                length: data?.stops?.length ? data.stops.length : 0,
            },
            {
                id: 3,
                name: 'Comment',
                template: 'comment',
                hide: false,
                hasArrow: true,
                data: data,
                pl: false,
                length: data?.comments?.length ? data.commentsCount : 0,
            },
        ];
    }
    /**Function retrun id */
    public identity(index: number, item: any): number {
        return index;
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
