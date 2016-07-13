import './login-form.jade';
import './login-form.less';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';


/*****************************************************************************/
/* loginForm: Event Handlers */
/*****************************************************************************/
Template.loginForm.events({
  'submit'(event, instance) {
    event.preventDefault();
    let email = instance.$('#email').val();
    let password = instance.$('#password').val();
    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        instance.$('input').addClass('error');
        instance.state.set('badLogin', true);
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
  },
  badLogin: function() {
    const instance = Template.instance();
    return instance.state.get('badLogin');
  }
});

/*****************************************************************************/
/* loginForm: Lifecycle Hooks */
/*****************************************************************************/
Template.loginForm.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('badLogin', false);

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
