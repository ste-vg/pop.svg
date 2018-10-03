import './index.scss';
import { App } from './app/app';

let container = document.getElementById('app');
if(container) new App(container);