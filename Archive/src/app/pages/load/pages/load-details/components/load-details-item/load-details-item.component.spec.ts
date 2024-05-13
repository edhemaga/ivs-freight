import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsItemComponent } from '@pages/load/pages/load-details/components/load-details-item/load-details-item.component';

describe('LoadDetailsItemComponent', () => {
    let component: LoadDetailsItemComponent;
    let fixture: ComponentFixture<LoadDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
