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

   selectedDispatcher: any[] = [];
   selectedTimeValue: any = '';
   expandSearch: boolean = false;
   public searchForm!: FormGroup;

   @Input() type: string = 'userFilter';
   @Input() icon: string = 'user';

   constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      search: ''
    });

    this.searchForm.valueChanges.subscribe((changes) => {
      console.log(changes.search);
      //if ( this.searchData ) this.searchData.emit(changes.search);
    });
  }

  addToSelectedUser(item, indx){
    
    if ( this.type == 'departmentFilter' )
      {
        this.departmentArray[indx].hidden = true;
      }
    else 
      {
        this.unselectedUser[indx].hidden = true;
      }  
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
                  this.departmentArray[i].hidden = false;
                }
              
            }
        }
     else 
      {
        for ( var i = 0; i < this.unselectedUser.length; i++ )
            {
              if (this.unselectedUser[i].id == id )
                {
                  this.unselectedUser[i].hidden = false;
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
                this.departmentArray[i].hidden = false;
              }
          }
        else 
          {
            for ( var i = 0; i < this.unselectedUser.length; i++ )
              {
                this.unselectedUser[i].hidden = false;
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
