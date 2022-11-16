import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistTableBodyComponent } from './truckassist-table-body.component';

describe('TruckassistTableBodyComponent', () => {
    let component: TruckassistTableBodyComponent;
    let fixture: ComponentFixture<TruckassistTableBodyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TruckassistTableBodyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TruckassistTableBodyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
