/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsGeneralComponent } from '@pages/settings/pages/settings-company/components/settings-general/settings-general.component';

describe('SettingsGeneralComponent', () => {
    let component: SettingsGeneralComponent;
    let fixture: ComponentFixture<SettingsGeneralComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsGeneralComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsGeneralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
