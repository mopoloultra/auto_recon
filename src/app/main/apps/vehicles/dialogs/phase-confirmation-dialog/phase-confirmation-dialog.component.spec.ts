import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseConfirmationDialogComponent } from './phase-confirmation-dialog.component';

describe('PhaseConfirmationDialogComponent', () => {
  let component: PhaseConfirmationDialogComponent;
  let fixture: ComponentFixture<PhaseConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
