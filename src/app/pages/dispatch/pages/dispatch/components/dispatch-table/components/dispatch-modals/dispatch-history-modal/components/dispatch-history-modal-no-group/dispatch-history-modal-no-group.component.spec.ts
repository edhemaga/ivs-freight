import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchHistoryModalNoGroupComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/components/dispatch-history-modal-no-group/dispatch-history-modal-no-group.component';

describe('DispatchHistoryModalNoGroupComponent', () => {
    let component: DispatchHistoryModalNoGroupComponent;
    let fixture: ComponentFixture<DispatchHistoryModalNoGroupComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DispatchHistoryModalNoGroupComponent],
        });
        fixture = TestBed.createComponent(DispatchHistoryModalNoGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
