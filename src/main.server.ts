import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser'; // Suppression de BootstrapContext si non utilisé ici
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;