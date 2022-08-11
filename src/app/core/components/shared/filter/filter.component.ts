import { filter } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [NgbDropdownConfig]
})
export class FilterComponent implements OnInit {

  unselectedUser: any[] = [
    {
      name: 'Aleksandar Djordjevic',
      id: 1,
    },
    {
      name: 'Denis Rodman',
      id: 2,
    },
    {
      name: 'Eric Halpert',
      id: 3,
    },
    {
      name: 'Jacob Forman',
      id: 4,
    },
    {
      name: 'James Robertson',
      id: 5,
    },
    {
      name: 'Kevin Malone',
      id: 6,
    },
    {
      name: 'Michael Tollbert',
      id: 7,
    },
    {
      name: 'Michael Rodman',
      id: 8,
    },
    {
      name: 'James Halpert',
      id: 9,
    },
    {
      name: 'Anna Beasley',
      id: 10,
    },
    {
      name: 'Denis Halpert',
      id: 11,
    },
    {
      name: 'Eric James',
      id: 12,
    },
    {
      name: 'Michael Forman',
      id: 13,
    },
    {
      name: 'James Lopez',
      id: 14,
    }
   ];

   selectedUser: any[] = [];

   unselectedDispatcher: any[] = [
    {
      name: 'Angelo Trotter'
    },
    {
      name: 'Aleksandra Djordjevic'
    },
    {
      name: 'Alex Midleman'
    },
    {
      name: 'Ban Dover'
    },
    {
      name: 'Carlos Huanito'
    },
    {
      name: 'Chirs Griffin',
    },
    {
      name: 'Eric Forman',
    },
    {
      name: 'Glan Danzig'
    },
    {
      name: 'Denis Rodman'
    },
    {
      name: 'Michael Scott'
    },
    {
      name: 'Marko Martinovic'
    }
   ];

   departmentArray: any[] = [
      {
        name: 'Accounting',
        id: 1,
      },
      {
        name: 'Dispatch',
        id: 2,
      },
      {
        name: 'Recruitment',
        id: 3,
      },
      {
        name: 'Repair',
        id: 4,
      },
      {
        name: 'Safety',
        id: 5,
      },
      {
        name: 'Other',
        id: 6,
      }
   ];

   pendingStatusArray: any[] = [
      {
        id: 1,
        name: 'BOOKED',
        color: '#C1C1C1'
      },
      {
        id: 2,
        name: 'UNASSIGNED',
        color: '#C1C1C1'
      },
      {
        id: 3,
        name: 'ASSIGNED',
        color: '#9F9F9F'
      },
   ];

   activeStatusArray: any[] = [
    {
      id: 1,
      name: 'LOADED',
      color: '#74BF97'
    },
    {
      id: 2,
      name: 'DISPATCHED',
      color: '#7FA2E6'
    },
 ];

 closedStatusArray: any[] = [
  {
    id: 1,
    name: 'CANCELED',
    color: '#E27579'
  },
  {
    id: 2,
    name: 'CANCELED - LOADED',
    color: '#E27579'
  },
  {
    id: 3,
    name: 'DELIVERED',
    color: '#FFCB86'
  },
  {
    id: 4,
    name: 'HOLD',
    color: '#D6D6D6'
  },
  {
    id: 5,
    name: 'HOLD - INVOICED',
    color: '#D6D6D6'
  },
  {
    id: 6,
    name: 'INVOICED',
    color: '#D2CBA6'
  },
  {
    id: 7,
    name: 'PAID',
    color: '#BCB8A2'
  },
  {
    id: 8,
    name: 'SHORT-PAID',
    color: '#A6A293'
  },
];

pmFilterArray: any[] = [
  {
    id: 1,
    name: 'Engine Oil & Filter',
    icon: 'assets/svg/common/repair-pm/ic_oil_pump.svg',
  },
  {
    id: 2,
    name: 'Air Filter',
    icon: 'assets/svg/common/repair-pm/ic_air_filter.svg',
  },
  {
    id: 3,
    name: 'Belts',
    icon: 'assets/svg/common/repair-pm/ic_fuel_pump.svg',
  },
  {
    id: 4,
    name: 'Transmission Fluid',
    icon: 'assets/svg/common/repair-pm/ic_air_compressor.svg',
  },
  {
    id: 5,
    name: 'Engine Tune-Up',
    icon: 'assets/svg/common/repair-pm/ic_ac_compressor.svg',
  },
  {
    id: 6,
    name: 'Alignment',
    icon: 'assets/svg/common/repair-pm/ic_alignment.svg',
  },
  {
    id: 7,
    name: 'Battery',
    icon: 'assets/svg/common/repair-pm/ic_battery.svg',
  },
  {
    id: 8,
    name: 'Brake Chamber',
    icon: 'assets/svg/common/repair-pm/ic_brake_filter.svg',
  },
  {
    id: 9,
    name: 'Engine Oil & Filter',
    icon: 'assets/svg/common/repair-pm/ic_oil_pump.svg',
  },
]


categoryFuelArray: any[] = [
  {
    name: 'Diesel',
    id: 1,
  },
  {
    name: 'Reefer',
    id: 2,
  },
  {
    name: 'DEF',
    id: 3,
  },
  {
    name: 'Scale Ticket',
    id: 4,
  },
  {
    name: 'Oil',
    id: 5,
  },
  {
    name: 'Truckwash',
    id: 6,
  },
  {
    name: 'Parking',
    id: 7,
  },
  {
    name: 'Other',
    id: 8, 
  }
];

categoryRepairArray: any[] = [
  {
    id: 1,
    name: 'Mobile',
    icon: 'assets/svg/common/repair-services/ic_mobile.svg',
  },
  {
    id: 2,
    name: 'Shop',
    icon: 'assets/svg/truckassist-table/repair/ic_shop.svg',
  },
  {
    id: 3,
    name: 'Towing',
    icon: 'assets/svg/truckassist-table/repair/ic_towing.svg',
  },
  {
    id: 4,
    name: 'Parts',
    icon: 'assets/svg/truckassist-table/repair/active-shop-types/Parts.svg',
  },
  {
    id: 5,
    name: 'Tire',
    icon: 'assets/svg/common/repair-services/ic_tire.svg',
  },
  {
    id: 6,
    name: 'Dealer',
    icon: 'assets/svg/common/repair-services/ic_dealer.svg',
  },
]


