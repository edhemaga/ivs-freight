import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadModalComponent } from '@pages/new-load/components/new-load-modal/new-load-modal.component';

describe('NewLoadModalComponent', () => {
    let component: NewLoadModalComponent;
    let fixture: ComponentFixture<NewLoadModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewLoadModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewLoadModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
