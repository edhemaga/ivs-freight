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
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { TruckTService } from '../../truck/state/truck.service';
import { TruckListResponse } from 'appcoretruckassist';
import { card_component_animation } from '../../shared/animations/card-component.animations';

@Component({
  selector: 'app-map-toolbar',
  templateUrl: './map-toolbar.component.html',
  styleUrls: ['./map-toolbar.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class MapToolbarComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('op') mapSettingsPopup: any;
  @ViewChild('op2') addRoutePopup: any;
  @ViewChild('op3') layersPopup: any;
  @ViewChild('op4') keyboardPopup: any;

  @Output() toolBarAction: EventEmitter<any> = new EventEmitter();
  @Input() tableData: any[];
  @Input() options: any;
  @Input() selectedTab: string;
  @Input() columns: any[];
  @Input() tableContainerWidth: number;
  @Input() stopPickerActive: boolean = false;
  @Input() isTollRoadsActive: boolean = false;
  @Input() isTimeZoneActive: boolean = false;
  @Input() isDopplerOn: boolean = false;
  @Input() trafficLayerShow: boolean = false;
  listName: string = '';
  mapSettingsPopupOpen: boolean = false;
  addRoutePopupOpen: boolean = false;
  layersPopupOpen: boolean = false;
  keyboardPopupOpen: boolean = false;
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

  distanceTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Miles',
      checked: false,
    },
    {
      id: 2,
      name: 'Km',
      checked: false,
    },
  ];

  addressTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'City',
      checked: false,
    },
    {
      id: 2,
      name: 'Address',
      checked: false,
    },
  ];

  borderTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Open Border',
      checked: false,
    },
    {
      id: 2,
      name: 'Closed Border',
      checked: false,
    },
  ];

  routeTabs: { id: number; name: string; checked: boolean }[] = [
    {
      id: 1,
      name: 'Practical',
      checked: true,
    },
    {
      id: 2,
      name: 'Shortest',
      checked: false,
    },
    {
      id: 3,
      name: 'Cheapest',
      checked: false,
    },
  ];

  mapForm!: FormGroup;
  routeForm!: FormGroup;

  truckType: any[] = [
    {
      id: 1,
      name: 'Semi Truck',
      folder: 'common',
      logoName: 'ic_truck_semi-truck.svg',
      subFolder: 'trucks',
    },
    {
      id: 2,
      name: 'Box Truck',
      folder: 'common',
      logoName: 'ic_truck_box-truck.svg',
      subFolder: 'trucks',
    },
    {
      id: 3,
      name: 'Tow Truck Heavy',
      folder: 'common',
      logoName: 'ic_truck_tow-truck.svg',
      subFolder: 'trucks',
    },
  ];
  selectedTruckType: any = null;

  mapFormChanged: boolean = false;
  routeFormChanged: boolean = false;

  routeToEdit: any = {};

  trafficColors = [
    { color: '#30C862' },
    { color: '#FFAD43' },
    { color: '#FF4D4D' },
    { color: '#B20000' },
  ];
  timezones = [
    { color: '#FF4A4A', text: '-03:30 Greenwich Mean Time' },
    { color: '#FFDD00', text: '-04:00 Eastern Daylight Time' },
    { color: '#7BC57B', text: '-05:00 Central Daylight Time' },
    { color: '#EEA649', text: '-06:00 Mountain Daylight Time' },
    { color: '#3383EC', text: '-07:00 Pacific Daylight Time' },
    { color: '#A851FF', text: '-08:00 Alaska Daylight Time' },
  ];

  hideFuelCost: boolean = false;
  hideDuration: boolean = false;
  truckList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private inputService: TaInputService,
    private truckService: TruckTService
  ) {}

  ngOnInit(): void {
    this.createMapForm();
    this.createRouteForm();

    this.onIncludeDuration();
    this.onIncludeFuelCost();
    //this.getTrucks();
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
      this.getSelectedTabTableData();

      if (
        changes.selectedTab.previousValue &&
        changes.selectedTab.currentValue != changes.selectedTab.previousValue
      ) {
        this.routeToEdit = {};

        this.resetRouteForm();
        this.resetMapForm();

        this.addRoutePopup?.close();
        this.mapSettingsPopup?.close();

        this.layersPopup?.close();
        this.layersPopupOpen = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createMapForm() {
    this.mapForm = this.formBuilder.group({
      mapName: [this.activeTableData.title, Validators.required],
      distanceUnit: this.activeTableData.distanceUnit,
      addressType: this.activeTableData.addressType,
      borderType: this.activeTableData.borderType,
    });

    if (this.activeTableData.distanceUnit == 'mi') {
      this.distanceTabs[0].checked = true;
    } else {
      this.distanceTabs[1].checked = true;
    }

    if (this.activeTableData.addressType == 'city') {
      this.addressTabs[0].checked = true;
    } else {
      this.addressTabs[1].checked = true;
    }

    if (this.activeTableData.borderType == 'open') {
      this.borderTabs[0].checked = false;
    } else {
      this.borderTabs[1].checked = false;
    }

    this.mapForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((formChanges) => {
        if (
          formChanges.mapName != this.activeTableData.title ||
          formChanges.distanceUnit != this.activeTableData.distanceUnit ||
          formChanges.addressType != this.activeTableData.addressType ||
          formChanges.borderType != this.activeTableData.borderType
        ) {
          this.mapFormChanged = true;
        } else {
          this.mapFormChanged = false;
        }
      });
  }

  createRouteForm() {
    this.getSelectedTabTableData();

    this.routeForm = this.formBuilder.group({
      routeName: [
        'Route 0' + (this.activeTableData.length + 1),
        Validators.required,
      ],
      truckId: '',
      duration: false,
      durationTime: null,
      fuelCost: false,
      fuelMpg: null,
      fuelPrice: null,
      routeType: 'Practical',
    });

    this.routeForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((formChanges) => {
        var originalValues = {
          routeName: 'Route 0' + (this.activeTableData.length + 1),
          truckId: '',
          duration: false,
          durationTime: null,
          fuelCost: false,
          fuelMpg: null,
          fuelPrice: null,
          routeType: 'Practical',
        };

        if (this.routeToEdit.id) {
          originalValues = {
            routeName: this.routeToEdit.name,
            truckId: this.routeToEdit.truckId ? this.routeToEdit.truckId : '',
            duration: this.routeToEdit.stopTime ? true : false,
            durationTime: this.routeToEdit.stopTime
              ? this.routeToEdit.stopTime
              : null,
            fuelCost: this.routeToEdit.fuelPrice ? true : false,
            fuelMpg: this.routeToEdit.mpg ? this.routeToEdit.mpg : null,
            fuelPrice: this.routeToEdit.fuelPrice
              ? this.routeToEdit.fuelPrice
              : null,
            routeType: this.routeToEdit.routeType,
          };
        }

        if (
          formChanges.routeName != originalValues.routeName ||
          formChanges.truckId != originalValues.truckId ||
          formChanges.duration != originalValues.duration ||
          formChanges.durationTime != originalValues.durationTime ||
          formChanges.fuelCost != originalValues.fuelCost ||
          formChanges.fuelMpg != originalValues.fuelMpg ||
          formChanges.fuelPrice != originalValues.fuelPrice ||
          formChanges.routeType != originalValues.routeType
        ) {
          this.routeFormChanged = true;
        } else {
          this.routeFormChanged = false;
        }
      });
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
    if (actionType == 'add-route' || actionType == 'edit-route') {
      dataToSend = this.routeForm;

      if (actionType == 'edit-route') {
        dataToSend = {
          form: this.routeForm,
          editId: this.routeToEdit.id,
        };
      }
    } else if (actionType == 'map-settings') {
      dataToSend = this.mapForm;
    } else {
      dataToSend = [];
    }

    this.toolBarAction.emit({
      action: actionType,
      data: dataToSend,
    });

    this.routeToEdit = {};

    this.addRoutePopup?.close();
    this.mapSettingsPopup?.close();
    this.resetRouteForm();
    this.resetMapForm();

    this.layersPopup?.close();
    this.layersPopupOpen = false;

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

    if (this.addRoutePopup && this.addRoutePopup.isOpen()) {
      this.addRoutePopup.close();
      this.routeToEdit = {};
    }

    this.mapSettingsPopupOpen = mapSettingsPopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  onShowRoutePopover(addRoutePopup: any) {
    this.addRoutePopup = addRoutePopup;

    if (addRoutePopup.isOpen()) {
      addRoutePopup.close();
      this.routeToEdit = {};

      this.resetRouteForm();
    } else {
      addRoutePopup.open({});
    }

    this.addRoutePopupOpen = addRoutePopup.isOpen();
    this.optionsPopupContent[4].active = false;
  }

  onShowLayersPopover(layersPopup: any) {
    this.layersPopup = layersPopup;

    if (layersPopup.isOpen()) {
      layersPopup.close();
    } else {
      layersPopup.open({});
    }

    if (this.addRoutePopup && this.addRoutePopup.isOpen()) {
      this.addRoutePopup.close();
      this.routeToEdit = {};
    }

    this.layersPopupOpen = layersPopup.isOpen();
  }

  onShowKeyboardShortcutsPopover(keyboardPopup: any) {
    this.keyboardPopup = keyboardPopup;

    if (keyboardPopup.isOpen()) {
      keyboardPopup.close();
    } else {
      keyboardPopup.open({});
    }

    if (this.addRoutePopup && this.addRoutePopup.isOpen()) {
      this.addRoutePopup.close();
      this.routeToEdit = {};
    }

    this.keyboardPopupOpen = keyboardPopup.isOpen();
  }

  public onTabChange(event: any, type: string): void {
    if (type == 'Distance-tab') {
      var distanceUnit = event.name == 'Miles' ? 'mi' : 'km';

      this.mapForm.get('distanceUnit').setValue(distanceUnit);
    } else if (type == 'Address-tab') {
      var addressType = event.name == 'City' ? 'city' : 'address';

      this.mapForm.get('addressType').setValue(addressType);
    } else if (type == 'Border-tab') {
      var borderType = event.name == 'Open Border' ? 'open' : 'closed';

      this.mapForm.get('borderType').setValue(borderType);
    } else if (type == 'Route-tab') {
      this.routeForm.get('routeType').setValue(event.name);
    }
  }

  public onSelectDropdown(event: any, action: string, index?: number) {
    this.selectedTruckType = event;
  }

  onIncludeDuration() {
    this.routeForm
      .get('duration')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.routeForm.get('durationTime'),
            true,
            [Validators.required]
          );
          this.hideDuration = false;
        } else {
          this.inputService.changeValidators(
            this.routeForm.get('durationTime'),
            false
          );
          this.hideDuration = true;
        }
      });
  }

  onIncludeFuelCost() {
    this.routeForm
      .get('fuelCost')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
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

          this.hideFuelCost = false;
        } else {
          this.inputService.changeValidators(
            this.routeForm.get('fuelMpg'),
            false
          );

          this.inputService.changeValidators(
            this.routeForm.get('fuelPrice'),
            false
          );

          this.hideFuelCost = true;
        }
      });
  }

  resetMapForm() {
    this.mapForm.patchValue({
      mapName: this.activeTableData.title,
      distanceUnit: this.activeTableData.distanceUnit,
      addressType: this.activeTableData.addressType,
      borderType: this.activeTableData.borderType,
    });

    this.mapFormChanged = false;

    this.distanceTabs = [
      {
        id: 1,
        name: 'Miles',
        checked: this.activeTableData.distanceUnit == 'mi',
      },
      {
        id: 2,
        name: 'Km',
        checked: this.activeTableData.distanceUnit == 'km',
      },
    ];

    this.addressTabs = [
      {
        id: 1,
        name: 'City',
        checked: this.activeTableData.addressType == 'city',
      },
      {
        id: 2,
        name: 'Address',
        checked: this.activeTableData.addressType == 'address',
      },
    ];

    this.borderTabs = [
      {
        id: 1,
        name: 'Open Border',
        checked: this.activeTableData.borderType == 'open',
      },
      {
        id: 2,
        name: 'Closed Border',
        checked: this.activeTableData.borderType == 'closed',
      },
    ];
  }

  resetRouteForm() {
    this.getSelectedTabTableData();

    if (this.routeToEdit.id) {
      this.routeForm.patchValue({
        routeName: this.routeToEdit.name,
        truckId: this.routeToEdit.truckId ? this.routeToEdit.truckId : '',
        duration: this.routeToEdit.stopTime ? true : false,
        durationTime: this.routeToEdit.stopTime
          ? this.routeToEdit.stopTime
          : null,
        fuelCost: this.routeToEdit.fuelPrice ? true : false,
        fuelMpg: this.routeToEdit.mpg ? this.routeToEdit.mpg : null,
        fuelPrice: this.routeToEdit.fuelPrice
          ? this.routeToEdit.fuelPrice
          : null,
        routeType: this.routeToEdit.routeType,
      });
    } else {
      this.routeForm.patchValue({
        routeName: 'Route 0' + (this.activeTableData.length + 1),
        truckId: '',
        duration: false,
        durationTime: null,
        fuelCost: false,
        fuelMpg: null,
        fuelPrice: null,
        routeType: 'Practical',
      });
    }

    this.routeTabs = [
      {
        id: 1,
        name: 'Practical',
        checked: this.routeToEdit.routeType == 'Practical',
      },
      {
        id: 2,
        name: 'Shortest',
        checked: this.routeToEdit.routeType == 'Shortest',
      },
      {
        id: 3,
        name: 'Cheapest',
        checked: this.routeToEdit.routeType == 'Cheapest',
      },
    ];

    this.routeFormChanged = false;

    this.ref.detectChanges();
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
      routeType: route.routeType,
    });

    this.routeTabs.map((item) => {
      if (item.name == route.routeType) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });

    this.ref.detectChanges();

    this.addRoutePopup.open();
  }

  toggleStopPicker() {
    this.stopPickerActive = !this.stopPickerActive;
  }

  getTrucks() {
    this.truckService
      .getTruckList(1, 1, 25)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trucks: TruckListResponse) => {
        this.truckList = trucks.pagination.data;
        this.truckType = [];

        this.truckList.map((truck) => {
          this.truckType.push({
            id: truck.id,
            name: truck.truckNumber,
            class: truck.truckType.name,
            folder: 'common',
            logoName: 'assets/svg/common/trucks/' + truck.truckType.logoName,
            subFolder: 'trucks',
            color: truck.color.code,
          });
        });
      });
  }
}
