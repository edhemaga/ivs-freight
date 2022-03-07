import { NavigationSubRoutes } from './../model/navigation.model';
import { Router } from '@angular/router';
import { Navigation } from '../model/navigation.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { setTimeout } from 'timers';

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

  constructor(public router: Router) {}

  ngOnInit() {
    this.isActiveRouteOnReload(window.location.href);
  }


  public onRouteAction(flegId?: number) {
    this.onRouteEvent.emit({
      routeId: this.route.id,
      routes: this.route.route,
    });

    if (Array.isArray(this.route.route)) {
      if (this.route.isRouteActive) {
        const subroute = this.route.route.find(item => item.flegId === flegId)
        this.router.navigate([`${subroute.route}`]);
      }
    } else {
      this.router.navigate([`${this.route.route}`]);
    }
  }

  private isActiveRouteOnReload(url: string) {
    const urlString = url.split('/')
    const reloadUrl = urlString[urlString.length - 1]
  
    if(Array.isArray(this.route.route)) {
      const subroute = this.route.route.find(item => item.route.includes(reloadUrl))
      if(subroute) {
        if(this.route.id === subroute.flegId) {
          this.route.isRouteActive = true;
          this.onRouteAction(subroute.flegId)
        }
      }
    }

    if(this.route.route.includes(reloadUrl)) {
      this.route.isRouteActive = true;
      this.onRouteAction()
    }
  }
}
