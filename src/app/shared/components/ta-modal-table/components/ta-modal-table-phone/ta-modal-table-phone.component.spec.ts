/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalTablePhoneComponent } from '@shared/components/ta-modal-table/components/ta-modal-table-phone/ta-modal-table-phone.component';

describe('TaModalTablePhoneComponent', () => {
    let component: TaModalTablePhoneComponent;
    let fixture: ComponentFixture<TaModalTablePhoneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaModalTablePhoneComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaModalTablePhoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
