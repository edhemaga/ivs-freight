import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-no-data',
  templateUrl: './chat-no-data.component.html',
  styleUrls: ['./chat-no-data.component.scss']
})
export class ChatNoDataComponent implements OnInit {

  @Input() message: string;
  constructor() { }

  ngOnInit(): void {
  }

}
