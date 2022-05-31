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
    }
   ];

   selectedUser: any[] = [];

   @Input() type: string;

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

}
