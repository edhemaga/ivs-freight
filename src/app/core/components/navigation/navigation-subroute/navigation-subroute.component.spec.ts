import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSubrouteComponent } from './navigation-subroute.component';

describe('NavigationSubrouteComponent', () => {
    let component: NavigationSubrouteComponent;
    let fixture: ComponentFixture<NavigationSubrouteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavigationSubrouteComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationSubrouteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
