/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFactoringModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-factoring-modal/settings-factoring-modal.component';

describe('SettingsFactoringModalComponent', () => {
    let component: SettingsFactoringModalComponent;
    let fixture: ComponentFixture<SettingsFactoringModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsFactoringModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsFactoringModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
