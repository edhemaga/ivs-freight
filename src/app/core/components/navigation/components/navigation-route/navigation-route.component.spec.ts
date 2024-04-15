import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationRouteComponent } from '@core/components/navigation/components/navigation-route/navigation-route.component';

describe('NavigationItemComponent', () => {
    let component: NavigationRouteComponent;
    let fixture: ComponentFixture<NavigationRouteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavigationRouteComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationRouteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
