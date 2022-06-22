import { TodoListResponse } from './../../../../../../appcoretruckassist/model/todoListResponse';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterPush,
  GridType,
} from 'angular-gridster2';
import { Subject, takeUntil } from 'rxjs';
import { TodoTService } from '../state/todo.service';
import { TodoStatus, UpdateTodoStatusCommand } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaskModalComponent } from '../../modals/task-modal/task-modal.component';

@Component({
  selector: 'app-to-do-list-card',
  templateUrl: './to-do-list-card.component.html',
  styleUrls: ['./to-do-list-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListCardComponent implements OnInit {
  @ViewChild('mainGridster') mainGridster: any;

  options: GridsterConfig;

  public updatedStatusData: UpdateTodoStatusCommand;
  startChangingStatus = false;
  public dragStarted = false;
  cardData: Array<GridsterItem> = [];
  private destroy$: Subject<void> = new Subject<void>();
  dashboardItems: GridsterItemComponent[] = [];
  public toDoTasks: any[] = [];
  public inProgressTasks: any[] = [];
  public doneTasks: any[] = [];

  reviews: any = [
    {
      id: 1,
      companyUser: {
        id: 2,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: 'test test test test test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
    {
      id: 3,
      companyUser: {
        id: 4,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: 'new test new test new test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
    {
      id: 5,
      companyUser: {
        id: 6,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: 'comment comment comment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: false,
    },
  ];

  worldClockHolder: any = [
    {
      city: 'Sydney',
      state: 'Australia',
      day: 'SAT',
      date: 'May 6th',
      time: '02:36',
      partDay: 'A M',
    },
    {
      city: 'Belgrade',
      state: 'Serbia',
      day: 'FRI',
      date: 'May 4th',
      time: '06:36',
      partDay: 'P M',
    },
    {
      city: 'Chicago',
      state: 'Illanois, USA',
      day: 'FRI',
      date: 'May 4th',
      time: '11:36',
      partDay: 'A M',
    },
    {
      city: 'San Francisco',
      state: 'California, USA',
      day: 'FRI',
      date: 'May 4th',
      time: '09:36',
      partDay: 'A M',
    },
  ];

  constructor(
    private todoTService: TodoTService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.options = {
      gridType: GridType.VerticalFixed,
      displayGrid: DisplayGrid.None,
      compactType: CompactType.CompactUp,
      pushItems: true,
      pushDirections: { north: true, east: false, south: true, west: false },
      maxCols: 3,
      minCols: 3,
      fixedRowHeight: 160,
      itemChangeCallback: this.changedRow,
      disableScrollVertical: true,
      disableScrollHorizontal: true,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        start: this.dragStart,
        stop: this.dragStoped,
        dropOverItems: false,
      },
      resizable: {
        enabled: false,
      },
    };

    this.getTodoList();
  }

  dragStart = (e) => {
    console.log('DRAG HAS START');
    this.dragStarted = true;
  };

  dragStoped = () => {
    console.log('DRAG HAS Stopped');
    this.dragStarted = false;
  };

  changedRow = (e) => {
    if (!this.startChangingStatus) {
      let newStatus = TodoStatus.Todo;
      this.startChangingStatus = true;

      if (e.x === 0) {
        newStatus = TodoStatus.Todo;
        e.status = TodoStatus.Todo;
      } else if (e.x === 1) {
        newStatus = TodoStatus.InProgres;
        e.status = TodoStatus.InProgres;
      } else {
        newStatus = TodoStatus.Done;
        e.status = TodoStatus.Done;
      }

      this.updatedStatusData = {
        id: e.id,
        status: newStatus,
      };
      this.updateStatus(this.updatedStatusData);
    }
  };

  private getTodoList() {
    this.todoTService
      .getTodoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: TodoListResponse) => {
        console.log('WHAT IS RESPONSE FROM TODO');
        console.log(resp);
        this.updateTodosList(resp.pagination.data);
      });
  }

  public openModalTodo() {
    this.modalService.openModal(TaskModalComponent, { size: 'small' });
  }

  public updateStatus(todo) {
    this.todoTService
      .updateTodoItem(todo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: TodoListResponse) => {
        console.log('WHAT IS RESPONSE FROM TODO');
        console.log(resp);
        this.startChangingStatus = false;
        // this.notification.success('Task status updated successfully.', 'Success:');
        //this.updateTodosList(resp.pagination.data);
      });
  }

  updateTodosList(resp, noReplace?: boolean) {
    this.toDoTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.Todo) {
        if (!noReplace) {
          this.cardData.push({
            ...x,
            cols: 1,
            rows: 1,
            y: indx,
            x: 0,
            minItemRows: 1,
            minItemCols: 1,
            initCallback: this.initItem.bind(this, this.cardData.length),
          });
        }
        return true;
      }
    });

    this.inProgressTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.InProgres) {
        if (!noReplace) {
          this.cardData.push({
            ...x,
            cols: 1,
            rows: 1,
            y: indx,
            x: 1,
            minItemRows: 1,
            minItemCols: 1,
            initCallback: this.initItem.bind(this, this.cardData.length),
          });
        }
        return true;
      }
    });

    this.doneTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.Done) {
        if (!noReplace) {
          this.cardData.push({
            ...x,
            done: true,
            cols: 1,
            rows: 1,
            y: indx,
            x: 2,
            minItemRows: 1,
            minItemCols: 1,
            initCallback: this.initItem.bind(this, this.cardData.length),
          });
        }
        return true;
      }
    });
  }

  toggleComment(e: Event, indx: number) {
    e.preventDefault();
    e.stopPropagation();
    this.cardData[indx]['commentActive'] =
      !this.cardData[indx]['commentActive'];

    this.toggleExpandControll(indx, this.cardData[indx]['commentActive']);
  }

  toggleExpandControll(indx: number, isOpen: boolean) {
    const push = new GridsterPush(this.dashboardItems[indx]);
    console.log(isOpen);
    if (isOpen) {
      this.dashboardItems[indx].$item.rows += 1; // move/resize your item
      push.pushItems(push.fromNorth);

      push.checkPushBack(); // check for items can restore to original position
      push.setPushedItems();
      this.dashboardItems[indx].setSize();
      this.dashboardItems[indx].updateItemSize();
    } else {
      this.dashboardItems[indx].$item.rows -= 1; // move/resize your item
      push.restoreItems();
    }
    push.destroy();
  }

  initItem(
    ind: number,
    item: GridsterItem,
    itemComponent: GridsterItemComponent
  ): void {
    this.dashboardItems[ind] = itemComponent;
  }

  toggleLinkShow(e: Event, indx: number) {
    e.preventDefault();
    e.stopPropagation();
    this.cardData[indx]['linkActive'] = !this.cardData[indx]['linkActive'];
  }
}
