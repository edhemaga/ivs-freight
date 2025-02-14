import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Models
import {
    CommentResponse,
    CreateCommentCommand,
    EnumValue,
    SignInResponse,
    TodoModalResponse,
    TodoResponse,
    UpdateCommentCommand,
} from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';

// Components
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import {
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownComponent,
    CaModalButtonComponent,
    CaModalComponent,
} from 'ca-components';

// Services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { TodoService } from '@pages/to-do/services/to-do.service';
import { CommentsService } from '@shared/services/comments.service';
import { FormService } from '@shared/services/form.service';

//  Enums
import {
    ModalButtonType,
    ModalButtonSize,
    eFileFormControls,
    eGeneralActions,
} from '@shared/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Validators
import {
    departmentValidation,
    descriptionValidation,
    titleValidation,
    urlValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

@Component({
    selector: 'app-to-do-modal',
    templateUrl: './to-do-modal.component.html',
    styleUrls: ['./to-do-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Component
        TaAppTooltipV2Component,
        CaModalComponent,
        CaModalButtonComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaUserReviewComponent,
        CaInputDatetimePickerComponent,
        // Pipes
        FormatDatePipe,
    ],
})
export class TodoModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public taskForm: UntypedFormGroup;

    public resDepartments: any[] = [];
    public resCompanyUsers: any[] = [];
    public showCompanyUsers: any[] = [];

    public selectedDepartments: any[] = [];
    public selectedCompanyUsers: any[] = [];

    public taskStatus: EnumValue = null;
    public comments: any[] = [];
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public companyUser: SignInResponse = null;

    public isFormDirty: boolean;

    public taskName: string = null;

    public addNewAfterSave: boolean = false;

    public isCardAnimationDisabled: boolean = false;

    private destroy$ = new Subject<void>();
    public svgRoutes = SharedSvgRoutes;
    public activeAction: string;

    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;
    public taModalActionEnum = TaModalActionEnum;
    public data: TodoResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private todoService: TodoService,
        private commentsService: CommentsService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.createForm();
        this.getTaskDropdowns();

        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            title: [null, [Validators.required, ...titleValidation]],
            description: [null, descriptionValidation],
            url: [null, urlValidation],
            deadline: [null],
            departmentIds: [null, [...departmentValidation]],
            departmentIdsHelper: [null, Validators.required],
            companyUserIds: [null],
            companyUserIdsHeleper: [null],
            note: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.taskForm.get('url'),
            'url',
            this.destroy$
        );
    }

    public onModalAction(action: string) {
        this.activeAction = action;
        switch (action) {
            case TaModalActionEnum.CLOSE: {
                this.ngbActiveModal.close();
                break;
            }
            case TaModalActionEnum.SAVE_AND_ADD_NEW: {
                if (this.taskForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.taskForm);
                    return;
                }
                this.addTask();
                this.addNewAfterSave = true;
                break;
            }
            case TaModalActionEnum.SAVE: {
                if (this.taskForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.taskForm);
                    return;
                }
                if (this.editData?.type === eGeneralActions.EDIT) {
                    this.updateTaskById(this.editData.id);
                } else {
                    this.addTask();
                }
                break;
            }
            case TaModalActionEnum.DELETE: {
                this.deleteTaskById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: eGeneralActions.DELETE,
                    status: true,
                    close: false,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public changeCommentsEvent(comments: ReviewComment) {
        switch (comments.action) {
            case eGeneralActions.DELETE: {
                this.deleteComment(comments);
                break;
            }
            case eGeneralActions.ADD: {
                this.addComment(comments);
                break;
            }
            case eGeneralActions.UPDATE: {
                this.updateComment(comments);
                break;
            }
            default: {
                break;
            }
        }
    }

    public createComment() {
        if (this.comments.some((item) => item.isNewReview)) {
            return;
        }

        this.comments.unshift({
            companyUser: {
                fullName: this.companyUser.firstName.concat(
                    ' ',
                    this.companyUser.lastName
                ),
                /*     avatar: this.companyUser.avatar, */
            },
            commentContent: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewReview: true,
        });
    }

    private addComment(comments: ReviewComment) {
        const comment: CreateCommentCommand = {
            entityTypeCommentId: 1,
            entityTypeId: this.editData.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .createComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.comments = comments.sortData.map((item, index) => {
                        if (index === 0) {
                            return {
                                ...item,
                                id: res.id,
                            };
                        }
                        return item;
                    });
                },
                error: () => {},
            });
    }

    private updateComment(comments: ReviewComment) {
        this.comments = comments.sortData;

        const comment: UpdateCommentCommand = {
            id: comments.data.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteComment(comments: ReviewComment) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD: {
                this.taskForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case eGeneralActions.DELETE: {
                this.taskForm
                    .get(eFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateTaskById(id: number) {
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });
        const { deadline, ...form } = this.taskForm.value;

        const newData: any = {
            id: id,
            ...form,
            deadline: deadline
                ? MethodsCalculationsHelper.convertDateToBackend(deadline)
                : null,
            departmentIds: this.selectedDepartments
                ? this.selectedDepartments.map((item) => item.id)
                : [],
            companyUserIds: this.selectedCompanyUsers
                ? this.selectedCompanyUsers.map((item) => item.id)
                : [],
            status: this.taskStatus.name,
            files: documents ? documents : this.taskForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.todoService.updateTodo(newData).subscribe({
            next: () => this.ngbActiveModal.close(),
            error: () => (this.activeAction = null),
        });
    }

    private addTask() {
        const { deadline, ...form } = this.taskForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...form,
            deadline: deadline
                ? MethodsCalculationsHelper.convertDateToBackend(deadline)
                : null,
            departmentIds: this.selectedDepartments
                ? this.selectedDepartments.map((item) => item.id)
                : [],
            companyUserIds: this.selectedCompanyUsers
                ? this.selectedCompanyUsers.map((item) => item.id)
                : [],
            files: documents,
        };

        this.todoService.addTodo(newData).subscribe({
            next: () => {
                this.ngbActiveModal.close();
                if (this.addNewAfterSave) {
                }
            },
            error: () => (this.activeAction = null),
        });
    }

    private deleteTaskById(id: number) {
        this.todoService
            .deleteTodoById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    private editTask(id: number) {
        this.todoService
            .getTodoById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TodoResponse) => {
                    this.taskForm.patchValue({
                        title: res.title,
                        description: res.description,
                        url: res.url,
                        deadline: res.deadline
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.deadline
                              )
                            : null,
                        departmentIds: null,
                        departmentIdsHelper: res.departments.length
                            ? JSON.stringify(res.departments)
                            : null,
                        companyUserIds: null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });
                    this.taskName = res.title;
                    this.selectedDepartments = res.departments;
                    this.data = res;

                    this.selectedCompanyUsers = res.todoUsers.map((item) => {
                        return {
                            id: item.companyUserId,
                            name: item.firstName.concat(' ', item.lastName),
                        };
                    });

                    this.taskForm
                        .get('companyUserIdsHeleper')
                        .patchValue(
                            this.selectedCompanyUsers.length
                                ? JSON.stringify(this.selectedCompanyUsers)
                                : null
                        );

                    this.comments = res.comments.map(
                        (item: CommentResponse) => {
                            return {
                                ...item,
                                companyUser: {
                                    ...item.companyUser,
                                    /*   avatar: this.companyUser.avatar, */
                                },
                            };
                        }
                    );
                    this.taskStatus = res.status;
                    this.documents = res.files ? (res.files as any) : [];
                    setTimeout(() => {
                        this.startFormChanges();
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getTaskDropdowns() {
        this.todoService
            .getTodoDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TodoModalResponse) => {
                    this.resDepartments = res.departments;
                    this.showCompanyUsers = res.companyUsers.map((item) => {
                        return {
                            id: item.id,
                            name: item.fullName,
                            departmentId: item.departmentId,
                        };
                    });
                    this.resCompanyUsers = [...this.showCompanyUsers];

                    if (this.editData?.type === eGeneralActions.EDIT) {
                        this.isCardAnimationDisabled = true;
                        this.editTask(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    public onSelectDropDown(event: any[], action: string) {
        switch (action) {
            case 'res-department': {
                this.resCompanyUsers = [...this.showCompanyUsers];
                this.selectedDepartments = [...event];
                let usersForDepartment = [];

                this.selectedDepartments.map((item) => {
                    const depUsers = this.resCompanyUsers.filter(
                        (user) => user.departmentId == item.id
                    );

                    if (depUsers?.length) {
                        usersForDepartment.push(depUsers[0]);
                    }
                });

                this.taskForm
                    .get('departmentIdsHelper')
                    .patchValue(
                        this.selectedDepartments.length
                            ? JSON.stringify(this.selectedDepartments)
                            : null
                    );

                if (this.selectedDepartments?.length) {
                    this.resCompanyUsers = [...usersForDepartment];
                } else {
                    this.resCompanyUsers = [...this.showCompanyUsers];
                }
                break;
            }
            case 'assign-task': {
                this.selectedCompanyUsers = [...event];
                this.taskForm
                    .get('companyUserIdsHeleper')
                    .patchValue(
                        this.selectedCompanyUsers.length
                            ? JSON.stringify(this.selectedCompanyUsers)
                            : null
                    );

                break;
            }
            default: {
                break;
            }
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.taskForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
