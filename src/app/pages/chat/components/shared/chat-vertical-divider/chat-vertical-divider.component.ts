import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-chat-vertical-divider',
  templateUrl: './chat-vertical-divider.component.html',
  styleUrls: ['./chat-vertical-divider.component.scss']
})
export class ChatVerticalDividerComponent implements OnInit {

  @Input() public verticalOffset: number = 0;

  constructor() { }

  ngOnInit(): void { }

}
