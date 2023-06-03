import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesDialogComponent } from './activities-dialog.component';

describe('ActivitiesDialogComponent', () => {
  let component: ActivitiesDialogComponent;
  let fixture: ComponentFixture<ActivitiesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
