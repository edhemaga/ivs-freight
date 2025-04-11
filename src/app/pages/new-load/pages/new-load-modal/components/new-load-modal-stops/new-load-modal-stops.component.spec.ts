import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadModalStopsComponent } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/new-load-modal-stops.component';

describe('NewLoadModalStopsComponent', () => {
    let component: NewLoadModalStopsComponent;
    let fixture: ComponentFixture<NewLoadModalStopsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewLoadModalStopsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewLoadModalStopsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
