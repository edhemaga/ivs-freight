import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTablePreviousAddressesComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-previous-addresses/ta-modal-table-previous-addresses.component';

describe('TaModalTablePreviousAddressesComponent', () => {
    let component: TaModalTablePreviousAddressesComponent;
    let fixture: ComponentFixture<TaModalTablePreviousAddressesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTablePreviousAddressesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            TaModalTablePreviousAddressesComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
