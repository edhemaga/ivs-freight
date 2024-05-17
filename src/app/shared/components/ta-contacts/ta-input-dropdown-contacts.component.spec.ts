import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaContactsComponent } from '@shared/components/ta-contacts/ta-input-dropdown-contacts.component';

describe('TaReCardComponent', () => {
    let component: TaContactsComponent;
    let fixture: ComponentFixture<TaContactsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaContactsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaContactsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
