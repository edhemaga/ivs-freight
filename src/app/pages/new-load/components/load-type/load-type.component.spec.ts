import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTypeComponent } from './load-type.component';

describe('LoadTypeRowComponent', () => {
    let component: LoadTypeComponent;
    let fixture: ComponentFixture<LoadTypeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadTypeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
