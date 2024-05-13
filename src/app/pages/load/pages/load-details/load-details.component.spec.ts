import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsComponent } from '@pages/load/pages/load-details/load-details.component';

describe('LoadDetailsComponent', () => {
    let component: LoadDetailsComponent;
    let fixture: ComponentFixture<LoadDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
