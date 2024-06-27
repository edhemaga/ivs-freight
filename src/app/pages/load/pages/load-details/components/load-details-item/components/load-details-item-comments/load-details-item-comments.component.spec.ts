import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemCommentsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-comments/load-details-item-comments.component';

describe('LoadDetailsItemCommentsComponent', () => {
    let component: LoadDetailsItemCommentsComponent;
    let fixture: ComponentFixture<LoadDetailsItemCommentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsItemCommentsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsItemCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
