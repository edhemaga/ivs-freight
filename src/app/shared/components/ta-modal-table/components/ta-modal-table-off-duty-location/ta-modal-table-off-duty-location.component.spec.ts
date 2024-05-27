import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableOffDutyLocationComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-off-duty-location/ta-modal-table-off-duty-location.component';

describe('TaModalTableOffDutyLocationComponent', () => {
    let component: TaModalTableOffDutyLocationComponent;
    let fixture: ComponentFixture<TaModalTableOffDutyLocationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTableOffDutyLocationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTableOffDutyLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
