import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';

describe('TaInputDropdownTableComponent', () => {
    let component: TaInputDropdownTableComponent;
    let fixture: ComponentFixture<TaInputDropdownTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaInputDropdownTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaInputDropdownTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
