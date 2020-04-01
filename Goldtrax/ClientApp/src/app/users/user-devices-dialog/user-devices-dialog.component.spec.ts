import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDevicesDialogComponent } from './user-devices-dialog.component';

describe('UserDevicesDialogComponent', () => {
  let component: UserDevicesDialogComponent;
  let fixture: ComponentFixture<UserDevicesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDevicesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDevicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
