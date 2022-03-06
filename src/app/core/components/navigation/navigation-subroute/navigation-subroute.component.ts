import { Navigation, NavigationSubRoute } from './../model/navigation.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-subroute',
  templateUrl: './navigation-subroute.component.html',
  styleUrls: ['./navigation-subroute.component.scss'],
})
export class NavigationSubrouteComponent {
  @Input() subroute: Navigation;
  @Input() isSubrouteHeaderActive: boolean = false;
  public isSubrouteActive: boolean = false;

  constructor(private router: Router) {}

  public identifySubroute(index: number, item: NavigationSubRoute): string {
    return item.name;
  }

  public isActiveRouteOnReload(route: string): boolean {
    if(this.router.url.includes(route)) {
      this.isSubrouteActive = true;
      return this.router.url.includes(route)
    }
    else {
      this.isSubrouteActive = false;
      return false;
    }
  }

}
