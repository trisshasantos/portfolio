import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Contact } from './components/contact/contact';
import { AiMedicalAssistantComponent } from './components/ai-medical-assistant/ai-medical-assistant';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'skills', component: Skills },
  { path: 'ai-assistant', component: AiMedicalAssistantComponent },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];
