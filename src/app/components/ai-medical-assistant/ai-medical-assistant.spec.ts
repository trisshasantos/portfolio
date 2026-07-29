import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMedicalAssistantComponent } from './ai-medical-assistant';

describe('AiMedicalAssistantComponent', () => {
  let component: AiMedicalAssistantComponent;
  let fixture: ComponentFixture<AiMedicalAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMedicalAssistantComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMedicalAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
