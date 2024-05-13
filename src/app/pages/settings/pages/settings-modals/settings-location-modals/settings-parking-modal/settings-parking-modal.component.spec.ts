/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsParkingModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/settings-parking-modal.component';

describe('SettingsParkingModalComponent', () => {
    let component: SettingsParkingModalComponent;
    let fixture: ComponentFixture<SettingsParkingModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsParkingModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsParkingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
