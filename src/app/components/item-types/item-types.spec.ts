import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypes } from './item-types';

describe('ItemTypes', () => {
  let component: ItemTypes;
  let fixture: ComponentFixture<ItemTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
