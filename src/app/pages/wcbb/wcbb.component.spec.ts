import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WcbbComponent } from './wcbb.component';

describe('WcbbComponent', () => {
  let component: WcbbComponent;
  let fixture: ComponentFixture<WcbbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WcbbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WcbbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
