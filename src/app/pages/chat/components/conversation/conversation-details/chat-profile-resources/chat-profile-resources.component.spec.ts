import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatProfileResourcesComponent } from '@pages/chat/components/conversation/conversation-details/chat-profile-resources/chat-profile-resources.component';

describe('ChatProfileResourcesComponent', () => {
    let component: ChatProfileResourcesComponent;
    let fixture: ComponentFixture<ChatProfileResourcesComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChatProfileResourcesComponent],
        });
        fixture = TestBed.createComponent(ChatProfileResourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
