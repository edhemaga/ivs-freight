import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableStatusComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-status/dispatch-table-status.component';

describe('DispatchTableStatusComponent', () => {
    let component: DispatchTableStatusComponent;
    let fixture: ComponentFixture<DispatchTableStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableStatusComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchTableStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
