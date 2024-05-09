import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnCreationComponent } from './txn-creation.component';

describe('TxnCreationComponent', () => {
  let component: TxnCreationComponent;
  let fixture: ComponentFixture<TxnCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxnCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TxnCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
