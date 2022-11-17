/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopModalComponent } from './fuel-stop-modal.component';

describe('FuelStopModalComponent', () => {
    let component: FuelStopModalComponent;
    let fixture: ComponentFixture<FuelStopModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FuelStopModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FuelStopModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
