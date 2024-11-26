import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Custom Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Models
import { ChartLegendProperty } from '@shared/models';

// Pipes
import { UnitPositionPipe, ThousandSeparatorPipe } from '@shared/pipes';

@Component({
  selector: 'app-ta-chart-legend',
  templateUrl: './ta-chart-legend.component.html',
  styleUrls: ['./ta-chart-legend.component.scss'],
  standalone: true,
  imports: [
    // Modules
    CommonModule,
    AngularSvgIconModule,
    ThousandSeparatorPipe,
    UnitPositionPipe
  ],
  providers: [ThousandSeparatorPipe]
})
export class TaChartLegendComponent {

  @Input() public title!: string;
  @Input() public data!: ChartLegendProperty[];
  @Input() public hasHighlightedBackground: boolean = false;

  constructor() { }
}
