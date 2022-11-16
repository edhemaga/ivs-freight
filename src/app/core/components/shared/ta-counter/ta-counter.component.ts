import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ta-counter',
  templateUrl: './ta-counter.component.html',
  styleUrls: ['./ta-counter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaCounterComponent {

  @Input() count: number = 0;
  @Input() countColor: string = '#6C6C6C';
  @Input() countBackground: string = '#F7F7F7';
  @Input() countFontWeight: number = 800;
  @Input() countHeight: string = '22px';
  @Input() countWidth: string = '22px';
  @Input() countBorderRadius: string = '2px';
  @Input() countTextBottomPosition: string = '0px';
}
