// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kochonApp', ['ionic', 'ngCordova', 'kochonApp.controllers', 'kochonApp.services'])

.run(function($ionicPlatform, $cordovaStatusbar, $location, CoreSvc) {
  $ionicPlatform.ready(function() {


    /**
     * 현재 프로그램 번호 저장
     */
    CoreSvc.GetCurrentProgram().then(function(res) {
      if(res.dataInfo) {
        localStorage.setItem('prgID', res.dataInfo.ID);
        localStorage.setItem('dtEnd', res.dataInfo.dt_end);
      } else {
        alert("프로그램 설정을 먼저 해주세요.");
      }
    })
    .catch(function(error) {
      alert(error.response.error.msgKo);
    });

    // Lock orientation
    screen.lockOrientation('landscape');

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }







  });
})

.config(function($stateProvider, $urlRouterProvider) {



  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html'
    }) .state('start', {
      url: '/start',
      templateUrl: 'templates/start.html'
    })
    .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');



}).
    filter('htmlToPlaintext', function() {
      return function(text) {
        return angular.element(text).text();
      };
    }
).
//value('api', 'http://192.168.0.2:9002/v1');
value('api', 'http://192.168.0.9:9115/v1');