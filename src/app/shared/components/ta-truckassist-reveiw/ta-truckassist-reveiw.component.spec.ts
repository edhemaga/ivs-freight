import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckassistReveiwComponent } from './ta-truckassist-reveiw.component';

describe('TaTruckassistReveiwComponent', () => {
    let component: TaTruckassistReveiwComponent;
    let fixture: ComponentFixture<TaTruckassistReveiwComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckassistReveiwComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTruckassistReveiwComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
