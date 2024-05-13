/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsOfficeComponent } from '@pages/settings/pages/settings-location/components/settings-office/settings-office.component';

describe('SettingsOfficeComponent', () => {
    let component: SettingsOfficeComponent;
    let fixture: ComponentFixture<SettingsOfficeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsOfficeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsOfficeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
