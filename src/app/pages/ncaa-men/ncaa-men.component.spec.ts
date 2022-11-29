import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcaaMenComponent } from './ncaa-men.component';

describe('NcaaMenComponent', () => {
  let component: NcaaMenComponent;
  let fixture: ComponentFixture<NcaaMenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NcaaMenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NcaaMenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
