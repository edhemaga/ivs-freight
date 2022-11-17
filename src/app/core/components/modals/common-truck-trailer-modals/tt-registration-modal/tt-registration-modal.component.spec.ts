/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtRegistrationModalComponent } from './tt-registration-modal.component';

describe('TtRegistrationModalComponent', () => {
    let component: TtRegistrationModalComponent;
    let fixture: ComponentFixture<TtRegistrationModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TtRegistrationModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TtRegistrationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
