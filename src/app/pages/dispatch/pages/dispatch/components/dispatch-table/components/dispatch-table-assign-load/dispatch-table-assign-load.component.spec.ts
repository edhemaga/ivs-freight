import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableAssignLoadComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-assign-load/dispatch-table-assign-load.component';

describe('DispatchTableAssignLoadComponent', () => {
    let component: DispatchTableAssignLoadComponent;
    let fixture: ComponentFixture<DispatchTableAssignLoadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableAssignLoadComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchTableAssignLoadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
