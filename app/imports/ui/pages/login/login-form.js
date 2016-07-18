import './login-form.jade';
import './login-form.less';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import 'meteor/mizzao:bootboxjs';


/*****************************************************************************/
/* loginForm: Event Handlers */
/*****************************************************************************/
Template.loginForm.events({
  'click a.forgot-password'(event, instance) {
    event.preventDefault();
    bootbox.prompt("Please enter the email address of the account.", (email) => {
      if(email === null) {
        return;
      }
      Meteor.call('users.sendReset', {email}, (error, response) => {
        if(error) { 
          FlashMessages.sendError(error.reason);
          return;
        }
        FlashMessages.sendSuccess("We have sent a password reset to your email");
      });
    });
  },
  'submit'(event, instance) {
    event.preventDefault();
    let email = instance.$('#email').val();
    let password = instance.$('#password').val();
    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        instance.$('input').addClass('error');
        console.error(error);
        if(error.error == 403) {
          FlashMessages.sendError("Incorrect username or password");
        } else {
          FlashMessages.sendError(error.message);
        }

      }
      else {
        FlowRouter.go('harvests');
      }
    });

  }
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
Template.loginForm.onCreated(function() {
  this.state = new ReactiveDict();

  if(Meteor.userId()) {
    FlowRouter.go('harvests');
  }
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
