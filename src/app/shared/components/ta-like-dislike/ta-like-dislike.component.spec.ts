/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaLikeDislikeComponent } from '@shared/components/ta-like-dislike/ta-like-dislike.component';

describe('TaLikeDislikeComponent', () => {
    let component: TaLikeDislikeComponent;
    let fixture: ComponentFixture<TaLikeDislikeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaLikeDislikeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaLikeDislikeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
