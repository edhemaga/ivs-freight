import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTabelOffDutyLocationComponent } from '@shared/components/ta-modal-table/components/ta-modal-tabel-off-duty-location/ta-modal-tabel-off-duty-location.component';

describe('TaModalTabelOffDutyLocationComponent', () => {
    let component: TaModalTabelOffDutyLocationComponent;
    let fixture: ComponentFixture<TaModalTabelOffDutyLocationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTabelOffDutyLocationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTabelOffDutyLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
