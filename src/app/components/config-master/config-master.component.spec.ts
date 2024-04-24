import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMasterComponent } from './config-master.component';

describe('ConfigMasterComponent', () => {
  let component: ConfigMasterComponent;
  let fixture: ComponentFixture<ConfigMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
