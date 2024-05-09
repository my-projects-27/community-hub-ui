import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnsRegisterComponent } from './txns-register.component';

describe('TxnsRegisterComponent', () => {
  let component: TxnsRegisterComponent;
  let fixture: ComponentFixture<TxnsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxnsRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TxnsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
