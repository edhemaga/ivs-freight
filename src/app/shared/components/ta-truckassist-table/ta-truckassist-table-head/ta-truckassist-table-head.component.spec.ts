import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckassistTableHeadComponent } from './ta-truckassist-table-head.component';

describe('TaTruckassistTableHeadComponent', () => {
    let component: TaTruckassistTableHeadComponent;
    let fixture: ComponentFixture<TaTruckassistTableHeadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckassistTableHeadComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTruckassistTableHeadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
