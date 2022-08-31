import { TodoListResponse } from './../../../../../../appcoretruckassist/model/todoListResponse';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TodoTService } from '../state/todo.service';
import { TodoStatus, UpdateTodoStatusCommand } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { TaskModalComponent } from '../../modals/task-modal/task-modal.component';
import { DropResult } from 'ngx-smooth-dnd';
import { applyDrag } from 'src/app/core/utils/methods.globals';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { CommentsService } from 'src/app/core/services/comments/comments.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@UntilDestroy()
@Component({
  selector: 'app-to-do-list-card',
  templateUrl: './to-do-list-card.component.html',
  styleUrls: ['./to-do-list-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToDoListCardComponent implements OnInit {
  public updatedStatusData: UpdateTodoStatusCommand;
  startChangingStatus = false;
  public dragStarted = false;
  cardData: Array<any> = [];
  private destroy$: Subject<void> = new Subject<void>();
  public toDoTasks: any[] = [];
  public inProgressTasks: any[] = [];
  public doneTasks: any[] = [];
  public dropdownOptions: any;

  scene = {
    type: 'container',
    props: {
      orientation: 'horizontal',
    },
    children: [
      {
        id: `column1`,
        type: 'container',
        name: 'column1',
        props: {
          orientation: 'horizontal',
          className: 'card-container',
        },
        children: [],
      },
      {
        id: `column2`,
        type: 'container',
        name: 'column2',
        props: {
          orientation: 'horizontal',
          className: 'card-container',
        },
        children: [],
      },
      {
        id: `column3`,
        type: 'container',
        name: 'column3',
        props: {
          orientation: 'horizontal',
          className: 'card-container',
        },
        children: [],
      },
    ],
  };

  reviews: any = [
    {
      id: 1,
      companyUser: {
        id: 2,
        fullName: 'Angela Martin',
        avatar: 'https://picsum.photos/id/237/200/300',
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
        avatar: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: 'new test new test new test',
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

  public searchToDoOptions = {
    gridNameTitle: 'To Do',
  };

  public searchOnGoingOptions = {
    gridNameTitle: 'On Going',
  };

  public searchDoneOptions = {
    gridNameTitle: 'Done',
  };

  constructor(
    private todoTService: TodoTService,
    private modalService: ModalService,
    private sharedService: SharedService,
    private commentsService: CommentsService,
    private tableService: TruckassistTableService
  ) {}

  ngOnInit(): void {
    this.getTodoList();
    this.initTableOptions();

    this.tableService.currentSearchTableData
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          // your search code here
        }
      });
  }

  dragStart = (e) => {
    this.dragStarted = true;
  };

  dragStoped = () => {
    this.dragStarted = false;
  };

  changedRow(e) {
    if (!this.startChangingStatus) {
      let newStatus = TodoStatus.Todo;
      this.startChangingStatus = true;

      if (e.x === 0) {
        newStatus = TodoStatus.Todo;
        e.status.name = TodoStatus.Todo;
        e.status.id = 1;
      } else if (e.x === 1) {
        newStatus = TodoStatus.InProgres;
        e.status.name = TodoStatus.InProgres;
        e.status.id = 2;
      } else {
        newStatus = TodoStatus.Done;
        e.status.name = TodoStatus.Done;
        e.status.id = 3;
      }

      this.updatedStatusData = {
        id: e.id,
        status: newStatus,
      };
      this.updateStatus(this.updatedStatusData);
    }
  }

  private getTodoList() {
    this.todoTService
      .getTodoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: TodoListResponse) => {
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
        this.startChangingStatus = false;
        // this.notification.success('Task status updated successfully.', 'Success:');
        this.updateTodosList(this.cardData, true);
      });
  }

  updateTodosList(resp, noReplace?: boolean) {
    this.toDoTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.Todo) {
        if (!noReplace) {
          const newObject = {
            ...x,
            type: 'draggable',
          };

          this.cardData.push(newObject);

          this.scene.children[0].children.push(newObject);
        }
        return true;
      }
    });

    this.inProgressTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.InProgres) {
        if (!noReplace) {
          const newObject = {
            ...x,
            type: 'draggable',
          };

          this.cardData.push(newObject);

          this.scene.children[1].children.push(newObject);
        }
        return true;
      }
    });

    this.doneTasks = resp.filter((x, indx) => {
      if (x.status.name === TodoStatus.Done) {
        if (!noReplace) {
          const newObject = {
            ...x,
            type: 'draggable',
          };

          this.cardData.push(newObject);

          this.scene.children[2].children.push(newObject);
        }
        return true;
      }
    });
  }

  toggleComment(e: Event, mainIndx: number, indx: number) {
    e.preventDefault();
    e.stopPropagation();

    this.scene.children[mainIndx].children[indx]['commentActive'] =
      !this.scene.children[mainIndx].children[indx]['commentActive'];
  }

  toggleLinkShow(e: Event, mainIndx: number, indx: number) {
    e.preventDefault();
    e.stopPropagation();
    this.scene.children[mainIndx].children[indx]['linkActive'] =
      !this.scene.children[mainIndx].children[indx]['linkActive'];
  }

  //// NEW ANIMATION

  onDrop(dropResult: DropResult) {
    // update item list according to the @dropResult
    //this.items = applyDrag(this.items, dropResult);
    console.log(dropResult);
  }

  onCardDrop(columnId, dropResult) {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.scene);
      const column = scene.children.filter((p) => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      if (dropResult.removedIndex === null && dropResult.addedIndex !== null) {
        newColumn.children[dropResult.addedIndex].x = columnIndex;

        this.changedRow(newColumn.children[dropResult.addedIndex]);
      }

      this.scene = scene;
    }
  }

  getCardPayload(columnId) {
    return (index) => {
      return this.scene.children.filter((p) => p.id === columnId)[0].children[
        index
      ];
    };
  }

  log(...params) {
    console.log(...params);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sharedService.emitUpdateScrollHeight.emit(true);
    }, 200);
  }

  /**Function for dots in cards */
  public initTableOptions(): void {
    this.dropdownOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideViewMode: false,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
          show: true,
        },
        {
          title: 'Delete',
          name: 'delete-item',
          type: 'driver',
          text: 'Are you sure you want to delete driver(s)?',
          svg: 'assets/svg/common/ic_trash_updated.svg',
          danger: true,
          show: true,
        },
      ],
      export: true,
    };
  }

  dropAct(event) {
    if (event.type == 'delete-item') {
      this.todoTService.deleteTodoById(event.id).subscribe();
      this.cardData = this.cardData.filter((item) => item.id !== event.id);
      this.scene.children = this.scene.children.map((item) => {
        item.children = item.children.filter((item) => item.id !== event.id);
        return item;
      });
    } else {
      this.modalService.openModal(
        TaskModalComponent,
        { size: 'small' },
        {
          ...event,
          type: 'edit',
        }
      );
    }
  }

  changeReviewsEvent(event) {
    console.log(event);
    if (event.action == 'delete') {
      this.commentsService.deleteCommentById(event.data).subscribe({
        next: () => {
          console.log('SUCCESS DELETING');
        },
        error: () => {
          console.log('ERROR WHILE DELETING');
        },
      });
    } else if (event.action == 'update') {
      this.commentsService
        .updateComment({
          id: event.data.id,
          commentContent: event.data.commentContent,
        })
        .subscribe({
          next: () => {
            console.log('SUCCESS DELETING');
          },
          error: () => {
            console.log('ERROR WHILE DELETING');
          },
        });
    }
  }
}
