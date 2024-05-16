import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTablePmComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-pm/ta-modal-table-pm.component';

describe('TaModalTablePmComponent', () => {
    let component: TaModalTablePmComponent;
    let fixture: ComponentFixture<TaModalTablePmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTablePmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTablePmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
