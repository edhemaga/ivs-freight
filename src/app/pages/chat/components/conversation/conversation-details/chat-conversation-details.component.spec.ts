import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConversationDetailsComponent } from '@pages/chat/components/conversation/conversation-details/chat-conversation-details.component';

describe('ChatConversationDetailsComponent', () => {
    let component: ChatConversationDetailsComponent;
    let fixture: ComponentFixture<ChatConversationDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChatConversationDetailsComponent],
        });
        fixture = TestBed.createComponent(ChatConversationDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
