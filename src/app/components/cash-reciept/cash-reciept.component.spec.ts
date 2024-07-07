import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRecieptComponent } from './cash-reciept.component';

describe('CashRecieptComponent', () => {
  let component: CashRecieptComponent;
  let fixture: ComponentFixture<CashRecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashRecieptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
