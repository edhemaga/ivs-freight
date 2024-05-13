import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaNoticeOfAsignmentComponent } from '@shared/components/ta-notice-of-asignment/ta-notice-of-asignment.component';

describe('TaNoticeOfAsignmentComponent', () => {
    let component: TaNoticeOfAsignmentComponent;
    let fixture: ComponentFixture<TaNoticeOfAsignmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaNoticeOfAsignmentComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaNoticeOfAsignmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
