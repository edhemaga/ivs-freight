import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckassistTableToolbarComponent } from './truckassist-table-toolbar.component';

describe('TruckassistTableToolbarComponent', () => {
    let component: TruckassistTableToolbarComponent;
    let fixture: ComponentFixture<TruckassistTableToolbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TruckassistTableToolbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TruckassistTableToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
