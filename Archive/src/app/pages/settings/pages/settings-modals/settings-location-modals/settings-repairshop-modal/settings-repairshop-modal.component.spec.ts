/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRepairshopModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-repairshop-modal/settings-repairshop-modal.component';

describe('SettingsRepairshopModalComponent', () => {
    let component: SettingsRepairshopModalComponent;
    let fixture: ComponentFixture<SettingsRepairshopModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsRepairshopModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsRepairshopModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
