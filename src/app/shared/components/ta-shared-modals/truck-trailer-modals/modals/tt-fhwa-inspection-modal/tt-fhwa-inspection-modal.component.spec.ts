/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';

describe('TtFhwaInspectionModalComponent', () => {
    let component: TtFhwaInspectionModalComponent;
    let fixture: ComponentFixture<TtFhwaInspectionModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TtFhwaInspectionModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TtFhwaInspectionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