   selectedDispatcher: any[] = [];
   selectedTimeValue: any = '';
   expandSearch: boolean = false;
   searchInputValue: any = '';
   public searchForm!: FormGroup;

   @Input() type: string = 'userFilter';
   @Input() icon: string = 'user';
   @Input() subType: string = 'pendingStatus';

   constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      search: ''
    });

    this.searchForm.valueChanges.subscribe((changes) => {
      if (changes.search)
        {
          let inputValue = changes.search;
          this.searchInputValue = inputValue;

          if ( this.type == 'userFilter' )
            {
                this.unselectedUser.filter(item => {
                  item.hidden = true;
                  if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
                    item.hidden = false;
                  }
                  return item;
                });
            }
          else if ( this.type == 'statusFilter' )
            {
                this.pendingStatusArray.filter(item => {
                  item.hidden = true;
                  if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
                    item.hidden = false;
                  }
                  return item;
                });

                this.activeStatusArray.filter(item => {
                  item.hidden = true;
                  if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
                    item.hidden = false;
                  }
                  return item;
                });

                this.closedStatusArray.filter(item => {
                  item.hidden = true;
                  if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
                    item.hidden = false;
                  }
                  return item;
                });
            }  
          
        }
      else  
        {
          if ( this.type == 'userFilter' )
            {
              for ( var i = 0; i < this.unselectedUser.length; i++ )
                {
                  this.unselectedUser[i].hidden = false;            
                }
            }
          
          else if ( this.type == 'statusFilter' )
            {
              for ( var i = 0; i < this.pendingStatusArray.length; i++ )
                {
                  this.pendingStatusArray[i].hidden = false;            
                }
                
              for ( var i = 0; i < this.activeStatusArray.length; i++ )
                {
                  this.activeStatusArray[i].hidden = false;            
                }
                
              for ( var i = 0; i < this.closedStatusArray.length; i++ )
                {
                  this.closedStatusArray[i].hidden = false;            
                } 
            }  
          
          
          this.searchInputValue = ''; 
        } 
      
      
    });
  }

  addToSelectedUser(item, indx, subType?){
    
    let mainArray:any[] = [];
    if ( this.type == 'departmentFilter' )
      {
        mainArray = this.departmentArray;
      }
    else if ( this.type == 'statusFilter' )
      {
        if ( subType == 'pending' )
          {
            mainArray = this.pendingStatusArray;
          }
        else if ( subType == 'active' )
          {
            mainArray = this.activeStatusArray;
          }
        else 
          {
            mainArray = this.closedStatusArray;
          }    
      }
    else if ( this.type == 'pmFilter' )
      {
        mainArray = this.pmFilterArray;
      } 
    else if ( this.type == 'categoryFuelFilter' )   
      {
        mainArray = this.categoryFuelArray;
      } 
    else if ( this.type == 'categoryRepairFilter' )   
      {
        mainArray = this.categoryRepairArray;
      }   
    else 
      {
        mainArray = this.unselectedUser;
      }
      
    mainArray[indx].isSelected = true;
      
    this.selectedUser.push(item);
  }

  removeFromSelectedUser(item, indx){
    this.selectedUser.splice(indx, 1);
    
    let id = item.id;
  
    if ( this.type == 'departmentFilter' )
        {
          for ( var i = 0; i < this.departmentArray.length; i++ )
            {
              if (this.departmentArray[i].id == id )
                {
                  this.departmentArray[i].isSelected = false;
                }
              
            }
        }
     else if ( this.type == 'statusFilter' )
      {
        let checkActiveStatusArray = this.activeStatusArray.indexOf(item);
        let checkPendingStatusArray = this.pendingStatusArray.indexOf(item);

        let mainArray: any[] = [];

        if ( checkActiveStatusArray > -1 )
          {
            mainArray = this.activeStatusArray;
          }
        else if ( checkPendingStatusArray > -1 )
          {
            mainArray = this.pendingStatusArray;
          }
        else 
          {
            mainArray = this.closedStatusArray;
          }  
          
          for ( var i = 0; i < mainArray.length; i++ )
            {
              if (mainArray[i].id == id )
                {
                  mainArray[i].isSelected = false;
                }
              
            }
      } 
     else if ( this.type == 'pmFilter' ) 
        {
          for ( var i = 0; i < this.pmFilterArray.length; i++ )
            {
              if (this.pmFilterArray[i].id == id )
                {
                  this.pmFilterArray[i].isSelected = false;
                }
              
            }
        }
       else if ( this.type == 'categoryFuelFilter' ) 
        {
          for ( var i = 0; i < this.categoryFuelArray.length; i++ )
            {
              if (this.categoryFuelArray[i].id == id )
                {
                  this.categoryFuelArray[i].isSelected = false;
                }
              
            }
        }
     else if ( this.type == 'categoryRepairFilter' )    
      {
        for ( var i = 0; i < this.categoryRepairArray.length; i++ )
            {
              if (this.categoryRepairArray[i].id == id )
                {
                  this.categoryRepairArray[i].isSelected = false;
                }
              
            }
      }
     else 
      {
        for ( var i = 0; i < this.unselectedUser.length; i++ )
            {
              if (this.unselectedUser[i].id == id )
                {
                  this.unselectedUser[i].isSelected = false;
                }
              
            }
      } 
   
  }

  clearAll(e?){

    if (e)
      {
        e.stopPropagation();
      }

    console.log('--type--', this.type);
     
    if ( this.type == 'timeFilter' )
      {
        this.selectedTimeValue = '';
      }
    else 
      {
        this.unselectedUser = [...this.unselectedUser, ...this.selectedUser];
        this.selectedUser = [];

        if ( this.type == 'departmentFilter' )
          {
            for ( var i = 0; i < this.departmentArray.length; i++ )
              {
                this.departmentArray[i].isSelected = false;
              }
          }
        else if ( this.type == 'statusFilter' ) 
          {
            for ( var i = 0; i < this.pendingStatusArray.length; i++ )
              {
                  this.pendingStatusArray[i].isSelected = false;
              }

            for ( var i = 0; i < this.activeStatusArray.length; i++ )
              {
                  this.activeStatusArray[i].isSelected = false;
              }
              
            for ( var i = 0; i < this.closedStatusArray.length; i++ )
              {
                  this.closedStatusArray[i].isSelected = false;
              }  
          }
        else if ( this.type == 'pmFilter' )  
          {
            for ( var i = 0; i < this.pmFilterArray.length; i++ )
              {
                  this.pmFilterArray[i].isSelected = false;
              }
          } 
        else if ( this.type == 'categoryFuelFilter' ) 
          {
            for ( var i = 0; i < this.categoryFuelArray.length; i++ )
              {
                  this.categoryFuelArray[i].isSelected = false;
              }
          } 
        else if ( this.type == 'categoryRepairFilter' ) 
          {
            for ( var i = 0; i < this.categoryRepairArray.length; i++ )
              {
                  this.categoryRepairArray[i].isSelected = false;
              }
          }   
        else 
          {
            for ( var i = 0; i < this.unselectedUser.length; i++ )
              {
                this.unselectedUser[i].isSelected = false;
              }
          }  
      }  

   
  }

  filterUser(e: any) {
    const inputValue = e.target.value
    this.unselectedUser.filter(item => {
      item.hidden = true;
      if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
        item.hidden = false;
      }
      return item;
    });
  }

  addToSelectedDispatcher(indx, item){
    this.unselectedDispatcher.splice(indx, 1);
    this.selectedDispatcher.push(item);
  }

  removeFromSelectedDispatcher(item, indx){
    this.selectedDispatcher.splice(indx, 1);
    this.unselectedDispatcher.push(item);
  }

  filterDispatcher(e: any){
    const inputValue = e.target.value;
    this.unselectedDispatcher.filter(item => {
      item.hidden = true;
      if(item.name.toLowerCase().includes(inputValue.toLowerCase())){
        item.hidden = false;
      }
      return item;
    });
  }

  clearAllDispatcher(){
    this.unselectedDispatcher = [...this.unselectedDispatcher, ...this.selectedDispatcher];
    this.selectedDispatcher = [];
  }

  hideOtherToolTips(e){
    document.querySelectorAll('.box-icons').forEach((parentElement) => {
      //console.log('---parentElement----', parentElement); 
    })
    
  }

  backOtherToolTips(e){
    document.querySelectorAll('.box-icons').forEach((parentElement) => {
      //parentElement.style.pointerEvents = 'auto';
      //parentElement.classList.remove('hideEventsOnBox');
    })
  }

  setTimeValue(mod){
    this.selectedTimeValue = mod;
  }

  removeTimeValue(e){
    e.stopPropagation();
    this.selectedTimeValue = '';
  }

  showSearch(mod?){
    if ( mod )
      {
        this.expandSearch = false;
      }
     else 
      {
        this.expandSearch = true;
      } 
    
  }

}
