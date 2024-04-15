/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';

describe('ContactsModalComponent', () => {
    let component: ContactsModalComponent;
    let fixture: ComponentFixture<ContactsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactsModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
