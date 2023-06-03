import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipointUploadDialogComponent } from './multipoint-upload-dialog.component';

describe('MultipointUploadDialogComponent', () => {
  let component: MultipointUploadDialogComponent;
  let fixture: ComponentFixture<MultipointUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipointUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipointUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
