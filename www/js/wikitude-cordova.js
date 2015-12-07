/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // represents the device capability of launching ARchitect Worlds with specific features
    isDeviceSupported: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
    },
    // --- Wikitude Plugin ---
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(example) {
        // check if the current device is able to launch ARchitect Worlds
        app.wikitudePlugin.isDeviceSupported(function() {
            app.wikitudePlugin.setOnUrlInvokeCallback(app.onUrlInvoke);
            // inject poi data using phonegap's GeoLocation API and inject data using World.loadPoisFromJsonData
            if ( example.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
                navigator.geolocation.getCurrentPosition(onLocationUpdated, onLocationError);
            }

            app.wikitudePlugin.loadARchitectWorld(function successFn(loadedURL) {
                /* Respond to successful world loading if you need to */
            }, function errorFn(error) {
                alert('AR 프로그램에 오류가 있습니다: ' + error);
            },
            example.path, example.requiredFeatures, example.startupConfiguration
            );
        }, function(errorMessage) {
            alert(errorMessage);
        },
        example.requiredFeatures
        );
    },
    urlLauncher: function(url) {
        var world = {
            "path": url, 
            "requiredFeatures": [
                "2d_tracking",
                "geo"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        };
        app.loadARchitectWorld(world);
    },
    // This function gets called if you call "document.location = architectsdk://" in your ARchitect World
    onUrlInvoke: function (url) {

        var _MisnNo = url.substring(26, 27);
        var _itemNo = url.substring(28);




        var appElement = document.querySelector('[ng-controller=CoreCtrl]');
        var $scope = angular.element(appElement).scope();
        /*
        $scope.$apply(function() {
            $scope.ar3_1 = 1;
        });
        */

        // 미션 번호에 따라 함수 호출
        if(_MisnNo == 3) {
            $scope.misn.misn3Organ.GetARItem(_itemNo);
        } else if(_MisnNo == 4) {
            $scope.misn.misn4Quiz.GetARItem(_itemNo);
        } else if(_MisnNo == 6) {
            $scope.misn.misn6Cure.GetARItem();
        } else {

        }



        app.wikitudePlugin.close();
    },
    // Callback if your AR experience loaded successful
    onARExperienceLoadedSuccessful: function(loadedURL) {
        /* Respond to successful augmented reality experience loading if you need to */
        app.wikitudePlugin.callJavaScript('createCircle(new AR.RelativeLocation(null, -10, 0), \'#97FF18\');');
    },
    // Callback if your AR experience did not load successful
    onARExperienceLoadError: function(errorMessage) {
        alert('Loading AR web view failed: ' + errorMessage);
    }
    // --- End Wikitude Plugin ---
};

app.initialize();
