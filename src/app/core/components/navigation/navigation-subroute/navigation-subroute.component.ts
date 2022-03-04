import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Navigation } from '@angular/router';
import { NavigationSubRoute } from '../model/navigation.model';

interface Subroute {
  routeId: number;
  routes: [];
}

@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent {

  @Output() subrouteEvent = new EventEmitter<Subroute>();

  @Input() subroute: Subroute;

  @Input() mode: string = null;

  public identifySubroute(index: number, item: Subroute): number {
    return item.routeId;
  }

  public isSubrouteActive(subroute: Subroute) {
    console.log(subroute)
    this.subrouteEvent.emit(subroute);
  }
}
