/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFactoringComponent } from './settings-factoring.component';

describe('SettingsFactoringComponent', () => {
    let component: SettingsFactoringComponent;
    let fixture: ComponentFixture<SettingsFactoringComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsFactoringComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsFactoringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
