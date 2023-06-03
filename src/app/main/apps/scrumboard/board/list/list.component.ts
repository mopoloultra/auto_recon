import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { Card } from 'app/main/apps/scrumboard/card.model';
import { ScrumboardCardDialogComponent } from 'app/main/apps/scrumboard/board/dialogs/card/card.component';
import { UpdateTaskPhase} from '../../../../models/tasks/UpdateTaskPhase';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {ProcessingDialogComponent} from '../dialogs/processing-dialog/processing-dialog.component';
import {MatSnackBar} from '@angular/material';
import {AddTaskComponent} from '../dialogs/add-task/add-task.component';

@Component({
    selector     : 'scrumboard-board-list',
    templateUrl  : './list.component.html',
    styleUrls    : ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardListComponent implements OnInit, OnDestroy
{
    board: any;
    dialogRef: any;

    @Input()
    list;

    @ViewChild(FusePerfectScrollbarDirective, {static: false})
    listScroll: FusePerfectScrollbarDirective;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    public hostHeaderInfo: hostHeaderInfo;
    public UpdateTaskPhase: UpdateTaskPhase;
    resp: any;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {ScrumboardService} _scrumboardService
     * @param {MatDialog} _matDialog
     * @param todoserviceService
     * @param router
     * @param snackBar
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _scrumboardService: ScrumboardService,
        private _matDialog: MatDialog,
        private todoserviceService: TodoserviceService,
        private router: Router,
        private snackBar: MatSnackBar
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.hostHeaderInfo = new hostHeaderInfo();
        this.UpdateTaskPhase = new UpdateTaskPhase();
        this.UpdateTaskPhase.hostHeaderInfo = this.hostHeaderInfo;
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
     * On list name changed
     *
     * @param newListName
     */
    onListNameChanged(newListName): void
    {
        this.list.name = newListName;
    }

    /**
     * On card added
     *
     * @param newCardName
     */
    onCardAdd(newCardName, list): void
    {
        // if ( newCardName === '' )
        // {
        //     return;
        // }
        //
        // this._scrumboardService.addCard(this.list.id, new Card({name: newCardName}));

        setTimeout(() => {
            this.listScroll.scrollToBottom(0, 400);
        });
    }

    /**
     * Remove list
     *
     * @param listId
     */
    removeList(listId): void
    {
        // this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        //     disableClose: false
        // });
        //
        // this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the list and it\'s all cards?';
        //
        // this.confirmDialogRef.afterClosed().subscribe(result => {
        //     if ( result )
        //     {
        //         this._scrumboardService.removeList(listId);
        //     }
        // });
    }

    /**
     * Open card dialog
     *
     * @param cardId
     */
    openCardDialog(cardId): void
    {
        this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
            panelClass: 'scrumboard-card-dialog',
            data      : {
                cardId: cardId,
                listId: this.list.id
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    /**
     * On drop
     *
     * @param ev
     * @param list
     */
    onDrop(ev, list): void
    {

        let dialogRef = this._matDialog.open(ProcessingDialogComponent, {
            width: '100px',
            height: '100px',
            disableClose: false
        });

        this.UpdateTaskPhase.ID = ev.value;
        this.UpdateTaskPhase.phaseID = list;
        this.UpdateTaskPhase.createdByUserID = this._scrumboardService.getSession('userDetails').id;
        this._scrumboardService.updateTaskPhase(this.UpdateTaskPhase).then(res => {
            this.resp = res;
            if (this.resp.hostHeaderInfo.responseCode === '000'){
                dialogRef.close();
                setTimeout(() => {
                    this.listScroll.scrollToTop(0, 400);
                });

            }else{

                this.showToast(this.resp.hostHeaderInfo.responseMessage);
                dialogRef.close();
            }
            console.log(res);
        });
    }

    showToast(message): void{
        this.snackBar.open(message, 'X', {
            duration: 3000,
        });
    }

    addTask(id): void{
        let todoId;
        this._activatedRoute.params.subscribe(params => {
            todoId = params['boardId'];
            const dialogRef = this._matDialog.open(AddTaskComponent, {
                width: '650px',
                height: '650px',
                data: {todoID: todoId, phaseID: id}
            });

            dialogRef.componentInstance.onSucess.subscribe(res => {

                    this._scrumboardService.getBoardData(todoId).then(data => {
                        this.board = data;

                });
                
            });
        });



    }
}
