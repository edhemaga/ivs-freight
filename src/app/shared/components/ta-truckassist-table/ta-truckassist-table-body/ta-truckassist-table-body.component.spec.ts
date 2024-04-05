import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckassistTableBodyComponent } from './ta-truckassist-table-body.component';

describe('TaTruckassistTableBodyComponent', () => {
    let component: TaTruckassistTableBodyComponent;
    let fixture: ComponentFixture<TaTruckassistTableBodyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckassistTableBodyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTruckassistTableBodyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
