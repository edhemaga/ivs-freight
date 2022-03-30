import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon-new',
  templateUrl: './svg-icon-new.component.html',
  styleUrls: ['./svg-icon-new.component.scss']
})
export class SvgIconNewComponent implements OnInit {
  @Input() name: String;
  @Input() class: String;
  constructor() { }

  ngOnInit(): void {
  }

  get absUrl() {
    return window.location.href;
  }

}
