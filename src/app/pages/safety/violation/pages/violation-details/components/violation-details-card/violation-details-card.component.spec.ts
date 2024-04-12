import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationDetailsCardComponent } from '@pages/safety/violation/pages/violation-details/components/violation-details-card/violation-details-card.component';

describe('ViolationDetailsCardComponent', () => {
    let component: ViolationDetailsCardComponent;
    let fixture: ComponentFixture<ViolationDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ViolationDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViolationDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
