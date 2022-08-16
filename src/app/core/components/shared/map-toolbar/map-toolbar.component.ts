import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
@UntilDestroy()
@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss', '../truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('op') mapSettingsPopup: any;
  @ViewChild('op2') addRoutePopup: any;

  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;
  @Input() columns: any[];
  @Input() tableContainerWidth: number;
  @Input() stopPickerActive: boolean = false;
  listName: string = '';
  mapSettingsPopupOpen: boolean = false;
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

  distanceTabs: { id: number; name: string, checked: boolean }[] = [
    {
      id: 1,
      name: 'Miles',
      checked: false
    },
    {
      id: 2,
      name: 'Km',
      checked: false
    }
  ];

  addressTabs: { id: number; name: string, checked: boolean }[] = [
    {
      id: 1,
      name: 'City',
      checked: false
    },
    {
      id: 2,
      name: 'Address',
      checked: false
    }
  ];

  borderTabs: { id: number; name: string, checked: boolean }[] = [
    {
      id: 1,
      name: 'Open Border',
      checked: false
    },
    {
      id: 2,
      name: 'Closed Border',
      checked: false
    }
  ];

  routeTabs: { id: number; name: string, checked: boolean }[] = [
    {
      id: 1,
      name: 'Practical',
      checked: true
    },
    {
      id: 2,
      name: 'Shortest',
      checked: false
    },
    {
      id: 3,
      name: 'Cheapest',
      checked: false
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

  mapFormChanged: boolean = false;
  routeFormChanged: boolean = false;
  
  routeToEdit: any = {};
  
  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private inputService: TaInputService
  ) { }

  ngOnInit(): void {
    this.createMapForm();
    this.createRouteForm();

    this.onIncludeDuration();
    this.onIncludeFuelCost();
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

  createMapForm() {
    this.mapForm = this.formBuilder.group({
      mapName: [this.tableData[0].title, Validators.required],
      distanceUnit: this.tableData[0].distanceUnit,
      addressType: this.tableData[0].addressType,
      borderType: this.tableData[0].borderType
    });

    if ( this.tableData[0].distanceUnit == 'mi' ) {
      this.distanceTabs[0].checked = true;
    } else {
      this.distanceTabs[1].checked = true;
    }

    if ( this.tableData[0].addressType == 'city' ) {
      this.addressTabs[0].checked = true;
    } else {
      this.addressTabs[1].checked = true;
    }

    if ( this.tableData[0].borderType == 'open' ) {
      this.borderTabs[0].checked = false;
    } else {
      this.borderTabs[1].checked = false;
    }

    this.mapForm
      .valueChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe(
        (formChanges) => {
          console.log('mapForm formChanges', formChanges);
          if ( formChanges.mapName != this.tableData[0].title ||
            formChanges.distanceUnit != this.tableData[0].distanceUnit ||
            formChanges.addressType != this.tableData[0].addressType ||
            formChanges.borderType != this.tableData[0].borderType
          ) {
            this.mapFormChanged = true;
          } else {
            this.mapFormChanged = false;
          }
        }
      );
  }

  createRouteForm() {
    this.routeForm = this.formBuilder.group({
      routeName: [null, Validators.required],
      truckId: '',
      duration: false,
      durationTime: null,
      fuelCost: false,
      fuelMpg: null,
      fuelPrice: null,
      routeType: 'Practical'
    });

    this.routeForm
      .valueChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe(
        (formChanges) => {
          console.log('routeForm formChanges', formChanges);
          // if ( formChanges.mapName != this.tableData[0].title ||
          //   formChanges.distanceUnit != this.tableData[0].distanceUnit ||
          //   formChanges.addressType != this.tableData[0].addressType ||
          //   formChanges.borderType != this.tableData[0].borderType
          // ) {
          //   this.routeFormChanged = true;
          // } else {
          //   this.routeFormChanged = false;
          // }
        }
      );
  }

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
    var dataToSend;
    if ( actionType == 'add-route' || actionType == 'edit-route' ) {
      dataToSend = this.routeForm;

      if ( actionType == 'edit-route' ) {
        dataToSend = {
          'form': this.routeForm,
          'editId': this.routeToEdit.id
        }
      }
    } else if ( actionType == 'map-settings' ) {
      dataToSend = this.mapForm;
    } else {
      dataToSend = [];
    }

    this.toolBarAction.emit({
      action: actionType,
      data: dataToSend
    });

    this.addRoutePopup?.close();
    this.mapSettingsPopup?.close();
    this.resetRouteForm();
    this.resetMapForm();

    this.routeToEdit = {};
    
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

      this.resetMapForm();
    } else {
      mapSettingsPopup.open({});
    }

    if ( this.addRoutePopup && this.addRoutePopup.isOpen() ) {
      this.addRoutePopup.close();
      this.routeToEdit = {};
    }

    this.mapSettingsPopupOpen = mapSettingsPopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  onShowRoutePopover(addRoutePopup: any) {
    this.addRoutePopup = addRoutePopup;

    if (addRoutePopup.isOpen()) {
      addRoutePopup.close()
      this.routeToEdit = {};

      this.resetRouteForm();
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
    
    if ( type == 'Distance-tab' ) {
      var distanceUnit = event.name == 'Miles' ? 'mi' : 'km';

      this.mapForm.get('distanceUnit').setValue(distanceUnit);
    } else if ( type == 'Address-tab' ) {
      var addressType = event.name == 'City' ? 'city' : 'address';

      this.mapForm.get('addressType').setValue(addressType);
    } else if ( type == 'Border-tab' ) {
      var borderType = event.name == 'Open Border' ? 'open' : 'closed';

      this.mapForm.get('borderType').setValue(borderType);
    } else if ( type == 'Route-tab' ) {
      this.routeForm.get('routeType').setValue(event.name);
    }

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

  onIncludeDuration() {
    this.routeForm
      .get('duration')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        console.log('duration value changed', value);

        if (value) {
          this.inputService.changeValidators(
            this.routeForm.get('durationTime'),
            true,
            [Validators.required]
          );
        } else {
          this.inputService.changeValidators(
            this.routeForm.get('durationTime'),
            false
          );
        }
      });
  }

  onIncludeFuelCost() {
    this.routeForm
      .get('fuelCost')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        console.log('fuelCost value changed', value);

        if (value) {
          this.inputService.changeValidators(
            this.routeForm.get('fuelMpg'),
            true,
            [Validators.required]
          );

          this.inputService.changeValidators(
            this.routeForm.get('fuelPrice'),
            true,
            [Validators.required]
          );

          console.log('routeForm', this.routeForm);
        } else {
          this.inputService.changeValidators(
            this.routeForm.get('fuelMpg'),
            false
          );

          this.inputService.changeValidators(
            this.routeForm.get('fuelPrice'),
            false
          );
        }
      });
  }

  resetMapForm() {
    this.mapForm.patchValue({
      mapName: this.tableData[0].title,
      distanceUnit: this.tableData[0].distanceUnit,
      addressType: this.tableData[0].addressType,
      borderType: this.tableData[0].borderType
    });

    this.mapFormChanged = false;

    this.distanceTabs = [
      {
        id: 1,
        name: 'Miles',
        checked: this.tableData[0].distanceUnit == 'mi'
      },
      {
        id: 2,
        name: 'Km',
        checked: this.tableData[0].distanceUnit == 'km'
      }
    ];

    this.addressTabs = [
      {
        id: 1,
        name: 'City',
        checked: this.tableData[0].addressType == 'city'
      },
      {
        id: 2,
        name: 'Address',
        checked: this.tableData[0].addressType == 'address'
      }
    ];
  
    this.borderTabs = [
      {
        id: 1,
        name: 'Open Border',
        checked: this.tableData[0].borderType == 'open'
      },
      {
        id: 2,
        name: 'Closed Border',
        checked: this.tableData[0].borderType == 'closed'
      }
    ];
  }

  resetRouteForm() {
    if ( this.routeToEdit.id ) {
      this.routeForm.patchValue({
        routeName: this.routeToEdit.name,
        truckId: this.routeToEdit.truckId ? this.routeToEdit.truckId : '',
        duration: this.routeToEdit.stopTime ? true : false,
        durationTime: this.routeToEdit.stopTime ? this.routeToEdit.stopTime : null,
        fuelCost: this.routeToEdit.fuelPrice ? true : false,
        fuelMpg: this.routeToEdit.mpg ? this.routeToEdit.mpg : null,
        fuelPrice: this.routeToEdit.fuelPrice ? this.routeToEdit.fuelPrice : null,
        routeType: this.routeToEdit.routeType
      });
    } else {
      this.routeForm.patchValue({
        routeName: null,
        truckId: '',
        duration: false,
        durationTime: null,
        fuelCost: false,
        fuelMpg: null,
        fuelPrice: null,
        routeType: 'Practical'
      });
    }
    
    this.routeTabs.map((item) => {
      if ( this.routeToEdit && item.name == this.routeToEdit.routeType ) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });

    this.routeFormChanged = false;
  }

  editRoute(route) {
    this.routeToEdit = route;

    this.routeForm.patchValue({
      routeName: route.name,
      truckId: route.truckId ? route.truckId : '',
      duration: route.stopTime ? true : false,
      durationTime: route.stopTime ? route.stopTime : null,
      fuelCost: route.fuelPrice ? true : false,
      fuelMpg: route.mpg ? route.mpg : null,
      fuelPrice: route.fuelPrice ? route.fuelPrice : null,
      routeType: route.routeType
    });
    
    this.routeTabs.map((item) => {
      if ( item.name == route.routeType ) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    
    this.addRoutePopup.open();
  }

  toggleStopPicker() {
    this.stopPickerActive = !this.stopPickerActive;
  }
  
}
