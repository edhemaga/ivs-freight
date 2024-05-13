import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

describe('TaInputAddressDropdownComponent', () => {
    let component: TaInputAddressDropdownComponent;
    let fixture: ComponentFixture<TaInputAddressDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaInputAddressDropdownComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputAddressDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
