import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  @Input() isBottomBorderDisplayed: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
