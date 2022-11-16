/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TaInputRadiobuttonsComponent } from './ta-input-radiobuttons.component';

describe('TaInputRadiobuttonsComponent', () => {
    let component: TaInputRadiobuttonsComponent;
    let fixture: ComponentFixture<TaInputRadiobuttonsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaInputRadiobuttonsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputRadiobuttonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
