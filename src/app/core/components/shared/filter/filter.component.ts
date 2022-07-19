import { filter } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [NgbDropdownConfig]
})
export class FilterComponent implements OnInit {

  unselectedUser: any[] = [
    {
      name: 'Aleksandar Djordjevic'
    },
    {
      name: 'Denis Rodman'
    },
    {
      name: 'Eric Halpert'
    },
    {
      name: 'Jacob Forman'
    },
    {
      name: 'James Robertson'
    },
    {
      name: 'Kevin Malone'
    },
    {
      name: 'Michael Tollbert'
    },
    {
      name: 'Michael Rodman'
    },
    {
      name: 'James Halpert'
    },
    {
      name: 'Anna Beasley'
    },
    {
      name: 'Denis Halpert'
    },
    {
      name: 'Eric James'
    },
    {
      name: 'Michael Forman'
    },
    {
      name: 'James Lopez'
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

   selectedDispatcher: any[] = [];

   @Input() type: string = 'userFilter';
   @Input() icon: string = 'user';

  constructor() { }

  ngOnInit(): void {
  }

  addToSelectedUser(item, indx){
    this.unselectedUser.splice(indx, 1);
    this.selectedUser.push(item);
  }

  removeFromSelectedUser(item, indx){
    this.selectedUser.splice(indx, 1);
    this.unselectedUser.push(item);
  }

  clearAll(){
    this.unselectedUser = [...this.unselectedUser, ...this.selectedUser];
    this.selectedUser = [];
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

}
