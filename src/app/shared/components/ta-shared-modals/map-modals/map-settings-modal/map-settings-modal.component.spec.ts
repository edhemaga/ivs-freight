/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSettingsModalComponent } from '@shared/components/ta-shared-modals/map-modals/map-settings-modal/map-settings-modal.component';

describe('MapSettingsModalComponent', () => {
    let component: MapSettingsModalComponent;
    let fixture: ComponentFixture<MapSettingsModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MapSettingsModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapSettingsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
