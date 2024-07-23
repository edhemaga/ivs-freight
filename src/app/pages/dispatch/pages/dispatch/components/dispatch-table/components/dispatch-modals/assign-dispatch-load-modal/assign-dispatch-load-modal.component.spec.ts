import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDispatchLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/assign-dispatch-load-modal/assign-dispatch-load-modal.component';

describe('AssignDispatchLoadModalComponent', () => {
    let component: AssignDispatchLoadModalComponent;
    let fixture: ComponentFixture<AssignDispatchLoadModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssignDispatchLoadModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AssignDispatchLoadModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
