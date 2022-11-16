import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCardViewComponent } from './load-card-view.component';

describe('LoadCardViewComponent', () => {
    let component: LoadCardViewComponent;
    let fixture: ComponentFixture<LoadCardViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadCardViewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadCardViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
