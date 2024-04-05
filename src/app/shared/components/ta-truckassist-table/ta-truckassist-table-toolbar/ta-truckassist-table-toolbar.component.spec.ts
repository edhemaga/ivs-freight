import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckassistTableToolbarComponent } from './ta-truckassist-table-toolbar.component';

describe('TaTruckassistTableToolbarComponent', () => {
    let component: TaTruckassistTableToolbarComponent;
    let fixture: ComponentFixture<TaTruckassistTableToolbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckassistTableToolbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTruckassistTableToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
