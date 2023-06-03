import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tasks-view',
  templateUrl: './tasks-view.component.html',
  styleUrls: ['./tasks-view.component.scss']
})
export class TasksViewComponent implements OnInit {

  todoId: any;
  constructor(private _activatedRoute: ActivatedRoute) {
    _activatedRoute.params.subscribe(params => {
      this.todoId = params['todoId'];
      console.log(this.todoId)

    });
  }

  ngOnInit(): void {
  }

}
