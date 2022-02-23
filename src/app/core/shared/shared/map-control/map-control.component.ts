import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {RoutingFullscreenService} from 'src/app/core/services/routing-fullscreen.service';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.scss'],
})
export class MapControlComponent implements OnInit {
  fullscreenActive: boolean;
  @Output() mapMode: EventEmitter<any> = new EventEmitter();
  @Output() zoom: EventEmitter<any> = new EventEmitter();
  @Input() isFullScreen: boolean;
  @Input() fullscreenOnly: boolean;

  constructor(private mapModeServise: RoutingFullscreenService) {
  }

  ngOnInit(): void {
    if (this.isFullScreen) {
      this.fullscreenActive = true;
      this.mapModeServise.toggleFullScreenMap(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullscreenActive) {
        this.fullscreenActive = false;
        this.fullscreenOnly
          ? this.mapModeServise.fullScreenSpecial(false)
          : this.mapModeServise.toggleFullScreenMap(false);
      }
    }
  }

  onFullScreen() {
    this.fullscreenActive = !this.fullscreenActive;
    this.fullscreenOnly
      ? this.mapModeServise.fullScreenSpecial(this.fullscreenActive)
      : this.mapModeServise.toggleFullScreenMap(this.fullscreenActive);
    this.mapMode.emit(this.fullscreenActive);
  }

  onZoom(isZoom: boolean) {
    this.zoom.emit(isZoom);
  }
}
