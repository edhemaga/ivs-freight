import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-routing-map',
  templateUrl: './routing-map.component.html',
  styleUrls: ['./routing-map.component.scss', '../../../../../assets/scss/maps.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoutingMapComponent implements OnInit {

  public routes: any[] = [
    {
      'name': 'Route 1',
      'hidden': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
        },
      ]
    },
    {
      'name': 'Route 2',
      'hidden': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
        },
      ]
    },
    {
      'name': 'Route 3',
      'hidden': false,
      'startPoint': {
        'address': 'Gary, IN 30055',
      },
      'stops': [
        {
          'address': 'Chicago, IL 65005',
          'leg': '60.6',
          'total': '60.6',
        },
        {
          'address': 'Philadelphia, PA 52320',
          'leg': '45.2',
          'total': '105.8',
        },
        {
          'address': 'Nashville, KE 89600',
          'leg': '168.8',
          'total': '273.1',
        },
      ]
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onTableBodyActions(action) {
    console.log('action', action);
  }

  drop(event: CdkDragDrop<string[]>, dropArray) {
    moveItemInArray(dropArray, event.previousIndex, event.currentIndex);

    console.log(dropArray, event.previousIndex, event.currentIndex);
  }

  showHideRoute(route) {
    route.hidden = !route.hidden;
  }
}
