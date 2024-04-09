import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import {
    PopulateLikeDislikeModel,
    TaLikeDislikeService,
} from './services/ta-like-dislike.service';
import { DetailsDataService } from '../../services/details-data.service';

// models
import { SendDataCard } from 'src/app/shared/models/card-models/send-data-card.model';

// enums
import { TableStringEnum } from 'src/app/shared/enums/table-string.enum';

@Component({
    selector: 'app-ta-like-dislike',
    templateUrl: './ta-like-dislike.component.html',
    styleUrls: ['./ta-like-dislike.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
    ],
})
export class TaLikeDislikeComponent implements OnInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();

    @Output() likesDislakes: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() taLikes: number;
    @Input() taDislikes: number;

    @Input() customClass: string = null;

    @Input() isCard: boolean = false;

    @Input() isTaLiked: boolean;
    @Input() isTaDisliked: boolean;

    public isLiked: boolean = false;
    public isDisliked: boolean = false;

    public numLikes: number = 0;
    public numDislikes: number = 0;

    constructor(
        private taLikeDislikeService: TaLikeDislikeService,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.taLikeDislikeService.populateLikeDislike$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: PopulateLikeDislikeModel) => {
                this.taLikes = data?.upRatingCount ? data.upRatingCount : 0;
                this.taDislikes = data?.downRatingCount
                    ? data.downRatingCount
                    : 0;
                this.isLiked = data?.currentCompanyUserRating === 1;
                this.isDisliked = data?.currentCompanyUserRating === -1;
            });
    }

    ngOnChanges(): void {
        this.numLikes = this.taLikes;
        this.numDislikes = this.taDislikes;
    }

    public onAction(type: string, event: PointerEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (this.isCard) {
            this.likesDislakes.emit({
                type: TableStringEnum.RATING,
                subType: type,
            });
        } else {
            if (type === TableStringEnum.LIKED) {
                this.isLiked = !this.isLiked;

                if (this.isDisliked) {
                    this.taDislikes--;
                    this.isDisliked = false;
                    this.DetailsDataService.changeRateStatus(
                        TableStringEnum.DISLIKE,
                        this.isDisliked
                    );
                }

                if (this.isLiked) {
                    this.taLikes++;
                } else {
                    this.taLikes--;
                }

                this.taLikeDislikeService.likeDislikeEvent({
                    action: type,
                    likeDislike: 1,
                });

                this.DetailsDataService.changeRateStatus(
                    TableStringEnum.LIKE,
                    this.isLiked
                );
            } else {
                this.isDisliked = !this.isDisliked;
                if (this.isLiked) {
                    this.taLikes--;
                    this.isLiked = false;
                    this.DetailsDataService.changeRateStatus(
                        TableStringEnum.LIKE,
                        this.isLiked
                    );
                }

                if (this.isDisliked) {
                    this.taDislikes++;
                } else {
                    this.taDislikes--;
                }

                this.taLikeDislikeService.likeDislikeEvent({
                    action: type,
                    likeDislike: -1,
                });

                this.DetailsDataService.changeRateStatus(
                    TableStringEnum.DISLIKE,
                    this.isDisliked
                );
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
