import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMapMarkerDropdownComponent } from './ta-map-marker-dropdown.component';

describe('TaMapMarkerDropdownComponent', () => {
    let component: TaMapMarkerDropdownComponent;
    let fixture: ComponentFixture<TaMapMarkerDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaMapMarkerDropdownComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaMapMarkerDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
