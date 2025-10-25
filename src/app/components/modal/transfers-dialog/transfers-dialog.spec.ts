import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersDialog } from './transfers-dialog';

describe('TransfersDialog', () => {
  let component: TransfersDialog;
  let fixture: ComponentFixture<TransfersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfersDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
