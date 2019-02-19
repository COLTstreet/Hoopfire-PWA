import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbbBracketComponent } from './cbb-bracket.component';

describe('CbbBracketComponent', () => {
  let component: CbbBracketComponent;
  let fixture: ComponentFixture<CbbBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbbBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbbBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
