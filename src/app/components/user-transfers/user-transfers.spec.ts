import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransfers } from './user-transfers';

describe('UserTransfers', () => {
  let component: UserTransfers;
  let fixture: ComponentFixture<UserTransfers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTransfers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTransfers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
