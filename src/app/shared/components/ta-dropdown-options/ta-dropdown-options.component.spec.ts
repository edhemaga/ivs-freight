import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaDropdownOptionsComponent } from '@shared/components/ta-dropdown-options/ta-dropdown-options.component';

describe('TaDropdownOptionsComponent', () => {
    let component: TaDropdownOptionsComponent;
    let fixture: ComponentFixture<TaDropdownOptionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaDropdownOptionsComponent],
        });
        fixture = TestBed.createComponent(TaDropdownOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
