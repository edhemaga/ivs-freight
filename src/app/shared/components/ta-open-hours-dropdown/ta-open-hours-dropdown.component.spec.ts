import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaOpenHoursDropdownComponent } from '@shared/components/ta-open-hours-dropdown/ta-open-hours-dropdown.component';

describe('TaOpenHoursDropdownComponent', () => {
    let component: TaOpenHoursDropdownComponent;
    let fixture: ComponentFixture<TaOpenHoursDropdownComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaOpenHoursDropdownComponent],
        });
        fixture = TestBed.createComponent(TaOpenHoursDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
