/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTerminalComponent } from '@pages/settings/pages/settings-location/components/settings-terminal/settings-terminal.component';

describe('SettingsTerminalComponent', () => {
    let component: SettingsTerminalComponent;
    let fixture: ComponentFixture<SettingsTerminalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsTerminalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsTerminalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
