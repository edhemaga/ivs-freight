import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as AppConst from 'src/app/const';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MapsService } from 'src/app/core/services/shared/maps.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss', '../../../../../assets/scss/maps.scss']
})
export class MapsComponent implements OnInit {

  @Input() viewData: any[] = [];
  @Input() mapType: string = 'shipper';
  @Input() dropdownActions: any[] = [];
  @Output() callDropDownAction: EventEmitter<any> = new EventEmitter();

  public agmMap: any;
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  public searchForm!: FormGroup;
  public locationForm!: FormGroup;
  public sortTypes: any[] = [];
  public sortDirection: string = 'asc';
  public activeSortType: any = {};
  public markerSelected: boolean = false;
  public mapLatitude: number = 41.860119;
  public mapLongitude: number = -87.660156;
  public sortBy: any;
  public searchValue: string = '';
  public mapMarkers: any[] = [];
  public mapCircle: any = {
    lat: 41.860119,
    lng: -87.660156,
    radius: 160934.4 // 100 miles
  };
  public locationFilterOn: boolean = false;
  private tooltip: any;
  public locationRange: any = 100;

  public markerAnimations: any = {};
  public showMarkerWindow: any = {};
  public dropDownActive: number = -1;
  public mapZoom: number = 1;
  public mapCenter: any = {
    lat: 41.860119,
    lng: -87.660156,
  }

  public routeColors: any[] = [
    '#8A9AEF',
    '#FDB46B',
    '#F27B8E',
    '#6DC089',
    '#A574C3',
    '#73D0F1',
    '#F69FF3',
    '#A1887F'
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private mapsService: MapsService
    ) { }

  ngOnInit(): void {
    this.showHideMarkers();
    this.markersDropAnimation();
  }

  public getMapInstance(map) {
    this.agmMap = map;
    console.log('getMapInstance', this.agmMap);
  }

  clickedMarker(id) {
    this.viewData.map((data: any, index) => {
      if (data.isExpanded) {
        data.isExpanded = false;
      }

      if (data.isSelected && data.id != id) {
        data.isSelected = false;
      }
      else if ( data.id == id ) {
        data.isSelected = !data.isSelected;

        if ( data.isSelected ) {
          this.markerSelected = true;
          this.mapLatitude = data.latitude;
          this.mapLongitude = data.longitude;
        }
        else {
          this.markerSelected = false;
        }

        document.querySelectorAll('.si-float-wrapper').forEach((parentElement: HTMLElement) => {
          parentElement.style.zIndex = '998';
  
          setTimeout(() => { 
            var childElements = parentElement.querySelectorAll('.show-marker-dropdown');
            if ( childElements.length ) parentElement.style.zIndex = '999';
          }, 1);
        });
      }
    });

      // this.mapMarkers.map((data: any, index) => {
      //   if (data.isExpanded) {
      //     data.isExpanded = false;
      //   }
  
      //   if (data.isSelected && data.id != id) {
      //     data.isSelected = false;
      //   }
      //   else if ( data.id == id ) {
      //     data.isSelected = !data.isSelected;
  
      //     if ( data.isSelected ) {
      //       this.markerSelected = true;
      //       this.mapLatitude = data.latitude;
      //       this.mapLongitude = data.longitude;
      //     }
      //     else {
      //       this.markerSelected = false;
      //     }
  
      //     document.querySelectorAll('.si-float-wrapper').forEach((parentElement: HTMLElement) => {
      //         parentElement.style.zIndex = '998';
  
      //         var shadowElement = parentElement.querySelectorAll<HTMLElement>(".si-content")[0];
      //         shadowElement.classList.remove("marker-tooltip-shadow");
  
      //         setTimeout(() => { 
      //           var childElements = parentElement.querySelectorAll('.show-marker-dropdown');
      //           if ( childElements.length ) {
                  
      //             setTimeout(() => { 
      //               shadowElement.classList.add("marker-tooltip-shadow");
      //             }, 150);
  
      //             parentElement.style.zIndex = '999';
      //           }
      //         }, 1);
      //     });
          
      //     data.markerAnimation = 'BOUNCE';
  
      //     setTimeout(function() {
      //       data.markerAnimation = 'none';
      //     }, 500);
      //   }
      // });
  }

  mapClick(event) {
    this.viewData.map((data: any, index) => {
      if (data.isSelected) {
        data.isSelected = false;
      }
    });

    console.log('mapClick event', event);
    
    var shadowElements = document.getElementsByClassName("marker-tooltip-shadow");
    if ( shadowElements.length ) shadowElements[0].classList.remove("marker-tooltip-shadow");
  }

  markersDropAnimation() {
    var mainthis = this;

      setTimeout(() => {
        this.viewData.map((data: any) => {
          if ( !mainthis.markerAnimations[data.id] ) {
            mainthis.markerAnimations[data.id] = true;
          }
        });
          
        setTimeout(() => {
          this.viewData.map((data: any) => {
            if ( !mainthis.showMarkerWindow[data.id] ) {
              mainthis.showMarkerWindow[data.id] = true;
            }
          });
        }, 100);
      }, 1000);
  }

  zoomChange(event){
    this.mapZoom = event;
  }

  markerZoom(e, item) {
    if(e.wheelDeltaY > 0) {
      // The user scrolled up.
      this.zoomChange(this.mapZoom+1);

      this.mapLatitude = item.latitude;
      this.mapLongitude = item.longitude;
      console.log('markerZoom item', item);
      console.log('markerZoom mapLatitude', this.mapLatitude);
      console.log('markerZoom mapLongitude', this.mapLongitude);
    } else {
      // The user scrolled down.
      this.zoomChange(this.mapZoom-1);
    }
  }

  showHideMarkers(){
    this.viewData.map((data: any) => {
      var getDistance = this.mapsService.getDistanceBetween(data.latitude,data.longitude,this.mapCircle.lat,this.mapCircle.lng);
      data.isShown = getDistance[0];
      data.distanceBetween = this.mapsService.getMiles(getDistance[1]).toFixed(1);
    });
  }

  dropDownActionCall(action) {
    this.callDropDownAction.emit(action);
  }

  setLocationRange(value) {
    this.mapCircle.radius = this.mapsService.getMeters(value);
    this.showHideMarkers();
    this.locationFilterOn = true;

    this.sortTypes[1].isHidden = false;
    this.ref.detectChanges();
  }

  clearLocationRange() {
    this.mapCircle.radius = this.mapsService.getMeters(100);
    this.showHideMarkers();
    this.locationFilterOn = false;

    this.sortTypes[1].isHidden = true;

    if ( this.activeSortType.name == 'Location' ) {
      this.activeSortType = this.sortTypes[0];
    }

    this.locationForm.reset();
    
    this.ref.detectChanges();
  }

  changeLocationRange(value) {
    this.locationRange = value;
  }

  setLocationFilter() {
    this.setLocationRange(this.locationRange);
    //this.closePopover();
  }

  clearLocationFilter() {
    this.locationRange = 100;
    this.clearLocationRange();
    //this.closePopover();
  }

}
