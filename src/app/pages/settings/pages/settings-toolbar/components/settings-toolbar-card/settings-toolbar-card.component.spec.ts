/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsToolbarCardComponent } from '@pages/settings/pages/settings-toolbar/components/settings-toolbar-card/settings-toolbar-card.component';

describe('SettingsToolbarCardComponent', () => {
    let component: SettingsToolbarCardComponent;
    let fixture: ComponentFixture<SettingsToolbarCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsToolbarCardComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsToolbarCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
