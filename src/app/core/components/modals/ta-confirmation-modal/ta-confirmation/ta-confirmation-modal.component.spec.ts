/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaConfirmationModalComponent } from './ta-confirmation-modal.component';

describe('TaConfirmationModalComponent', () => {
    let component: TaConfirmationModalComponent;
    let fixture: ComponentFixture<TaConfirmationModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaConfirmationModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaConfirmationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
