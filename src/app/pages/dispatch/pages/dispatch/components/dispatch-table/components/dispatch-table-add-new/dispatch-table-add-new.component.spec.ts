import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTableAddNewComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-add-new/dispatch-table-add-new.component';

describe('DispatchTableAddNewComponent', () => {
    let component: DispatchTableAddNewComponent;
    let fixture: ComponentFixture<DispatchTableAddNewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTableAddNewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchTableAddNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
