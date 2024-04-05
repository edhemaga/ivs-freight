import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckassistProgressExpirationComponent } from './ta-truckassist-progress-expiration.component';

describe('TaTruckassistProgressExpirationComponent', () => {
    let component: TaTruckassistProgressExpirationComponent;
    let fixture: ComponentFixture<TaTruckassistProgressExpirationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckassistProgressExpirationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaTruckassistProgressExpirationComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
