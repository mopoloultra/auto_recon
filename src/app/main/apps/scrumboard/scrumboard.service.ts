import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, throwError  } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ScrumboardService implements Resolve<any>
{
    boards: any[];
    routeParams: any;
    board: any;

    onBoardsChanged: BehaviorSubject<any>;
    onBoardChanged: BehaviorSubject<any>;

    url: any = '';
    headers: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onBoardsChanged = new BehaviorSubject([]);
        this.onBoardChanged = new BehaviorSubject([]);
        this.url = environment.url;
    }


    getSession(key: string): any{
        const stringifiedValue = sessionStorage.getItem(key);
        try {
            const obj = JSON.parse(stringifiedValue);
            return obj;

        } catch (error) {
            return stringifiedValue;
        }

    }

    getHeaders(): HttpHeaders{
        const headers = new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Swift ' + this.getSession('userToken'),
        });

        return headers;
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getBoards()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get boards
     *
     * @returns {Promise<any>}
     */
    getBoards(): Promise<any>
    {

        const todoData =  localStorage.getItem('scrumData');


        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/getTaskScrum', todoData, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    const data = [];
                    data.push(response);
                    this.boards = data;
                    this.onBoardsChanged.next(this.boards);
                    resolve(this.boards);
                }, reject);
        });
    }

    /**
     * Get board
     *
     * @param boardId
     * @returns {Promise<any>}
     */
    getBoard(boardId): Promise<any>
    {
        const todoData =  localStorage.getItem('scrumData');
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/getTaskScrum', todoData, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.board = response;
                    this.board.settings = ' {\n' +
                        '                \'color\': \'blue-grey\',\n' +
                        '                \'subscribed\': false,\n' +
                        '                \'cardCoverImages\': true\n' +
                        '            }';

                    this.board.activities = [];
                    this.board.comments = [];
                    this.onBoardChanged.next(this.board);
                    console.log(this.board);
                    resolve(this.board);
                }, reject);
        });
    }



    getBoardData(boardId): Promise<any>
    {
        const todoData =  localStorage.getItem('scrumData');
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/getTaskScrum', todoData, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.board = response;
                    this.board.settings = ' {\n' +
                        '                \'color\': \'blue-grey\',\n' +
                        '                \'subscribed\': false,\n' +
                        '                \'cardCoverImages\': true\n' +
                        '            }';

                    this.board.activities = [];
                    this.board.comments = [];
                    resolve(this.board);
                }, reject);
        });
    }

    /**
     * Update board
     *
     * @returns {Promise<any>}
     */


    updateBoard(): Promise<any>
    {
        const todoData =  localStorage.getItem('scrumData');
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/getTaskScrum', todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    this.board = response;
                    this.board.settings = ' {\n' +
                        '                \'color\': \'blue-grey\',\n' +
                        '                \'subscribed\': false,\n' +
                        '                \'cardCoverImages\': true\n' +
                        '            }';

                    this.board.activities = [];
                    this.board.comments = [];
                    this.onBoardChanged.next(this.board);
                    resolve(this.board);
                }, reject);
        });
    }

    updateTaskPhase(todoData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/updateTaskPhase' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }

    newTask(todoData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/createNewTask' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }

    subTasks(todoData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/createUpdateSubTask' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }





    /**
     * Add card
     *
     * @param listId
     * @param newCard
     * @returns {Promise<any>}
     */
    addCard(listId, newCard): Promise<any>
    {
        this.board.lists.map((list) => {
            if ( list.id === listId )
            {
                return list.idCards.push(newCard.id);
            }
        });

        this.board.cards.push(newCard);

        return this.updateBoard();
    }

    /**
     * Add list
     *
     * @param newList
     * @returns {Promise<any>}
     */
    addList(newList): Promise<any>
    {
        this.board.lists.push(newList);

        return this.updateBoard();
    }

    /**
     * Remove list
     *
     * @param listId
     * @returns {Promise<any>}
     */
    removeList(listId): Promise<any>
    {
        const list = this.board.lists.find((_list) => {
            return _list.id === listId;
        });

        for ( const cardId of list.idCards )
        {
            this.removeCard(cardId);
        }

        const index = this.board.lists.indexOf(list);

        this.board.lists.splice(index, 1);

        return this.updateBoard();
    }

    /**
     * Remove card
     *
     * @param cardId
     * @param listId
     */
    removeCard(cardId, listId?): void
    {
        const card = this.board.cards.find((_card) => {
            return _card.id === cardId;
        });

        if ( listId )
        {
            const list = this.board.lists.find((_list) => {
                return listId === _list.id;
            });
            list.idCards.splice(list.idCards.indexOf(cardId), 1);
        }

        this.board.cards.splice(this.board.cards.indexOf(card), 1);

        this.updateBoard();
    }

    updateTask(todoData){
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/tasks/createNewTask' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }



    /**
     * Update card
     *
     * @param newCard
     */
    updateCard(newCard): void
    {
        this.board.cards.map((_card) => {
            if ( _card.id === newCard.id )
            {
                return newCard;
            }
        });

        this.updateBoard();
    }

    /**
     * Create new board
     *
     * @param board
     * @returns {Promise<any>}
     */
    createNewBoard(board): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/scrumboard-boards/' + board.id, board)
                .subscribe(response => {
                    resolve(board);
                }, reject);
        });
    }


}

@Injectable()
export class BoardResolve implements Resolve<any>
{
    /**
     * Constructor
     *
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private _scrumboardService: ScrumboardService
    )
    {
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @returns {Promise<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Promise<any>
    {
        return this._scrumboardService.getBoard(route.paramMap.get('boardId'));
    }

    getSession(key: string): any{
        const stringifiedValue = sessionStorage.getItem(key);
        try {
            const obj = JSON.parse(stringifiedValue);
            return obj;

        } catch (error) {
            return stringifiedValue;
        }

    }





}
