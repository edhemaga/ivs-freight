/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCardComponent } from '@pages/settings/components/settings-card/settings-card.component';

describe('SettingsCardComponent', () => {
    let component: SettingsCardComponent;
    let fixture: ComponentFixture<SettingsCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsCardComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
