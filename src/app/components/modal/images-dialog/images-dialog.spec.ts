import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesDialog } from './images-dialog';

describe('ImagesDialog', () => {
  let component: ImagesDialog;
  let fixture: ComponentFixture<ImagesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
