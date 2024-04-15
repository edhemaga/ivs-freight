/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoModalComponent } from '@pages/to-do/pages/to-do-modal/to-do-modal.component';

describe('TodoModalComponent', () => {
    let component: TodoModalComponent;
    let fixture: ComponentFixture<TodoModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TodoModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TodoModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
