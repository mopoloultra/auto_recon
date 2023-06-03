import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTasksComponent } from './vehicle-tasks.component';

describe('VehicleTasksComponent', () => {
  let component: VehicleTasksComponent;
  let fixture: ComponentFixture<VehicleTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
