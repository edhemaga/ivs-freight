/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ReviewsRatingService } from './reviewsRating.service';

describe('Service: ReviewsRating', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ReviewsRatingService],
        });
    });

    it('should ...', inject(
        [ReviewsRatingService],
        (service: ReviewsRatingService) => {
            expect(service).toBeTruthy();
        }
    ));
});
