import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeFormComponent } from './payee-form.component';

describe('PayeeFormComponent', () => {
  let component: PayeeFormComponent;
  let fixture: ComponentFixture<PayeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayeeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
