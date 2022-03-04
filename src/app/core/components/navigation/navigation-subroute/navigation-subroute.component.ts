import { Navigation, NavigationSubRoute, NavigationSubRoutes } from './../model/navigation.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent {
  @Output() subrouteEvent = new EventEmitter<NavigationSubRoutes>();

  @Input() subroute: Navigation;

  @Input() mode: string = null;

  

  public identifySubroute(index: number, item: NavigationSubRoute): string {
    return item.name;
  }

  public isSubrouteActive() {
    this.subrouteEvent.emit({routeId: this.subroute.id, routes: this.subroute.route});
  }
}
