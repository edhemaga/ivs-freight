import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsTableComponent,
    data: { title: 'Contacts' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ContactsRoutingModule {}
