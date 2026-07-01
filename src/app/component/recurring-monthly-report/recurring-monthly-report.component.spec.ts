import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringMonthlyReportComponent } from './recurring-monthly-report.component';

describe('RecurringMonthlyReportComponent', () => {
  let component: RecurringMonthlyReportComponent;
  let fixture: ComponentFixture<RecurringMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringMonthlyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
