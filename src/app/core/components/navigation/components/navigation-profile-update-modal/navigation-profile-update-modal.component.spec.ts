/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationProfileUpdateModalComponent } from '@core/components/navigation/components/navigation-profile-update-modal/navigation-profile-update-modal.component';

describe('NavigationProfileUpdateModalComponent', () => {
    let component: NavigationProfileUpdateModalComponent;
    let fixture: ComponentFixture<NavigationProfileUpdateModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavigationProfileUpdateModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            NavigationProfileUpdateModalComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
