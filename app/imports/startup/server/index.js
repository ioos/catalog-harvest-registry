// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';
// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';


import './register-harvests-api.js';

import './register-organizations-api.js';

// Google Analytics:
import { Inject } from 'meteor/meteorhacks:inject-initial';

let gaInit = '';
if (Meteor.settings.public.mode !== 'test') {
    gaInit = `
    <!-- Start Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.googleAnalyticsID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', "${process.env.googleAnalyticsID}");
    </script>
    <!-- End Google Analytics -->`;
}

Inject.rawHead('Inject the Google Analytics script at the beginning of the head', gaInit);