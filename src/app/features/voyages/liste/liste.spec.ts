import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageComponent } from './liste';

describe('VoyageComponent', () => {
  let component: VoyageComponent;
  let fixture: ComponentFixture<VoyageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoyageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
