import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomsBabyComponent } from './moms-baby.component';

describe('MomsBabyComponent', () => {
  let component: MomsBabyComponent;
  let fixture: ComponentFixture<MomsBabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomsBabyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomsBabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
