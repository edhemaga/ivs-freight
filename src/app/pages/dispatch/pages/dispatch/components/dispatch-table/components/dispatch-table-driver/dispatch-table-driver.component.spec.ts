import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableDriverComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-driver/dispatch-table-driver.component';

describe('DispatchTableDriverComponent', () => {
    let component: DispatchTableDriverComponent;
    let fixture: ComponentFixture<DispatchTableDriverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableDriverComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DispatchTableDriverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
