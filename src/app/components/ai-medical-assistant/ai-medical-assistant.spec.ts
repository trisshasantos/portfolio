import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMedicalAssistant } from './ai-medical-assistant';

describe('AiMedicalAssistant', () => {
  let component: AiMedicalAssistant;
  let fixture: ComponentFixture<AiMedicalAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMedicalAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMedicalAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
