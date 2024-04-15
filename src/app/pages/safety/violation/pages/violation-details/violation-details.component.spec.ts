import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationDetailsComponent } from '@pages/safety/violation/pages/violation-details/violation-details.component';

describe('ViolationDetailsPageComponent', () => {
    let component: ViolationDetailsComponent;
    let fixture: ComponentFixture<ViolationDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ViolationDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViolationDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
