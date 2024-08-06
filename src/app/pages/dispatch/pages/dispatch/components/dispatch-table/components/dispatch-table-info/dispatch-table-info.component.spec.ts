import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableInfoComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-info/dispatch-table-info.component';

describe('DispatchTableAddNewComponent', () => {
    let component: DispatchTableInfoComponent;
    let fixture: ComponentFixture<DispatchTableInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchTableInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
