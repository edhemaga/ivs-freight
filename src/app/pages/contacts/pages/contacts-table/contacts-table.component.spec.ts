import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsTableComponent } from '@pages/contacts/pages/contacts-table/contacts-table.component';

describe('ContactsTableComponent', () => {
    let component: ContactsTableComponent;
    let fixture: ComponentFixture<ContactsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactsTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
