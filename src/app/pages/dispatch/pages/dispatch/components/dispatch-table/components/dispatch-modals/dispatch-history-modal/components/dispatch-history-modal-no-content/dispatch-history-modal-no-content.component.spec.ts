import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchHistoryModalNoContentComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/components/dispatch-history-modal-no-content/dispatch-history-modal-no-content.component';

describe('DispatchHistoryModalNoContentComponent', () => {
    let component: DispatchHistoryModalNoContentComponent;
    let fixture: ComponentFixture<DispatchHistoryModalNoContentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DispatchHistoryModalNoContentComponent],
        });
        fixture = TestBed.createComponent(
            DispatchHistoryModalNoContentComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
