import { NavigationSubRoutes } from './../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-route',
  templateUrl: './navigation-route.component.html',
  styleUrls: ['./navigation-route.component.scss'],
})
export class NavigationRouteComponent implements OnInit {
  @Input() route: Navigation;
  @Input() isNavigationHovered: boolean = false;
  @Input() isActiveSubroute: boolean = false;

  @Output() onRouteEvent = new EventEmitter<NavigationSubRoutes>();

  public isNavItemHovered: boolean = false;
  private timeout = null;

  constructor(public router: Router) {}

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.isActiveRouteOnReload(window.location.href);
      clearTimeout(this.timeout);
    }, 1000)
    
  }

  public onRouteAction() {
    localStorage.removeItem('subroute_active');
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route
    });
    
    if(!Array.isArray(this.route.route)) {
      this.router.navigate([`${this.route.route}`]);
    }
    // TODO: RADI KAD JE RELOAD, ALI DA LI RADI KAD SE KLIKNE ??
    // if (Array.isArray(this.route.route)) {
    //   if (this.route.isRouteActive) {
    //     if (!flegId) {
    //       flegId = JSON.parse(localStorage.getItem('route_flegId'));
    //     }
    //     const subroute = this.route.route.find(
    //       (item) => item.flegId === flegId
    //     );
    //     this.router.navigate([`${subroute?.route}`]);
    //   }
    // } else {
    //   this.router.navigate([`${this.route.route}`]);
    // }
  }

  public onReloadSubroute(flegId?: number) {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
      activeRouteFlegId: flegId
    });
  }

  private isActiveRouteOnReload(url: string) {
    const urlString = url.split('/');
    const reloadUrl = urlString[urlString.length - 1];

    const flegId = JSON.parse(localStorage.getItem('subroute_active'));

    if(flegId && this.route.id === flegId) {
        console.log("FROM ROUTING ", this.route)
        this.onReloadSubroute(flegId);
    }
    
    if (!Array.isArray(this.route.route) && this.route.route.includes(reloadUrl)) {
      this.onRouteAction();
    } 
    // else {
    //   const subroute = this.route.route.find((item) =>
    //     item.route.includes(reloadUrl)
    //   );
      // if (subroute) {
      //   if (this.route.id === subroute.activeRouteFlegId) {
      //     this.route.isRouteActive = true;
      //     this.isActiveSubroute = true;
      //     localStorage.removeItem('route_flegId');
      //     localStorage.setItem(
      //       'route_flegId',
      //       subroute.activeRouteFlegId.toString()
      //     );
      //     this.onRouteAction(subroute.activeRouteFlegId);
      //   }
      // }
   // }
  }
}
