import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchHistoryModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/dispatch-history-modal.component';

describe('DispatchHistoryModalComponent', () => {
    let component: DispatchHistoryModalComponent;
    let fixture: ComponentFixture<DispatchHistoryModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchHistoryModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DispatchHistoryModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
