import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';

// service
import {
    PopulateLikeDislikeModel,
    TaLikeDislikeService,
} from './ta-like-dislike.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';

// model
import { SendDataCard } from '../model/cardTableData';

// enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

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
export class TaLikeDislikeComponent implements OnInit, OnDestroy {
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
                type: ConstantStringTableComponentsEnum.RATING,
                subType: type,
            });
        } else {
            if (type === ConstantStringTableComponentsEnum.LIKED) {
                this.isLiked = !this.isLiked;

                if (this.isDisliked) {
                    this.taDislikes--;
                    this.isDisliked = false;
                    this.DetailsDataService.changeRateStatus(
                        ConstantStringTableComponentsEnum.DISLIKE,
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
                    ConstantStringTableComponentsEnum.LIKE,
                    this.isLiked
                );
            } else {
                this.isDisliked = !this.isDisliked;
                if (this.isLiked) {
                    this.taLikes--;
                    this.isLiked = false;
                    this.DetailsDataService.changeRateStatus(
                        ConstantStringTableComponentsEnum.LIKE,
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
                    ConstantStringTableComponentsEnum.DISLIKE,
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
