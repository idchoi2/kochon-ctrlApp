angular.module('kochonApp.services', [])

    .service('CoreSvc', function($http, $q, api) {

        /**
         * 컨트롤러 접속
         * @param idCode
         * @param name
         * @param ctrlNo
         * @returns {*}
         * @constructor
         */
        this.Connect = function (idCode, name, ctrlNo) {
            var deferred = $q.defer();
            $http({
                url : api + "/ctrl/connect",
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                data : $.param({idCode: idCode, name: name, ctrlNo: ctrlNo, prgID: this.GetProgID()})
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };

        /**
         * 컨트롤러 접속 끊기
         * @returns {*}
         * @constructor
         */
        this.Disconnect = function () {
            var deferred = $q.defer();
            $http({
                url : api + "/ctrl/disconnect",
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                data : $.param({teamID: this.GetTeamID()})
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };

        /**
         * 컨트롤러 현황 업데이트
         * @param missionPer
         * @param missionCur
         * @param vacName
         * @returns {*}
         * @constructor
         */
        this.Update = function (missionPer, missionCur, vacName) {
            var deferred = $q.defer();
            $http({
                url : api + "/ctrl/update",
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                data : $.param({teamID: this.GetTeamID(), missionPer: missionPer, missionCur: missionCur, vacName: vacName})
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };


        this.Action = function (isFinalStep, isPrint, ctrlNo, vacName) {
            var deferred = $q.defer();
            $http({
                url : api + "/ctrl/action",
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                data : $.param({prgID: this.GetProgID(), teamID: this.GetTeamID(), ctrlNo: ctrlNo, isFinalStep: isFinalStep, isPrint: isPrint, vacName: vacName})
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };


        /**
         * 현재 진행 프로그램 불러오기
         * @returns {*}
         * @constructor
         */
        this.GetCurrentProgram = function () {
            var deferred = $q.defer();
            $http({
                url : api + "/prg/current",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                method : 'GET'
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };

        /**
         * 팀 리스트 불러오기
         * @returns {*}
         * @constructor
         */
        this.GetTeams = function () {
            var deferred = $q.defer();
            $http({
                url : api + "/prg/users",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                method : 'GET'
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(result) {
                deferred.reject(result);
            });
            return deferred.promise;
        };



        this.isLogin = function() {
            return this.GetTeamID() && this.GetProgID() && this.GetTeamName() && this.GetCodeID();
        };

        this.GetTeamID = function() {
            return localStorage.getItem('teamID');
        };

        this.GetProgID= function() {
            return localStorage.getItem('prgID');
        };

        this.GetTeamName = function() {
            return localStorage.getItem('name');
        };

        this.GetCodeID = function() {
            return localStorage.getItem('idCode');
        };

        this.GetDtStart = function() {
            return localStorage.getItem('dtStart');
        };

        this.GetDtEnd = function() {
            return localStorage.getItem('dtEnd');
        };




        this.SetMissionArchive = function(curMisn, curPage) {

        };



    })
    .service('MisnSvc', function($http, $q, api) {


        this.GetMissionArchive = function() {
            return JSON.parse(localStorage.getItem('misnArch'));
        };


        this.SaveMissionArchiveStep = function(curMisnNo, curStep) {
            var curMisnArchive = this.GetMissionArchive();
            curMisnArchive[curMisnNo].curStep = curStep;
            localStorage.setItem('misnArch', JSON.stringify(curMisnArchive));
        };

        this.SaveMissionArchivePage = function(curMisnNo, curPage) {
            var curMisnArchive = this.GetMissionArchive();
            curMisnArchive[curMisnNo].curPage = curPage;
            localStorage.setItem('misnArch', JSON.stringify(curMisnArchive));
        };


        this.GetMissionPercent = function(curMisnNo, curPage) {

            var curMisnArchive = this.GetMissionArchive();
            return parseInt(100* curPage / curMisnArchive[curMisnNo].totPage);

        };


        this.GetAllMissionsPercent = function() {

            var totalPage = 0, completedPage = 0;

            angular.forEach(this.GetMissionArchive(), function(value, key) {
                totalPage += value.totPage;
                completedPage += value.curPage;
            });

            return parseInt(100 * completedPage / totalPage);
        };
    });