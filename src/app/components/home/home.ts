import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MonographEntry {
  title: string;
  description: string;
  reviewer: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  monographEntries: MonographEntry[] = [
    { title: 'Amoxicillin · Final Review', description: 'Broad-spectrum penicillin antibiotic for bacterial infections.', reviewer: 'T. Santos, RPh' },
    { title: 'Metformin HCl · Revision 2', description: 'First-line oral hypoglycemic for type 2 diabetes mellitus.', reviewer: 'T. Santos, RPh' },
    { title: 'Omeprazole · QC Check', description: 'Proton pump inhibitor for GERD and peptic ulcer disease.', reviewer: 'T. Santos, RPh' },
    { title: 'Atorvastatin · Draft 5', description: 'HMG-CoA reductase inhibitor for hyperlipidemia management.', reviewer: 'T. Santos, RPh' },
    { title: 'Losartan Potassium · Update', description: 'Angiotensin II receptor blocker for hypertension.', reviewer: 'T. Santos, RPh' },
    { title: 'Salbutamol · Editorial', description: 'Short-acting beta-2 agonist for acute bronchospasm relief.', reviewer: 'T. Santos, RPh' },
    { title: 'Ceftriaxone · Monograph v2', description: 'Third-generation cephalosporin for severe infections.', reviewer: 'T. Santos, RPh' },
    { title: 'Amlodipine · Draft 3', description: 'Calcium channel blocker for hypertension and angina.', reviewer: 'T. Santos, RPh' },
  ];

  currentEntry: MonographEntry = this.monographEntries[0];
  private intervalId: any;

  ngOnInit(): void {
    let index = 0;
    this.intervalId = setInterval(() => {
      index = (index + 1) % this.monographEntries.length;
      this.currentEntry = this.monographEntries[index];
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
