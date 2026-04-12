import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsListeComponent } from './liste';

describe('ReservationsListeComponent', () => {
  let component: ReservationsListeComponent;
  let fixture: ComponentFixture<ReservationsListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsListeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
