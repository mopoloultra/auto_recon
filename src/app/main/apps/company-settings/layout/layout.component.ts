import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../../services/users.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public usersService: UsersService) { }

  ngOnInit() {
  }

}
