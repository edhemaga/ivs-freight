/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapRouteModalComponent } from './map-route-modal.component';

describe('MapRouteModalComponent', () => {
    let component: MapRouteModalComponent;
    let fixture: ComponentFixture<MapRouteModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MapRouteModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapRouteModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
