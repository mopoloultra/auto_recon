import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';

import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { takeUntil } from 'rxjs/operators';
import { SubTasks} from '../../../../../models/tasks/SubTasks';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {MatSnackBar} from '@angular/material';
import {NewTask} from '../../../../../models/tasks/NewTask';
import {UsersService} from '../../../../../../services/users.service';

@Component({
    selector     : 'scrumboard-board-card-dialog',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardCardDialogComponent implements OnInit, OnDestroy
{
    public SubTasks: SubTasks;
    public NewTask: NewTask;
    public hostHeaderInfo: hostHeaderInfo;
    subTaskLoader = false;
    card: any;
    board: any;
    list: any;
    updatingTaskInfo = false;

    toggleInArray = FuseUtils.toggleInArray;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild('checklistMenuTrigger', {static: false})
    checklistMenu: MatMenuTrigger;

    @ViewChild('newCheckListTitleField', {static: false})
    newCheckListTitleField;

    // Private
    private _unsubscribeAll: Subject<any>;
    private resp: any;
    updatingTask:any;
    response: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ScrumboardCardDialogComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     * @param {ScrumboardService} _scrumboardService
     * @param snackBar
     */
    constructor(
        public matDialogRef: MatDialogRef<ScrumboardCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private _scrumboardService: ScrumboardService,
        public usersService: UsersService,
        private snackBar: MatSnackBar
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.SubTasks = new SubTasks();
        this.SubTasks.hostHeaderInfo = this.hostHeaderInfo;
        this.NewTask = new NewTask();
        this.NewTask.hostHeaderInfo = this.hostHeaderInfo;
        this.updatingTask = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(board => {
                this.board = board;

                this.card = this.board.cards.find((_card) => {
                    return this._data.cardId === _card.id;
                });
                console.log(this.card);


                this.list = this.board.lists.find((_list) => {
                    return this._data.listId === _list.id;
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Remove due date
     */
    removeDueDate(): void
    {
        this.card.due = '';
        this.updateCard();
    }

    /**
     * Toggle subscribe
     */
    toggleSubscribe(): void
    {
        this.card.subscribed = !this.card.subscribed;

        this.updateCard();
    }

    /**
     * Toggle cover image
     *
     * @param attachmentId
     */
    toggleCoverImage(attachmentId): void
    {
        if ( this.card.idAttachmentCover === attachmentId )
        {
            this.card.idAttachmentCover = '';
        }
        else
        {
            this.card.idAttachmentCover = attachmentId;
        }

        this.updateCard();
    }

    /**
     * Remove attachment
     *
     * @param attachment
     */
    removeAttachment(attachment): void
    {
        if ( attachment.id === this.card.idAttachmentCover )
        {
            this.card.idAttachmentCover = '';
        }

        this.card.attachments.splice(this.card.attachments.indexOf(attachment), 1);

        this.updateCard();
    }

    /**
     * Remove checklist
     *
     * @param checklist
     */
    removeChecklist(checklist): void
    {
        this.card.checklists.splice(this.card.checklists.indexOf(checklist), 1);

        this.updateCard();
    }

    /**
     * Update checked count
     *
     * @param list
     */

    updateCount(list): void{
        const checkItems = list;
        let checkedItems = 0;
        let allCheckedItems = 0;
        let allCheckItems = 0;

        for ( const checkItem of checkItems )
        {
            if ( checkItem.isChecked )
            {
                checkedItems++;
            }
        }

        this.card.checkItemsChecked = checkedItems;


        allCheckItems += this.card.SubTasks.length;
        allCheckedItems += this.card.checkItemsChecked;


        this.card.checkItems = allCheckItems;
        this.card.checkItemsChecked = allCheckedItems;
    }
    updateCheckedCount(list, subTasksSelected): void
    {
        console.log(subTasksSelected);
        this.updatingTask = subTasksSelected.id;

        this.SubTasks.createdByUserID = this._scrumboardService.getSession('userDetails').id;
        this.SubTasks.description = '';
        this.SubTasks.isComplete = true;
        this.SubTasks.name = subTasksSelected.name;
        this.SubTasks.taskID = this.card.id;
        this.SubTasks.isActiveFlag = true;
        this.SubTasks.id = subTasksSelected.id;

        this._scrumboardService.subTasks(this.SubTasks).then(res => {
            this.resp = res;
            if (this.resp.hostHeaderInfo.responseCode === '000'){
                this.updatingTask = '';
                this.updateCount(list);

            }else{
                this.updatingTask = '';
                this.showToast(this.resp.hostHeaderInfo.responseMessage);
            }
        });



    }

    /**
     * Remove checklist item
     *
     * @param checkItem
     * @param checklist
     */
    removeChecklistItem(checkItem, checklist): void
    {
        // checklist.checkItems.splice(checklist.checkItems.indexOf(checkItem), 1);
        //
        // this.updateCheckedCount(checklist);

        this.updateCard();
    }

    /**
     * Add check item
     *
     * @param {NgForm} form
     * @param checkList
     */
    // tslint:disable-next-line:no-shadowed-variable
    addCheckItem(form: NgForm, SubTasks): void
    {
        this.subTaskLoader = true;
        const checkItemVal = form.value.checkItem;

        if ( !checkItemVal || checkItemVal === '' )
        {
            return;
        }

        const newCheckItem = {
            name   : checkItemVal,
            isChecked: false
        };

        this.SubTasks.createdByUserID = this._scrumboardService.getSession('userDetails').id;
        this.SubTasks.description = '';
        this.SubTasks.isComplete = false;
        this.SubTasks.name = newCheckItem.name;
        this.SubTasks.taskID = this.card.id;
        this.SubTasks.isActiveFlag = true;

        this._scrumboardService.subTasks(this.SubTasks).then(res => {
            this.resp = res;
            this.subTaskLoader = true;
            if (this.resp.hostHeaderInfo.responseCode === '000'){
                this.subTaskLoader = false;
                SubTasks.push(newCheckItem);
                this.updateCount(SubTasks);
                form.setValue({checkItem: ''});
            }else{
                this.showToast(this.resp.hostHeaderInfo.responseMessage);
                this.subTaskLoader = false;
            }
        });

    }

    /**
     * Add checklist
     *
     * @param {NgForm} form
     */
    addChecklist(form: NgForm): void
    {
        this.card.checklists.push({
            id               : FuseUtils.generateGUID(),
            name             : form.value.checklistTitle,
            checkItemsChecked: 0,
            checkItems       : []
        });

        form.setValue({checklistTitle: ''});
        form.resetForm();
        this.checklistMenu.closeMenu();
        this.updateCard();
    }

    /**
     * On checklist menu open
     */
    onChecklistMenuOpen(): void
    {
        setTimeout(() => {
            this.newCheckListTitleField.nativeElement.focus();
        });
    }

    /**
     * Add new comment
     *
     * @param {NgForm} form
     */
    addNewComment(form: NgForm): void
    {
        const newCommentText = form.value.newComment;

        const newComment = {
            idMember: '36027j1930450d8bf7b10158',
            message : newCommentText,
            time    : 'now'
        };

        this.card.comments.unshift(newComment);

        form.setValue({newComment: ''});

        this.updateCard();
    }

    /**
     * Remove card
     */
    removeCard(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the card?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.matDialogRef.close();
                // this._scrumboardService.removeCard(this.card.id, this.list.id);
            }
        });
    }

    /**
     * Update card
     */
    updateCard(): void
    {
        console.log(this.card.idLabels);
        // this._scrumboardService.updateCard(this.card);
    }

    updateTask(): void
    {
        this.updatingTaskInfo = true;
        this.NewTask.description = this.card.description;
        this.NewTask.taskID = this.card.id;
        this.NewTask.todoID = this.board.id;
        this.NewTask.name = this.card.name;
        this.NewTask.statusID = 1;
        this.NewTask.vehicleID = 0;
        this.NewTask.phaseID = this.list.id;
        this.NewTask.tagIDs = this.card.idLabels;
        this.NewTask.assignedUserIDs = this.card.idMembers;
        this.NewTask.dueDate = this.card.due;
        this.NewTask.companyID = this.usersService.getSession('companyInfo').id;
        this.NewTask.createdByUserID = this.usersService.getSession('userDetails').id;
        this.NewTask.startDate = '04/01/2020';

        console.log(this.card.description);
        this._scrumboardService.updateTask(this.NewTask).then(resp => {
            this.response = resp;
            if (this.response.hostHeaderInfo.responseCode === '000'){
                this.showToast(this.response.hostHeaderInfo.responseMessage);
                this.updatingTaskInfo = false;
            }else{
                this.showToast(this.response.hostHeaderInfo.responseMessage);
                this.updatingTaskInfo = false;
            }

            console.log(resp);
        } );
    }

    showToast(message): void{
        this.snackBar.open(message, 'X', {
            duration: 3000,
        });
    }
}
