import { Component, Input, OnInit } from '@angular/core';

// Models
import { AssignedLoadResponse } from 'appcoretruckassist';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';


@Component({
  selector: 'app-load-short-details',
  templateUrl: './load-short-details.component.html',
  styleUrls: ['./load-short-details.component.scss']
})
export class LoadShortDetailsComponent implements OnInit {
  @Input() load: AssignedLoadResponse;
  @Input() index: number;
  @Input() isAssigned: boolean;
  
  // Svg
  public svgIcons = DispatchParkingSvgRoutes;
  
  constructor() { }

  ngOnInit(): void {}
}
