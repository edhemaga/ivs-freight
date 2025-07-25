/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsOfficeModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/settings-office-modal.component';

describe('SettingsOfficeModalComponent', () => {
    let component: SettingsOfficeModalComponent;
    let fixture: ComponentFixture<SettingsOfficeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsOfficeModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsOfficeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
