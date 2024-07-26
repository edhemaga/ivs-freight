import { Component, OnInit } from '@angular/core';

// Routes
import { ChatPngRoutes } from '@pages/chat/utils/constants/chat-png-routes.constants';

@Component({
  selector: 'app-messages-not-selected',
  templateUrl: './messages-not-selected.component.html',
  styleUrls: ['./messages-not-selected.component.scss']
})
export class MessagesNotSelectedComponent implements OnInit {

  public ChatPngRoutes = ChatPngRoutes;

  constructor() { }

  ngOnInit(): void {
  }

}
