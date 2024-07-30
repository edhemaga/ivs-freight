import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTruckTrailerIconComponent } from '@shared/components/ta-truck-trailer-icon/ta-truck-trailer-icon.component';

describe('TaTruckTrailerIconComponent', () => {
    let component: TaTruckTrailerIconComponent;
    let fixture: ComponentFixture<TaTruckTrailerIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTruckTrailerIconComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaTruckTrailerIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
