import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsByType } from './items-by-type';

describe('ItemsByType', () => {
  let component: ItemsByType;
  let fixture: ComponentFixture<ItemsByType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsByType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsByType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
