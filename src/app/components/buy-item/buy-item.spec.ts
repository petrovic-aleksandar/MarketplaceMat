import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyItem } from './buy-item';

describe('BuyItem', () => {
  let component: BuyItem;
  let fixture: ComponentFixture<BuyItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
