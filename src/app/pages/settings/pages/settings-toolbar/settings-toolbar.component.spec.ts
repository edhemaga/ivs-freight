/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsToolbarComponent } from '@pages/settings/pages/settings-toolbar/settings-toolbar.component';

describe('SettingsToolbarComponent', () => {
    let component: SettingsToolbarComponent;
    let fixture: ComponentFixture<SettingsToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsToolbarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
