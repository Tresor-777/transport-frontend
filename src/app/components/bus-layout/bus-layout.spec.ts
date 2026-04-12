import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusLayout } from './bus-layout';

describe('BusLayout', () => {
  let component: BusLayout;
  let fixture: ComponentFixture<BusLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(BusLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
