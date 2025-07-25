/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

describe('TaCheckboxComponent', () => {
    let component: TaCheckboxComponent;
    let fixture: ComponentFixture<TaCheckboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCheckboxComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
