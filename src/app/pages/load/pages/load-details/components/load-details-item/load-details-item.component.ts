import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// modules
import { SharedModule } from '@shared/shared.module';

// services
import { CommentsService } from '@shared/services/comments.service';

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
import { LoadDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/load-details-card.component';
import { ReviewComment } from '@shared/models/review-comment.model';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';

// models
import { UpdateCommentCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-load-details-item',
    templateUrl: './load-details-item.component.html',
    styleUrls: ['./load-details-item.component.scss'],
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
        LoadDetailsCardComponent,

        // pipes
        FormatCurrencyPipe,
        FormatDatePipe,
    ],
})
export class LoadDetailsItemComponent implements OnInit, OnChanges, OnDestroy {
    @Input() loadData: any;
    @Input() routeData: any;
    public comments: any[] = [];
    private destroy$ = new Subject<void>();
    public totalLegMiles: any;
    public totalLegTime: any;
    public status = null;
    public activePercntage: any;
    constructor(private commentsService: CommentsService) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.loadData.firstChange && changes.loadData.currentValue) {
            changes.loadData.currentValue[0].data;
            this.getActivePertange(
                changes?.loadData?.currentValue[0]?.data?.pendingPercentage
            );
        }
    }
    ngOnInit(): void {
        // this.getLegMilesLegTime(this.loadData[0].data);
        this.getActivePertange(this.loadData[0]?.data.pendingPercentage);
    }
    public getActivePertange(data: any) {
        this.activePercntage = data;
        if (this.activePercntage > 0 && this.activePercntage < 30) {
            this.status = {
                status: 'short',
                minPercentage: 0,
                maxPercentage: 33,
                colorFilled: '#E57373',
                colorEmpty: '#FFEBEE',
            };
        } else if (this.activePercntage > 30 && this.activePercntage < 60) {
            this.status = {
                status: 'medium',
                minPercentage: 33.1,
                maxPercentage: 66,
                colorFilled: '#FFB74D',
                colorEmpty: '#FFECD1',
            };
        } else if (this.activePercntage > 60 && this.activePercntage <= 100) {
            this.status = {
                status: 'long',
                minPercentage: 66.1,
                maxPercentage: 100,
                colorFilled: '#AAAAAA',
                colorEmpty: '#DADADA',
            };
        } else {
            this.status = null;
        }
    }

    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    changeCommentEvent(comments: ReviewComment) {
        switch (comments.action) {
            case 'delete': {
                this.deleteComment(comments);
                break;
            }
            case 'update': {
                this.updateComment(comments);
                break;
            }
            default: {
                break;
            }
        }
    }

    private deleteComment(comments: ReviewComment) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private updateComment(comments: ReviewComment) {
        this.comments = comments.sortData;

        const comment: UpdateCommentCommand = {
            id: comments.data.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    private formatLoadPickupDay(mod: any) {
        let day;
        let dayValue = 'days';
        if (mod < 0) {
            day = Math.abs(mod);
        } else if (mod == 1) {
            dayValue = 'day';
        } else {
            day = mod;
        }

        return day + ' ' + dayValue;
    }

    private formatLoadPickupTime(mod: any) {
        let hours;
        let hoursValue = 'hours';

        if (mod < 0) {
            hours = Math.abs(mod);
            hoursValue = 'hours ago';
        } else if (mod == 1) {
            hoursValue = 'hour';
        } else {
            hours = mod;
        }
        return hours + ' ' + hoursValue;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
