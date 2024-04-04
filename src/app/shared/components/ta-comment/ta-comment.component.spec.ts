import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCommentComponent } from './ta-comment.component';

describe('TaCommentComponent', () => {
    let component: TaCommentComponent;
    let fixture: ComponentFixture<TaCommentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCommentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaCommentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
