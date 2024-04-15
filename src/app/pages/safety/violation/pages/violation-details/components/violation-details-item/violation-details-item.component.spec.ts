import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationDetailsItemComponent } from '@pages/safety/violation/pages/violation-details/components/violation-details-item/violation-details-item.component';

describe('ViolationDetailsItemComponent', () => {
    let component: ViolationDetailsItemComponent;
    let fixture: ComponentFixture<ViolationDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ViolationDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViolationDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
