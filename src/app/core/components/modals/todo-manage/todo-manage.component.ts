import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormatSettings} from "@progress/kendo-angular-dateinputs";
import { environment } from 'src/environments/environment';
import {Subject, takeUntil} from "rxjs";
import {FILE_TABLES} from "../../../../const";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../../../services/notification/notification.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {SharedService} from "../../../services/shared/shared.service";
import {UserService} from "../../../services/user/user.service";
import {TodoNew} from "../../../model/todo";
import {TodoManageService} from "../../../services/todo-manage/todo-manage.service";
import { Comments } from 'src/app/core/model/comments';
import {StorageService} from "../../../services/storage/storage.service";

@Component({
  selector: 'app-todo-manage',
  templateUrl: './todo-manage.component.html',
  styleUrls: ['./todo-manage.component.scss']
})
export class TodoManageComponent implements OnInit {

  @ViewChild('note') note: ElementRef;
  @ViewChild('comment') comment: ElementRef;
  @Input() inputData: any; // example { id: 5 } from todo-list, (edit mode)
  public taskForm: FormGroup;
  public touchableDescription: string = '';
  public touchableHyperlink: string = '';
  public modalTitle = 'Add task';
  public format: FormatSettings = environment.dateFormat;
  public todoSwitchData = [
    {
      id: 'accounting',
      name: 'Accounting',
      checked: true,
    },
    {
      id: 'dispatch',
      name: 'Dispatcher',
      checked: false,
    },
    {
      id: 'safety',
      name: 'Safety',
      checked: false,
    },
  ];
  public comments: Comments[] = [];
  public showComments: boolean;
  public showNote: boolean;
  public showAttach: boolean;
  public allUsers = [];
  public commentControl = new FormControl();
  public toggledEditComment: any[] = [];
  public addNewComment: boolean;
  public loaded: boolean = false; // for spinner
  public attachments: any = [];
  private uId = JSON.parse(localStorage.getItem('currentUser')).id;
  private todo: TodoNew;
  public files = [];
  inputText: false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private shared: SharedService,
    private storageService: StorageService,
    private todoService: TodoManageService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private userService: UserService
  ) {
  }

  /**
   * Methods for work with comments array in form
   */
  get getComments(): FormArray {
    return this.taskForm.get('comments') as FormArray;
  }

  ngOnInit(): void {
    this.createForm();
    this.getUsers();
    if (this.inputData.data.type === 'edit') {
      this.getTaskById(this.inputData.data.id);
      this.getListofCommentsById(this.inputData.data.id);
      this.modalTitle = 'Edit task';
    } else {
      this.loaded = true;
    }
    this.emitDeleteAttachments();
    this.touchableUnRequiredFields();
  }

  public addCommentsToForm(id, entity, text) {
    this.getComments.push(
      new FormGroup({
        commentId: new FormControl(id),
        commentEntity: new FormControl(entity),
        commentText: new FormControl(text, {updateOn: 'change'}),
      })
    );
  }

  /**
   * Validators for fields which is touchable, but not required
   */

  touchableUnRequiredFields() {
    this.taskForm
      .get('description')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.touchableDescription = this.shared.manageInputValidation(
            this.taskForm.get('description')
          );
        } else {
          this.touchableDescription = '';
        }
      });

    this.taskForm
      .get('url')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.touchableHyperlink = this.shared.manageInputValidation(this.taskForm.get('url'));
        } else {
          this.touchableHyperlink = '';
        }
      });
  }

  /**
   * Switch Category
   */

  public categorySwitch(data: any) {
    const categoryName = data.find((x) => x.checked === true).name;
    this.taskForm.controls.category.setValue(categoryName);
  }

  /**
   * Task ID
   */

  getTaskById(id) {
    this.todoService
      .getTaskById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: TodoNew) => {
          this.setTodoForm(resp);
          this.loaded = true;
          this.todo = resp;
          this.todoSwitchData.map((x) => (x.checked = false));
          const a = this.todoSwitchData.find((x) => x.name === resp.category);
          a.checked = true;
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  /**
   * Open Note
   */

  public openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      let timer = setTimeout(() => {
        this.note.nativeElement.focus();
        clearTimeout(timer);
      }, 250);
    }
  }

  /**
   * Open comments
   */

  public openComments() {
    this.showComments = this.showComments !== true;
  }

  /**
   * Attachments
   */

  public setFiles(files: any) {
    this.files = files;
  }

  /**
   * Update Task / Add new Task
   */

  public manageTask(keepModal: boolean) {
    if (!this.shared.markInvalid(this.taskForm)) {
      return false;
    }
    this.spinner.show(true);
    const task = this.taskForm.getRawValue();
    const taskManage = {
      parentId: 0,
      assigneeId: 0,
      category: task.category,
      name: task.name,
      url: task.url,
      startDate: new Date(),
      deadLine: task.deadLine,
      note: task.note,
      priority: 0,
      status: task.status,
      userId: 2,
      doc: {
        tags: this.taskForm.controls.assignData.value,
        attachments:
          this.inputData.data.type == 'new'
            ? []
            : this.todo.doc.attachments !== null && this.todo.doc.attachments.length > 0
              ? this.todo.doc.attachments
              : [],
        description: task.description,
      },
    };

    if (this.inputData.data.type === 'new') {
      this.todoService
        .createTodoTask(taskManage)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp1: any) => {
            this.notification.success('Task added successfully.', 'Success:');
            const newFiles = this.shared.getNewFiles(this.files);
            if (newFiles.length > 0) {
              this.storageService
                .uploadFiles(resp1.guid, FILE_TABLES.TODO, resp1.id, this.files)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (resp2: any) => {
                    if (resp2.success.length > 0) {
                      const tempArray = [];
                      resp2.success.forEach((element) => {
                        tempArray.push(element);
                      });
                      taskManage.doc.attachments = tempArray;
                      this.notification.success(`Attachments successfully uploaded.`, ' ');
                      this.todoService
                        .updateTodo(resp1.id, taskManage)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          (resp3: any) => {
                            if (!keepModal) {
                              this.resetModalData();
                            }
                            this.spinner.show(false);
                            this.notification.success('Task updated successfully.', 'Success:');
                          },
                          (error: HttpErrorResponse) => {
                            this.shared.handleError(error);
                          }
                        );
                    } else {
                      if (!keepModal) {
                        this.resetModalData();
                      }
                      this.spinner.show(false);
                    }
                  },
                  (error: HttpErrorResponse) => {
                    this.shared.handleError(error);
                  }
                );
            } else {
              if (!keepModal) {
                this.resetModalData();
              }
              this.spinner.show(false);
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else if (this.inputData.data.type === 'edit') {
      const newFiles = this.shared.getNewFiles(this.files);
      if (newFiles.length > 0) {
        this.storageService
          .uploadFiles(this.todo.guid, FILE_TABLES.TODO, this.todo.id, this.files)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp2: any) => {
              if (resp2.success.length > 0) {
                const tempArray = [];
                resp2.success.forEach((element) => {
                  tempArray.push(element);
                });
                taskManage.doc.attachments = tempArray;
                this.notification.success(`Attachments successfully uploaded.`, ' ');
                this.todoService
                  .updateTodo(this.todo.id, taskManage)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
                    (resp3: any) => {
                      if (!keepModal) {
                        this.resetModalData();
                      }
                      this.spinner.show(false);
                      this.notification.success('Task updated successfully.', 'Success:');
                    },
                    (error: HttpErrorResponse) => {
                      this.shared.handleError(error);
                    }
                  );
              } else {
                if (!keepModal) {
                  this.resetModalData();
                }
                this.spinner.show(false);
              }
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      } else {
        this.todoService
          .updateTodo(this.inputData.data.id, taskManage)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp: any) => {
              this.notification.success('Task updated successfully.', 'Success:');
              if (!keepModal) {
                this.resetModalData();
              }
              this.spinner.show(false);
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      }
    }
  }

  /**
   * Update task on ENTER key
   */

  public keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.manageTask(false);
    }
  }

  /**
   * Close Modal and Reset
   */

  public resetModalData() {
    this.activeModal.close();
    this.todoService.emitTodo.emit(true);
  }

  /**
   * Creating comment
   */
  public createComment() {
    const comment = {
      parentId: 0,
      entityId: this.inputData.data.id,
      commentText: this.commentControl.value,
    };
    this.todoService
      .createComment(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.notification.success('Comment added successfully.', 'Success:');
          this.spinner.show(false);
          this.comments.push(res);
          this.addNewComment = false;
          this.addCommentsToForm(res.id, res.entityName, res.commentText);
          this.toggledEditComment.push({isEditComment: false});
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  /**
   * Return user id for comments
   */
  public returnUserId(x) {
    return x.userId === this.uId;
  }

  /**
   * Return user {} for comments
   */
  public returnUserForComment(comment) {
    if (this.allUsers) {
      return this.allUsers.find((x) => x.id === comment.userId);
    }
  }

  public toggleEditComment(index) {
    for (let i = 0; i < this.toggledEditComment.length; i++) {
      if (i === index) {
        this.toggledEditComment[i].isEditComment = !this.toggledEditComment[i].isEditComment;
      } else {
        this.toggledEditComment[i].isEditComment = false;
      }
    }
  }

  public updateComment(comment, index) {
    const commentData = {
      parentId: 0,
      entityId: this.inputData.data.id,
      commentText: comment.get('commentText').value,
    };
    this.todoService
      .updateComment(comment.get('commentId').value, commentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.notification.success('Comment update successfully.', 'Success:');
          this.todoService.emitTodo.emit(true);
          this.getComments.at(index).get('commentText').patchValue(res.commentText);
          this.toggledEditComment[index].isEditComment = false;
        },
        (error) => {
          this.shared.handleServerError();
        }
      );
    this.toggleEditComment(index);
  }

  public deleteComment(id, ind) {
    this.todoService
      .deleteComment(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.notification.success('Comment deleted successfully.', 'Success:');
          this.todoService.emitTodo.emit(true);
          this.toggledEditComment.splice(ind, 1);
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  public toggleCreateComment() {
    this.addNewComment = !this.addNewComment;
    setTimeout(() => {
      if (this.addNewComment) {
        this.comment.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Init Form
   */
  private createForm() {
    this.taskForm = this.formBuilder.group({
      category: ['Accounting'],
      name: ['', Validators.required],
      description: [''],
      url: [''],
      deadLine: [null, Validators.required],
      assignData: [null],
      note: [''],
      status: -1, // > ?
      comments: new FormArray([]),
    });
    let timer = setTimeout(() => {
      this.transformInputData();
      clearTimeout(timer);
    });
  }

  /**
   * Transform letter manipulation
   */

  private transformInputData() {
    const data = {
      name: 'capitalize',
      description: 'capitalize',
      hyperlink: 'lower',
      note: 'capitalize',
    };
    this.shared.handleInputValues(this.taskForm, data);
  }

  /**
   * List comments by Id
   */

  private getListofCommentsById(id) {
    this.todoService
      .getSingleTodoCommentsList(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.comments = response;
          if (this.comments.length > 0) {
            this.showComments = true;
            for (let i = 0; i < this.comments.length; i++) {
              this.addCommentsToForm(
                this.comments[i].id,
                this.comments[i].entityName,
                this.comments[i].commentText
              );
              this.toggledEditComment.push({
                isEditComment: false,
              });
            }
          }
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  /**
   * Delete attachments
   */

  private emitDeleteAttachments() {
    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.todo.doc.attachments = this.todo.doc.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.manageTask(true);
      }
    });
  }

  /**
   * Fill form after get reasponse todo
   */

  private setTodoForm(formData) {
    this.taskForm.patchValue({
      category: formData.category,
      name: formData.name,
      description: formData.doc.description || '',
      url: formData.url,
      note: formData.note !== null ? formData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
      deadLine: new Date(formData.deadLine),
      status: formData.status,
    });
    this.attachments = formData.doc && formData.doc.attachments ? formData.doc.attachments : [];
    if (formData?.doc?.tags?.length > 0) {
      this.taskForm.controls.assignData.setValue(formData.doc.tags);
    } else {
      this.taskForm.controls.assignData.setValue('');
    }
    if (formData.note.length > 0) {
      this.showNote = true;
    }
    this.shared.touchFormFields(this.taskForm);
  }

  /**
   * Assign Users Task
   */

  private getUsers() {
    this.userService
      .getUsersList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.allUsers = resp;
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  clearInput(x) {
    this.taskForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.taskForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

}
