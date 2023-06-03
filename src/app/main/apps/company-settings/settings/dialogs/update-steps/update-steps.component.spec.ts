import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStepsComponent } from './update-steps.component';

describe('UpdateStepsComponent', () => {
  let component: UpdateStepsComponent;
  let fixture: ComponentFixture<UpdateStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
