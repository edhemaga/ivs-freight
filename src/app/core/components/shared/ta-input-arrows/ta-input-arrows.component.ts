import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ta-input-arrows',
  templateUrl: './ta-input-arrows.component.html',
  styleUrls: ['./ta-input-arrows.component.scss'],
})
export class TaInputArrowsComponent implements OnInit {
  @Input() name: string;
  @Input() counter: number;

  @Output() counterEmmiter = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  public valueEmmiter(action: string) {
    if (action === 'increment') {
      this.counter = this.counter + 1;
    } else {
      if (this.counter === 0) {
        return;
      }
      this.counter = this.counter - 1;
    }

    this.counterEmmiter.emit(this.counter);
  }
}
