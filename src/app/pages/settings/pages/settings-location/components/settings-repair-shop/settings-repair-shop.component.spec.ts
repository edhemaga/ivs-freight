/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRepairShopComponent } from '@pages/settings/pages/settings-location/components/settings-repair-shop/settings-repair-shop.component';

describe('SettingsRepairShopComponent', () => {
    let component: SettingsRepairShopComponent;
    let fixture: ComponentFixture<SettingsRepairShopComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsRepairShopComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsRepairShopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
