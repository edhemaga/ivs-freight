/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDrugAlcoholTestModalComponent } from '@pages/driver/pages/driver-modals/driver-drug-alcohol-test-modal/driver-drug-alcohol-test-modal.component';

describe('DriverDrugAlcoholTestModalComponent', () => {
    let component: DriverDrugAlcoholTestModalComponent;
    let fixture: ComponentFixture<DriverDrugAlcoholTestModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DriverDrugAlcoholTestModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverDrugAlcoholTestModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
