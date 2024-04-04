/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputComponent } from './ta-input.component';

describe('TaInputComponent', () => {
    let component: TaInputComponent;
    let fixture: ComponentFixture<TaInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaInputComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
