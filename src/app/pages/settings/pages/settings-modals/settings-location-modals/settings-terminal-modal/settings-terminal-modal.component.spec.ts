/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTerminalModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-terminal-modal/settings-terminal-modal.component';

describe('SettingsTerminalModalComponent', () => {
    let component: SettingsTerminalModalComponent;
    let fixture: ComponentFixture<SettingsTerminalModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsTerminalModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsTerminalModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
