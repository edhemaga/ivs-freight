import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputDropdownContactsComponent } from '@shared/components/ta-input-dropdown-contacts/ta-input-dropdown-contacts.component';

describe('TaInputDropdownContactsComponent', () => {
    let component: TaInputDropdownContactsComponent;
    let fixture: ComponentFixture<TaInputDropdownContactsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaInputDropdownContactsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputDropdownContactsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
