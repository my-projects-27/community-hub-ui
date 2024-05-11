import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnApprovalsComponent } from './txn-approvals.component';

describe('TxnApprovalsComponent', () => {
  let component: TxnApprovalsComponent;
  let fixture: ComponentFixture<TxnApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxnApprovalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TxnApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
