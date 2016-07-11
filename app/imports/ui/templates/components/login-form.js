import './login-form.jade';
import './login-form.less';
import { Template } from 'meteor/templating';


Template.loginForm.touch = function() {
};

/*****************************************************************************/
/* loginForm: Event Handlers */
/*****************************************************************************/
Template.loginForm.events({
});

/*****************************************************************************/
/* loginForm: Helpers */
/*****************************************************************************/
Template.loginForm.helpers({
  height: function() {
    return Session.get('height');
  }
});

/*****************************************************************************/
/* loginForm: Lifecycle Hooks */
/*****************************************************************************/
Template.loginForm.onCreated(() => {
});

Template.loginForm.onRendered(function() {
  var self = this;

  var h = $(window).height() - 720;
  h = h > 350 ? h : 350;

  this.$('.login-form .form-region').height(h);

  $(window).resize(function(event) {
    var h = $(window).height() - 720;
    h = h > 350 ? h : 350;

    this.$('.login-form .form-region').height(h);
  });
});

Template.loginForm.onDestroyed(() => {
});
