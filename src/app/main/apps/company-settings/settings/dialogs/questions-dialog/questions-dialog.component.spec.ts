import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsDialogComponent } from './questions-dialog.component';

describe('QuestionsDialogComponent', () => {
  let component: QuestionsDialogComponent;
  let fixture: ComponentFixture<QuestionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
