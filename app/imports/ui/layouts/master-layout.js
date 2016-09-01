import '../pages/banner.js';
import '../pages/footer.js';
import './master-layout.html';
import './master-layout.less';

import { Template } from 'meteor/templating';

Template.MasterLayout.onCreated(function () {
    window.HTML.isConstructedObject = function(x) { return _.isObject(x) && !$.isPlainObject(x); };
});
