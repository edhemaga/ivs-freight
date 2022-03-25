import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-settings-toollbar-card',
  templateUrl: './settings-toollbar-card.component.html',
  styleUrls: ['./settings-toollbar-card.component.scss'],
})
export class SettingsToollbarCardComponent implements OnInit, OnDestroy {
  @Input() cardId: number;
  @Input() cardName: string;
  @Input() cardCount: number;
  @Input() cardSvg: boolean;
  @Input() cardBackground: boolean;
  @Input() route: string;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private router: Router) {}

  public routeColor = {
    color: '#919191',
    background: '#F3F3F3',
  };

  // TODO: ON RELOAD
  ngOnInit(): void {
    this.onReloadRoute(window.location.pathname);

    this.router.events
      .pipe(
        filter((route) => route instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((route: NavigationEnd) => {
        if (this.route?.includes(route.urlAfterRedirects)) {
          this.routeColor = {
            color: '#ffffff',
            background: '#AAAAAA',
          };
        } else {
          this.routeColor = {
            color: '#919191',
            background: '#F3F3F3',
          };
        }
      });
  }

  private onReloadRoute(reload_route: any) {
    if (reload_route.includes(this.route)) {
      this.routeColor = {
        color: '#ffffff',
        background: '#AAAAAA',
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
