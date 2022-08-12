import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss', '../truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnChanges, OnDestroy {

  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;
  @Input() columns: any[];
  @Input() tableContainerWidth: number;
  listName: string = '';
  mapSettingsPopup: any;
  mapSettingsPopupOpen: boolean = false;
  addRoutePopup: any;
  addRoutePopupOpen: boolean = false;
  tableLocked: boolean = true;
  optionsPopupContent: any[] = [
    {
      text: 'Unlock table',
      svgPath: 'assets/svg/truckassist-table/lock.svg',
      width: 14,
      height: 16,
    },
    {
      text: 'Import',
      svgPath: 'assets/svg/truckassist-table/import.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Export',
      svgPath: 'assets/svg/truckassist-table/export.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Reset Columns',
      svgPath: 'assets/svg/truckassist-table/new-reset-icon.svg',
      width: 16,
      height: 16,
    },
    {
      text: 'Columns',
      svgPath: 'assets/svg/truckassist-table/columns.svg',
      width: 16,
      height: 16,
      active: false,
      additionalDropIcon: {
        path: 'assets/svg/truckassist-table/arrow-columns-drop.svg',
        width: 6,
        height: 8,
      },
    },
  ];
  tableRowsSelected: any[] = [];
  activeTableData: any = {};
  toolbarWidth: string = '';
  maxToolbarWidth: number = 0;
  inactiveTimeOutInterval: any;
  timeOutToaggleColumn: any;

  distanceTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'Miles',
    },
    {
      id: 2,
      name: 'Km',
    }
  ];

  addressTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'City',
    },
    {
      id: 2,
      name: 'Address',
    }
  ];

  borderTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'Open Border',
    },
    {
      id: 2,
      name: 'Closed Border',
    }
  ];

  routeTabs: { id: number; name: string }[] = [
    {
      id: 1,
      name: 'Practical',
    },
    {
      id: 2,
      name: 'Shortest',
    },
    {
      id: 3,
      name: 'Cheapest',
    }
  ];

  mapForm!: FormGroup;
  routeForm!: FormGroup;

  truckType: any[] = [
    {
      'id': 1,
      'name': '357940',
      'folder': "common",
      'logoName': "ic_truck_semi-truck.svg",
      'subFolder': "trucks"
    },
    {
      'id': 2,
      'name': '451367',
      'folder': "common",
      'logoName': "ic_truck_box-truck.svg",
      'subFolder': "trucks"
    },
    {
      'id': 3,
      'name': '256824',
      'folder': "common",
      'logoName': "ic_truck_tow-truck.svg",
      'subFolder': "trucks"
    }
  ];
  selectedTruckType: any = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.mapForm = this.formBuilder.group({
      mapName: ''
    });

    this.mapForm.valueChanges.subscribe((changes) => {
      //if ( this.searchData ) this.searchData.emit(changes.search);
    });

    this.routeForm = this.formBuilder.group({
      routeName: '',
      truckId: '',
      duration: false,
      durationTime: null,
      fuelCost: false,
      fuelMpg: null,
      fuelPrice: null,
      routeType: 'Practical'
    });

    this.routeForm.valueChanges.subscribe((changes) => {
      //if ( this.searchData ) this.searchData.emit(changes.search);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.options?.firstChange && changes?.options) {
      this.options = changes.options.currentValue;
    }

    if (!changes?.tableData?.firstChange && changes?.tableData) {
      this.tableData = changes.tableData.currentValue;

      this.getSelectedTabTableData();
    }

    if (changes?.selectedTab) {
      this.selectedTab = changes.selectedTab.currentValue;

      const td = this.tableData.find((t) => t.field === this.selectedTab);

      this.listName = td.gridNameTitle;
    }
  }

  ngOnDestroy(): void {}

  getSelectedTabTableData() {
    if (this.tableData.length) {
      this.activeTableData = this.tableData.find(
        (t) => t.field === this.selectedTab
      );
    }
  }

  onSelectTab(selectedTabData: any) {
    this.toolBarAction.emit({
      action: 'tab-selected',
      tabData: selectedTabData,
    });
  }

  onToolBarAction(actionType: string) {
    // var formToSend = this.mapForm;
    // if ( actionType == '' ) {
    //   var formToSend = this.routeForm;
    // }

    this.toolBarAction.emit({
      action: actionType,
      data: this.routeForm
    });

    this.addRoutePopup.close();
    this.routeForm.reset();

    this.onTabChange(this.routeTabs[0], 'Distance-tab');
    
    this.ref.detectChanges();
  }

  changeModeView(modeView: string) {
    this.toolBarAction.emit({
      action: 'view-mode',
      mode: modeView,
    });
  }

  onShowMapSettings(mapSettingsPopup: any) {
    this.mapSettingsPopup = mapSettingsPopup;

    if (mapSettingsPopup.isOpen()) {
      mapSettingsPopup.close();
    } else {
      mapSettingsPopup.open({});
    }

    this.mapSettingsPopupOpen = mapSettingsPopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  onShowRoutePopover(addRoutePopup: any) {
    this.addRoutePopup = addRoutePopup;
    console.log('addRoutePopup', addRoutePopup);

    if (addRoutePopup.isOpen()) {
      addRoutePopup.close();
    } else {
      addRoutePopup.open({});
    }

    this.addRoutePopupOpen = addRoutePopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  public onTabChange(event: any, type: string): void {
    // switch (type) {
    //   case InputSwitchActions.DOCUMENTS_BOX:
    //     this.selectedDocumentsTab = event.id;

    //     break;
    //   case InputSwitchActions.REQUESTS_BOX:
    //     this.selectedRequestsTab = event.id;

    //     if (this.selectedRequestsTab === 1) {
    //       this.isDocumentsCardOpen = true;
    //     }

    //     break;
    //   default:
    //     break;
    // }

    this.routeForm.get('routeType').setValue(event.name);

    console.log('onTabChange', event, type);
  }

  public onSelectDropdown(event: any, action: string, index?: number) {
    console.log('onSelectDropdown', event, action);

    // switch (action) {
    //   case 'truck': {
    //     this.selectedTruckType = event;
    //     break;
    //   }
    //   case 'fuel': {
    //     this.selectedFuelStop = event;
    //     break;
    //   }
    //   case 'store': {
    //     this.selectedStoreType = event;
    //     break;
    //   }
    //   case 'fuel-items': {
    //     this.selectedFuelItemsFormArray[index] = event;
    //     break;
    //   }
    //   default: {
    //     break;
    //   }
    // }
  }

  public openCloseCheckboxCard(event: any) {
    if (!this.routeForm.get('duration').value) {
      event.preventDefault();
      event.stopPropagation();
      this.routeForm.get('duration').setValue(true);
    }
  }

  public openCloseCheckboxCardFuel(event: any) {
    if (!this.routeForm.get('fuelCost').value) {
      event.preventDefault();
      event.stopPropagation();
      this.routeForm.get('fuelCost').setValue(true);
    }
  }
  
}
