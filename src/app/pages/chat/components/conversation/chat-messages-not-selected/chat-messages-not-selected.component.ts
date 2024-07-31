import { Component, OnInit } from '@angular/core';

// Routes
import { ChatPngRoutes } from '@pages/chat/utils/routes/chat-png-routes';

@Component({
  selector: 'app-chat-messages-not-selected',
  templateUrl: './chat-messages-not-selected.component.html',
  styleUrls: ['./chat-messages-not-selected.component.scss']
})
export class ChatMessagesNotSelectedComponent implements OnInit {

  public ChatPngRoutes = ChatPngRoutes;

  constructor() { }

  ngOnInit(): void {
  }


}
