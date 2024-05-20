import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTableRepairComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-repair/ta-modal-table-repair.component';

describe('TaModalTableRepairComponent', () => {
    let component: TaModalTableRepairComponent;
    let fixture: ComponentFixture<TaModalTableRepairComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTableRepairComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTableRepairComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
