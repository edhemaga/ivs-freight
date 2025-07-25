/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsInsurancePolicyModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';

describe('SettingsInsurancePolicyModalComponent', () => {
    let component: SettingsInsurancePolicyModalComponent;
    let fixture: ComponentFixture<SettingsInsurancePolicyModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsInsurancePolicyModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            SettingsInsurancePolicyModalComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
