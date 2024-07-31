import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadShortDetailsComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/components/load-short-details/load-short-details.component';

describe('LoadShortDetailsComponent', () => {
    let component: LoadShortDetailsComponent;
    let fixture: ComponentFixture<LoadShortDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadShortDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadShortDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
