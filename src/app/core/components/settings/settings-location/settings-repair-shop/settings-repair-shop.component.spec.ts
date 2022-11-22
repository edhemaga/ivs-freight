/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRepairShopComponent } from './settings-repair-shop.component';

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
