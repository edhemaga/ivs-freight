import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAssignLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/dispatch-assign-load-modal.component';

describe('DispatchAssignLoadModalComponent', () => {
    let component: DispatchAssignLoadModalComponent;
    let fixture: ComponentFixture<DispatchAssignLoadModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchAssignLoadModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchAssignLoadModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
