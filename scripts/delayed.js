// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
var scriptElement = document.createElement('script');
scriptElement.src = 'https://assets.adobedtm.com/21b53c73144b/85a96e35869a/launch-47de65da9546-development.min.js';
scriptElement.async = true;
document.head.appendChild(scriptElement);
