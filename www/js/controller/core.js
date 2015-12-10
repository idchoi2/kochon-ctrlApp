angular.module('kochonApp.controllers', [])

    .controller('CoreCtrl', function($scope, $interval, $timeout, $location, $window, $ionicTabsDelegate, $ionicHistory, CoreSvc, MisnSvc) {




        /**
         * 현재 시각 표시
         */
        $scope.date = new Date();

        $interval(function() {
            $scope.date = new Date();
        }, 6000);

        // 팀 정보
        $scope.teamInfo = {};
        $scope.teamInfo.teamID = "";
        $scope.teamInfo.name = "";
        $scope.teamInfo.idCode = "";
        $scope.teamInfo.ctrlNo = 6; // 컨트롤러 번호
        $scope.teamInfo.teamLoadIntv = 5000; // 팀 정보 불러오는 딜레이



        $scope.teamInfo.list = [
            {
                teamID: null, name: "미승인", per: 0
            },
            {
                teamID: null, name: "미승인", per: 0
            },
            {
                teamID: null, name: "미승인", per: 0
            },
            {
                teamID: null, name: "미승인", per: 0
            },
            {
                teamID: null, name: "미승인", per: 0
            },
            {
                teamID: null, name: "미승인", per: 0
            }
        ];

        /**
         * 모든 팀 현황 불러오기
         * @constructor
         */
        $scope.teamInfo.LoadTeams = function() {

            if(CoreSvc.isLogin()) {
                $interval(function() {

                    CoreSvc.GetTeams().then(function(res) {

                        $scope.teamInfo.list = [
                            {
                                teamID: null, name: "미승인", per: 0
                            },
                            {
                                teamID: null, name: "미승인", per: 0
                            },
                            {
                                teamID: null, name: "미승인", per: 0
                            },
                            {
                                teamID: null, name: "미승인", per: 0
                            },
                            {
                                teamID: null, name: "미승인", per: 0
                            },
                            {
                                teamID: null, name: "미승인", per: 0
                            }
                        ];


                        angular.forEach(res.dataList, function(value, key) {
                            $scope.teamInfo.list[value.ctrl_no - 1].teamID = value.ID;
                            $scope.teamInfo.list[value.ctrl_no - 1].name = value.name;
                            $scope.teamInfo.list[value.ctrl_no - 1].per = value.mission_per;
                        });
                    })
                    .catch(function(error) {
                    });
                }, $scope.teamInfo.teamLoadIntv);
            }
        };


        /**
         * 카운트다운
         * @type {{}}
         */
        $scope.countdown = {};


        $scope.countdown.Start = function() {
            var t = CoreSvc.GetDtEnd().split(/[- :]/);
            $scope.dtEndJS = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

            if($scope.dtEndJS - new Date() > 0) {
                var updateClock = function () {
                    $scope.countdown.s = ($scope.dtEndJS - new Date()) / 1000;
                    $scope.countdown = {
                        h: parseInt($scope.countdown.s % 86400 / 3600),
                        m: parseInt($scope.countdown.s % 86400 % 3600 / 60),
                        s: parseInt($scope.countdown.s % 86400 % 3600 % 60)
                    };

                    $scope.countdown.txt = {};
                    $scope.countdown.txt.h = ($scope.countdown.h ? ($scope.countdown.h > 9 ? $scope.countdown.h : "0" + $scope.countdown.h) : "00");
                    $scope.countdown.txt.m = ($scope.countdown.m ? ($scope.countdown.m > 9 ? $scope.countdown.m : "0" + $scope.countdown.m) : "00");
                    $scope.countdown.txt.s = ($scope.countdown.s > 9 ? $scope.countdown.s : "0" + $scope.countdown.s);
                    $scope.countdown.per = 100 - (($scope.dtEndJS - new Date()) / 1000) / (3600 + 1800) * 100;
                };

                setInterval(function () {
                    $scope.$apply(updateClock);
                }, 1000);
                updateClock();
            } else {
                $scope.countdown.txt = {};
                $scope.countdown.txt.h = "00";
                $scope.countdown.txt.m = "00";
                $scope.countdown.txt.s = "00";
            }
        };


        /**
         * 스탑와치
         * @type {{}}
         */
        $scope.stopwatch = {};
        $scope.stopwatch.h = 1;
        $scope.stopwatch.m = 30;
        $scope.stopwatch.s = 0;
        $scope.stopwatch.timer = null;

        /**
         * 스탑와치 생성
         * @constructor
         */
        $scope.stopwatch.Load = function() {

            $interval(function() {
                $scope.stopwatch.s--;
                if ($scope.stopwatch.s < 0) {
                    $scope.stopwatch.s = 59;
                    $scope.stopwatch.m--;
                    if ($scope.stopwatch.m < 0) {
                        $scope.stopwatch.m = 59;
                        $scope.stopwatch.h--;
                    }
                }
                $scope.stopwatch.txt = ($scope.stopwatch.h ? ($scope.stopwatch.h > 9 ? $scope.stopwatch.h : "0" + $scope.stopwatch.h) : "00") + "<span class='sep'>:</span>" + ($scope.stopwatch.m ? ($scope.stopwatch.m > 9 ? $scope.stopwatch.m : "0" + $scope.stopwatch.m) : "00") + "<span class='sep'>:</span>" + ($scope.stopwatch.s > 9 ? $scope.stopwatch.s : "0" + $scope.stopwatch.s);

                // 30분이 지난뒤 이벤트
                if(($scope.stopwatch.h == 1) && ($scope.stopwatch.m == 0) && ($scope.stopwatch.s == 0)) {

                }

                // 60분이 지난뒤 이벤트
                if(($scope.stopwatch.h == 0) && ($scope.stopwatch.m == 30) && ($scope.stopwatch.s == 0)) {

                }

            }, 1000);
        };

        /**
         * 스탑와치 초기화
         * @constructor
         */
        $scope.stopwatch.Reset = function() {
            $scope.stopwatch.h = 1;
            $scope.stopwatch.m = 30;
            $scope.stopwatch.s = 0;
        };


        // 강제 초기화 변수
        $scope.forceCloseQ = 5;
        $scope.forceInterval = 5000;
        $scope.forceTimer = setInterval(function(){
            $scope.forceCloseQ = 5;
        },$scope.forceInterval);


        /**
         * 미션
         * @type {{}}
         */
        $scope.misn = {};

        $scope.misn.curMisn = null;
        $scope.misn.curMisnNo = null;
        $scope.misn.curStep = 0;
        $scope.misn.curPage = 0;

        /**
         * 미션 목록
         * @type {*[]}
         */
        $scope.misn.list = [
            {
                no: "001", title: "긴급한 요청", stepNo: 3, curPer: 0, invenTit: "<span class='sj'>백신 제조용</span><span class='sj'>표준 바이러스주</span>", keymapTit: "백신 제조용<br/>표준 바이러스주",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "채워지지 않은 편지" },
                    { no: "02", title: "선배 연구원의 조언" }
                ],
                map: [
                    [],
                    [ { mapNo: 1, mapSpotNo: 1 }, { mapNo: 1, mapSpotNo: 2 }, { mapNo: 1, mapSpotNo: 3 }, { mapNo: 1, mapSpotNo: 4 }, { mapNo: 1, mapSpotNo: 5 }, { mapNo: 1, mapSpotNo: 6 } ],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                no: "002", title: "고촌 박사가 보낸 편지", stepNo: 3, curPer: 0, invenTit: "<span class='sj'>면역증강제</span>", keymapTit: "면역<br/>증강제",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "고촌 박사가 보낸 편지" },
                    { no: "02", title: "신약의 비밀" }
                ],
                map: [
                    [],
                    [],
                    [ { mapNo: 2, mapSpotNo: 2 } ],
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                no: "003", title: "바이러스에 감염된<br/>기관을 찾아라", stepNo: 2, curPer: 0, invenTit: "<span class='sj'>무항생제</span><span class='sj'>유정란</span>", keymapTit: "무항생제<br/>유정란",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "바이러스에 감염된 기관을 찾아라" }
                ],
                map: [
                    [],
                    [ { mapNo: 1, mapSpotNo: 2 } ],
                    [ { mapNo: 1, mapSpotNo: 2 } ],
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                no: "004", title: "당신의 신분을<br/>증명하시오", stepNo: 3, curPer: 0, invenTit: "<span class='sj'>희석비율표</span>", keymapTit: "희석<br/>비율표",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "당신의 신분을 증명하시오" },
                    { no: "02", title: "중앙통제실의 프린터기" }
                ],
                map: [
                    [],
                    [],
                    [],
                    [ { mapNo: 1, mapSpotNo: 4 } ],
                    [ { mapNo: 1, mapSpotNo: 4 } ],
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                no: "005", title: "백신 제조의<br/>중요한 열쇠", stepNo: 2, curPer: 0, invenTit: "<span class='sj'>백신시약병</span>", keymapTit: "백신시약병",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "백신 제조의 중요한 열쇠" }
                ],
                map: [
                    [],
                    [ { mapNo: 1, mapSpotNo: 1 } ],
                    [ { mapNo: 1, mapSpotNo: 1 } ],
                    [],
                    [],
                    [ { mapNo: 1, mapSpotNo: 7 } ],
                    [ { mapNo: 1, mapSpotNo: 1 } ],
                    [],
                    []
                ]
            },
            {
                no: "006", title: "성공적인 임상시험", stepNo: 3, curPer: 0, invenTit: "<span class='sj'>임상시험</span><br/><span class='sj'>결과 보고서</span>", keymapTit: "임상시험<br/>결과 보고서",
                steps: [
                    { no: "00", title: "백신 개발 과정" },
                    { no: "01", title: "임상시험" },
                    { no: "02", title: "감염자가 나타났다" },
                    { no: "03", title: "치료된 감염자" }
                ],
                map: [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                no: "FINAL", title: "새로운 이름의 백신", stepNo: 3, curPer: 0, invenTit: "",
                steps: [
                    { no: "1", title: "물질 합성" },
                    { no: "2", title: "백신 제조 코드, 희석 비율, 백신 이름 전송" },
                    { no: "3", title: "백신 제조" },
                    { no: "4", title: "백신 개발 완료" }
                ],
                map: [
                    [],
                    [],
                    [],
                    [],
                    []
                ]
            }
        ];

        /**
         * 미션 완료
         * @type {{curStep: number, curPage: number}[]}
         */
        $scope.misn.archive = [
            { curStep: 0, curPage: 0, totStep: 2, totPage: 7 },
            { curStep: 0, curPage: 0, totStep: 2, totPage: 6 },
            { curStep: 0, curPage: 0, totStep: 1, totPage: 6 },
            { curStep: 0, curPage: 0, totStep: 2, totPage: 6 },
            { curStep: 0, curPage: 0, totStep: 1, totPage: 8 },
            { curStep: 0, curPage: 0, totStep: 3, totPage: 8 },
            { curStep: 0, curPage: 0, totStep: 4, totPage: 4 }
        ];

        $scope.invenItemCurPer = 0;
        $scope.invenItemCurPerResult = 0;
        $scope.processing = false;

        /**
         * 미션 체크
         * @constructor
         */
        $scope.CheckMission = function() {

            // 선택된 미션이 없을 경우
            if(!$scope.misn.curMisn) {
                $scope.GoMission(0);
            }

            // 진행 완료 퍼센트 체크
            angular.forEach(MisnSvc.GetMissionArchive(), function(value, key) {
                $scope.misn.list[key].curPer = MisnSvc.GetMissionPercent(key, value.curPage);
            });


        };

        /**
         * 링크로 미션 이동
         * @param no
         * @constructor
         */
        $scope.GoMissionLink = function(no) {
            $location.path("/intro");
            $scope.processing = true;

            setTimeout(function() {

                $scope.processing = false;

                setTimeout(function() {
                    $scope.GoMission(no, true);
                }, 50);
            }, 50);

        };

        /**
         * 미션 이동
         * @constructor
         */
        $scope.GoMission = function(misnNo, isLink) {

            if(!$scope.processing) {

                var curMisnArchive = MisnSvc.GetMissionArchive();
                $(".inven-list").find("li").removeClass("blink");

                // 6단계일경우 이전 미션 완료 확인
                if(misnNo == 5) {
                    if(($scope.misn.list[0].curPer < 100) || ($scope.misn.list[1].curPer < 100) || ($scope.misn.list[2].curPer < 100) || ($scope.misn.list[3].curPer < 100) || ($scope.misn.list[4].curPer < 100)) {
                        $scope.err.Open("이번 미션을 진행하기 위해서는<br/>미션 001-005까지 모두 완료해야 합니다.");
                        return;
                    }
                }

                $scope.misn.curMisnNo = misnNo;
                $scope.misn.curMisn = $scope.misn.list[misnNo];

                // 저장된 미션이 있으면 불러오기
                if(curMisnArchive) {
                    $scope.misn.curStep = curMisnArchive[$scope.misn.curMisnNo].curStep;
                    $scope.misn.curPage = curMisnArchive[$scope.misn.curMisnNo].curPage;
                } else {
                    $scope.misn.curStep = 0;
                    $scope.misn.curPage = 0;
                }

                // 시작 화면에서 딜레이 추가
                if(isLink) {
                    setTimeout(function() {
                        $ionicTabsDelegate.$getByHandle('mission-tabs').select(misnNo);
                    }, 100);
                } else {
                    $ionicTabsDelegate.$getByHandle('mission-tabs').select(misnNo);
                }

                // 내 상태 서버에 업데이트
                CoreSvc.Update(MisnSvc.GetAllMissionsPercent(), misnNo);

                // 지도 영역 표시 체크
                $scope.map.CheckSpot($scope.misn.curMisnNo, $scope.misn.curPage);

                // Prev, Next 버튼 확인
                $scope.CheckPageBtn();

            } else {

            }
        };

        /**
         * 미션내 단계 이동
         * @param noStep
         * @constructor
         */
        $scope.GoStep = function(noStep) {
            $scope.misn.curStep = noStep;
            MisnSvc.SaveMissionArchiveStep($scope.misn.curMisnNo, noStep);
        };

        /**
         * 미션내 페이지 이동
         * @param noPage
         * @constructor
         */
        $scope.GoPage = function(noPage) {
            $scope.misn.curPage = noPage;

            var curMisnArchive = MisnSvc.GetMissionArchive();
            if(curMisnArchive[$scope.misn.curMisnNo].curPage < $scope.misn.curPage) {
                MisnSvc.SaveMissionArchivePage($scope.misn.curMisnNo, noPage);
                $scope.misn.list[$scope.misn.curMisnNo].curPer = MisnSvc.GetMissionPercent($scope.misn.curMisnNo, noPage);
                CoreSvc.Update(MisnSvc.GetAllMissionsPercent(), $scope.misn.curMisnNo);
            }

            // 지도 영역 표시 체크
            $scope.map.CheckSpot($scope.misn.curMisnNo, $scope.misn.curPage);

            // Prev, Next 버튼 확인
            $scope.CheckPageBtn();



        };


        $scope.prevDisabled = false;
        $scope.nextDisabled = false;

        $scope.CheckPageBtn = function() {
            var curMisnArchive = MisnSvc.GetMissionArchive();

            //console.log($scope.misn.curPage + " / "+curMisnArchive[$scope.misn.curMisnNo].curPage);

            $scope.prevDisabled = ($scope.misn.curPage == 0) || !(curMisnArchive[$scope.misn.curMisnNo].curPage >= $scope.misn.curPage);

            $scope.nextDisabled = ($scope.misn.curPage == $scope.misn.archive.totPage) || !(curMisnArchive[$scope.misn.curMisnNo].curPage > $scope.misn.curPage);


        };


        $scope.GoPagePrev = function() {
            $scope.misn.curPage = $scope.misn.curPage - 1;

            // Prev, Next 버튼 확인
            $scope.CheckPageBtn();

            // 지도 영역 표시 체크
            $scope.map.CheckSpot($scope.misn.curMisnNo, $scope.misn.curPage);
        };

        $scope.GoPageNext = function() {
            $scope.misn.curPage = $scope.misn.curPage + 1;

            // Prev, Next 버튼 확인
            $scope.CheckPageBtn();

            // 지도 영역 표시 체크
            $scope.map.CheckSpot($scope.misn.curMisnNo, $scope.misn.curPage);
        };




        /**
         * 인벤토리에 아이템 획득
         * @param noInven
         * @param noPage
         * @param itemPosTop
         * @param itemPosLeft
         * @constructor
         */
        $scope.GetInvenItem = function(noInven, noPage, itemPosTop, itemPosLeft) {

            $scope.processing = true;
            var interval = null;

            // 아이템 획득 진행 상황
            setTimeout(function() {
                $scope.invenItemCurPer = 100;
                interval = $interval(function() {
                    if($scope.invenItemCurPerResult < 100) {
                        $scope.invenItemCurPerResult++;
                    }
                }, 30);
            }, 500);

            // 애니메이션 효과
            setTimeout(function() {

                var missionWrap = $("#Mission"+($scope.misn.curMisnNo+1));
                missionWrap.find(".inven-item-wrap").removeClass("ng-hide").hide().fadeIn(4000);


                // 애니메이션 효과
                setTimeout(function() {

                    missionWrap.find(".inven-item-progress").fadeOut(2000);
                    missionWrap.find(".inven-item-result-wrap").fadeOut(2000);
                    missionWrap.find(".inven-item-success-wrap").delay(2000).fadeIn(2000);
                    missionWrap.find(".inven-item").delay(2000).animate({ "top" : itemPosTop+"px", "left" : itemPosLeft+"px" }, 1500).delay(500).fadeOut();

                    // 페이지 이동
                    setTimeout(function() {
                        $scope.GoPage(noPage);
                        $scope.processing = false;
                        $scope.invenItemCurPer = 0;
                        $scope.invenItemCurPerResult = 0;
                        $interval.cancel(interval);
                        $scope.PlayAudio('save-inven.mp3');

                        $(".inven-list").find("li").addClass("blink");
                    }, 6000);
                }, 4000);


            }, 500);
        };

        /**
         * 인벤토리 바로 저장 버튼
         * @param noInven
         * @param noPage
         * @param noPageRes
         * @param itemPosTop
         * @param itemPosLeft
         * @constructor
         */
        $scope.GoGetInvenItem = function(noInven, noPage, noPageRes, itemPosTop, itemPosLeft) {
            $scope.GoPage(noPage);
            $scope.GetInvenItem(noInven, noPageRes, itemPosTop, itemPosLeft);
        };




        $scope.audio = new Audio();

        $scope.PlayAudio = function(file) {
            $scope.audio.src = 'audio/'+file;
            $scope.audio.play();
        };

        $scope.StopAudio = function() {
            if ($scope.audio.src) {
                $scope.audio.pause();
            }
        };






        /**
         * 미션 1 메일 전송
         * @type {{}}
         */
        $scope.misn.misn1Email = {};

        $scope.misn.misn1Email.codeList = [
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" }
        ];

        $scope.misn.misn1Email.CheckCode = function() {
            if(
                ($scope.misn.misn1Email.code == $scope.misn.misn1Email.codeList[$scope.teamInfo.ctrlNo - 1].code)
            ) {
                $scope.GoPage(4);
                $scope.GoStep(2);
            } else {
                $scope.err.Open("빈칸에 올바른 코드를 입력하세요.");
            }
        };

        $scope.misn.misn1Email.CheckEmail = function() {
            if(
                ($scope.misn.misn1Email.input1.toUpperCase() == "NIBSC") &&
                ($scope.misn.misn1Email.input2.toUpperCase() == "인플루엔자") &&
                ($scope.misn.misn1Email.input3.toUpperCase() == "세계보건기구") &&
                ($scope.misn.misn1Email.input4.toUpperCase() == "NIBSC")
            ) {

                $scope.GoPage(5);
            } else {
                $scope.err.Open("빈칸에 올바른 단어를 입력하세요.");
            }
        };

        /**
         * 미션 2 정답 맞추기
         * @type {{}}
         */
        $scope.misn.misn2Check = {};
        $scope.misn.misn2Check.hintScroll = 1;

        $scope.misn.misn2Check.hintMore = function() {
            $scope.misn.misn2Check.hintScroll++;
            setTimeout(function() {
                $(".dialog-hint-wrap").mCustomScrollbar("scrollTo", "bottom");
            }, 300);
        };

        $scope.misn.misn2Check.codeList = [
            { code: "519", answer: "이상지질혈증", stepNo: 1 },
            { code: "581", answer: "암", stepNo: 1 },
            { code: "516", answer: "암", stepNo: 1 },
            { code: "519", answer: "이상지질혈증", stepNo: 1 },
            { code: "11101", answer: "빈혈", stepNo: 3 },
            { code: "12201", answer: "자궁경부암", stepNo: 1 }
        ];

        $scope.misn.misn2Check.myMisn2Code = "CKD-" + $scope.misn.misn2Check.codeList[$scope.teamInfo.ctrlNo - 1].code;

        $scope.misn.misn2Check.Check = function() {

            if($scope.misn.misn2Check.input1 === $scope.misn.misn2Check.codeList[$scope.teamInfo.ctrlNo - 1].answer) {
                $scope.GoPage(4);
            } else {
                $scope.err.Open("틀렸습니다.<br/>무엇을 위한 치료제인지<br/>병명을 정확하게 입력하세요.");
            }

        };

        /**
         * 미션 3 AR 인식
         * @type {{}}
         */
        $scope.misn.misn3Organ = {};

        $scope.misn.misn3Organ.ar= {};
        $scope.misn.misn3Organ.ar.item1 = false;
        $scope.misn.misn3Organ.ar.item2 = false;

        /**
         * AR 장기 인식
         * @param itemNo
         * @constructor
         */
        $scope.misn.misn3Organ.GetARItem = function(itemNo) {



            if((itemNo == 0) || (itemNo == 1)) {
                if(itemNo == 0) {

                    $scope.misn.misn3Organ.ar.item1 = true;



                } else {

                    $scope.misn.misn3Organ.ar.item2 = true;
                }

                $timeout(function() {
                    $scope.$apply();
                }, 100);

            } else {
                $scope.err.Open("잘못된 비밀 코드를 인식하였습니다.<br/>올바른 비밀 코드를 인식하세요.");
            }
            //$("#"+itemNo).val(1).trigger("input");
        };


        $scope.misn.misn3Organ.SetAr = function() {

        };




        /**
         * 미션 4 퀴즈
         * @type {{}}
         */
        $scope.misn.misn4Quiz = {};
        $scope.misn.misn4Quiz.noList = [];
        $scope.misn.misn4Quiz.input = [];
        $scope.misn.misn4Quiz.qArray = [];
        $scope.misn.misn4Quiz.qIdx = 1;
        $scope.misn.misn4Quiz.qNo = 0;
        $scope.misn.misn4Quiz.isAnswering = false;

        $scope.misn.misn4Quiz.isHint = false;

        $scope.misn.misn4Quiz.hintScroll = 1;

        $scope.misn.misn4Quiz.hintMore = function() {
            $scope.misn.misn4Quiz.hintScroll++;
            setTimeout(function() {
                $(".dialog-hint-wrap").mCustomScrollbar("scrollTo", "bottom");
            }, 300);
        };

        $scope.misn.misn4Quiz.targetNo = null;

        /**
         * 퀴즈 미션 목록
         * @type {{tit: string, answer: string}[]}
         */
        $scope.misn.misn4Quiz.quizList = [
            { tit: "1985년 종근당은 오랜 연구 끝에 개발한 종합소화제 <span class='green'>000</span>을 86서울아시안게임과 88서울올림픽에 공식 공급하기로 하고 올림픽 마스코트 및 휘장 사용에 관련한 업무를 추친했다.", answer: "제스탄", hint: "자료실", img: "4_01.jpg", map: [ { mapNo: 1, mapSpotNo: 6 } ] },
            { tit: "고촌상은 평생을 결핵퇴치를 위해 노력한 고촌 이종근 회장의 정신을 기리기 위해 2005년 WHO 산하기관인 STOP TB Partnership과 공동으로 제정한 국제적인 상이다. 2012년, 고촌시상식이 열린 나라는 <span class='green'>00000</span>이다.", answer: "말레이시아", hint: "고촌 연구소 교육관", img: "4_02.jpg", map: [ { mapNo: 1, mapSpotNo: 1 } ] },
            { tit: "2004년 종근당 1호 신약 항암제 캄토벨의 성분은 <span class='green'>0000</span>이다.", answer: "벨로테칸", hint: "2층: 약품 연구실", img: "4_03.jpg", map: [ { mapNo: 2, mapSpotNo: 2 } ] },
            { tit: "종근당에서 판매한 약품 중 <span class='green'>000</span>는 1897년 한약에 서양 과학을 수용하여 만든 국내최초의 소화제이다.", answer: "활명수", hint: "고촌 연구소 교육관", img: "4_04.jpg", map: [ { mapNo: 1, mapSpotNo: 1 } ] },
            { tit: "19세기 중엽부터 에테르, <span class='green'>00000</span>, 클로로포름을 활용한 흡입마취법이 개발되면서 전신마취가 대중화되었다.", answer: "아산화질소", hint: "고촌 연구소 역사관", img: "4_05.jpg", map: [ { mapNo: 1, mapSpotNo: 5 } ] },
            { tit: "<span class='green'>0000</span>년 종근당의 기업 PR광고의 카피는 ‘태극기로 이 지구를 덮을 길은 없는가?’이다.", answer: "1972", hint: "고촌 연구소 교육관", img: "4_06.jpg", map: [ { mapNo: 1, mapSpotNo: 1 } ] },
            { tit: "<span class='green'>000</span>의 프라바즈는 1853년에 현대적 개념의 피하주사기를 제작하였다.", answer: "프랑스", hint: "고촌 연구소 역사관", img: "4_07.jpg", map: [ { mapNo: 1, mapSpotNo: 5 } ] },
            { tit: "이종근 회장은 해외출장을 다닐 때마다 작은 종을 기념품으로 사 모았는데, 한 두점씩 모은 그 종은 모두 <span class='green'>000</span>점이다.", answer: "656", hint: "고촌 연구소 역사관", img: "4_08.jpg", map: [ { mapNo: 1, mapSpotNo: 5 } ] },
            { tit: "종근당의 창업주 이종근 회장이 유년기를 보낸 곳은 충남 당진 고대면 성산리의 <span class='green'>00</span>마을 이다.", answer: "작동", hint: "자료실", img: "4_09.jpg", map: [ { mapNo: 1, mapSpotNo: 6 } ] },
            { tit: "종근당의 창업주 이종근 회장은 라디오 역사 다큐드라마와 문학기행을 즐겨 들었다. 특히 그의 선조인 <span class='green'>0000</span>, 한국문학기행, 광복 50년 등은 따로 테이프에 녹음해 놓고 들을 만큼 관심이 많았다.", answer: "양영대군", hint: "자료실", img: "4_10.jpg", map: [ { mapNo: 1, mapSpotNo: 6 } ] }
        ];

        /**
         * 팀별 코드
         * @type {{code: string}[]}
         */
        $scope.misn.misn4Quiz.codeList = [
            { code: "KCLAB099808", dose: "1", ug: "15" },
            { code: "KCLAB340218", dose: "1", ug: "15" },
            { code: "KCLAB178112", dose: "1", ug: "15" },
            { code: "KCLAB670781", dose: "1", ug: "15" },
            { code: "KCLAB518112", dose: "1", ug: "15" },
            { code: "KCLAB760150", dose: "1", ug: "15" }
        ];

        /**
         * 랜덤 퀴즈 숫자 구하기
         * @constructor
         */
        $scope.misn.misn4Quiz.LoadQuiz = function() {
            // 랜덤 퀴즈 숫자 구하기

            var q = 0;

            while($scope.misn.misn4Quiz.noList.length < 3) {
                var newQNos = Math.floor((Math.random() * 10));

                if ($scope.misn.misn4Quiz.noList.indexOf(newQNos) == -1) {
                    $scope.misn.misn4Quiz.noList.push(newQNos);

                    $scope.misn.list[3].map[2].push($scope.misn.misn4Quiz.quizList[newQNos].map[0]);
                    q++;

                }
            }
        };


        $scope.misn.misn4Quiz.isScan = false;
        $scope.misn.misn4Quiz.qAnswer0 = false;
        $scope.misn.misn4Quiz.qAnswer1 = false;
        $scope.misn.misn4Quiz.qAnswer2 = false;

        $scope.misn.misn4Quiz.GetARItem = function(itemNo) {

            //console.log("No:"+itemNo);
            //console.log("Queue:"+$scope.misn.misn4Quiz.noList);

            if(
                (itemNo  == $scope.misn.misn4Quiz.noList[0]) ||
                (itemNo  == $scope.misn.misn4Quiz.noList[1]) ||
                (itemNo  == $scope.misn.misn4Quiz.noList[2])
              ){

                if(itemNo  == $scope.misn.misn4Quiz.noList[0]) {

                    if($scope.misn.misn4Quiz.qAnswer0 === false) {
                        $scope.misn.misn4Quiz.qArray.push($scope.misn.misn4Quiz.quizList[$scope.misn.misn4Quiz.noList[0]]);
                        $scope.misn.misn4Quiz.qNo = 0;
                        $scope.misn.misn4Quiz.isAnswering = true;
                    } else {
                        $scope.err.Open("이미 맞춘 문제입니다.");
                        $scope.misn.misn4Quiz.isAnswering = false;
                    }

                } else if(itemNo  == $scope.misn.misn4Quiz.noList[1]) {

                    if($scope.misn.misn4Quiz.qAnswer1 === false) {
                        $scope.misn.misn4Quiz.qArray.push($scope.misn.misn4Quiz.quizList[$scope.misn.misn4Quiz.noList[1]]);
                        $scope.misn.misn4Quiz.qNo = 1;
                        $scope.misn.misn4Quiz.isAnswering = true;
                    } else {
                        $scope.err.Open("이미 맞춘 문제입니다.");
                        $scope.misn.misn4Quiz.isAnswering = false;
                    }

                } else if(itemNo  == $scope.misn.misn4Quiz.noList[2]) {

                    if($scope.misn.misn4Quiz.qAnswer2 === false) {
                        $scope.misn.misn4Quiz.qArray.push($scope.misn.misn4Quiz.quizList[$scope.misn.misn4Quiz.noList[2]]);
                        $scope.misn.misn4Quiz.qNo = 2;
                        $scope.misn.misn4Quiz.isAnswering = true;
                    } else {
                        $scope.err.Open("이미 맞춘 문제입니다.");
                        $scope.misn.misn4Quiz.isAnswering = false;
                    }

                }

                $scope.misn.misn4Quiz.isScan = false;


            } else {
                $scope.err.Open("잘못된 비밀 코드를 인식하였습니다.<br/>올바른 비밀 코드를 인식하세요.<br/>*코드가 맞다면 다시 시도해주세요.");
                $scope.misn.misn4Quiz.isScan = false;
            }

        };


        $scope.misn.misn4Quiz.CheckQuiz = function(idx) {

            if($scope.misn.misn4Quiz.input[idx] === $scope.misn.misn4Quiz.quizList[$scope.misn.misn4Quiz.noList[idx]].answer) {

                if(idx === 0) {
                    $scope.misn.misn4Quiz.qAnswer0 = true;
                } else if(idx === 1) {
                    $scope.misn.misn4Quiz.qAnswer1 = true;
                } else if(idx === 2) {
                    $scope.misn.misn4Quiz.qAnswer2 = true;
                }

                $scope.misn.misn4Quiz.qIdx++;

                var msg = "정답입니다.<br/>다음 문제로 넘어갑니다.";
                if($scope.misn.misn4Quiz.qAnswer0 === true && $scope.misn.misn4Quiz.qAnswer1 === true && $scope.misn.misn4Quiz.qAnswer2 === true) {
                    msg = "정답입니다.<br/>다음 단계로 넘어갑니다.";
                    $scope.GoStep(2);
                    $scope.GoPage(3);
                }

                $scope.cmf.Open(msg);
                $scope.misn.misn4Quiz.isAnswering = false;
                $scope.misn.misn4Quiz.isScan = false;
                //$scope.GoPage(noPage);
            } else {
                $scope.err.Open("틀렸습니다.<br/>다시 정답을 입력하세요.");
            }
        };


        $scope.misn.misn4Quiz.isPrinting = false;

        /**
         * 인쇄 준비
         * @constructor
         */
        $scope.misn.misn4Quiz.GetPrintReady = function() {

            $scope.misn.misn4Quiz.isPrinting = true;

            CoreSvc.GetCurrentProgram().then(function(res) {

                // 현재 서버에서 인쇄중인지 확인
                if(res.dataInfo.is_print === "0") {

                    CoreSvc.Action(0, 1, null).then(function(res) {

                        $scope.cmf.Open("보안 해제 중 입니다.");
                        $scope.cmf.isDisableClose = true;

                        setTimeout(function() {
                            $scope.cmf.isDisableClose = false;
                            $scope.GoPage(4);
                        }, 3000);
                        $scope.misn.misn4Quiz.isPrinting = false;


                    })
                    .catch(function(error) {
                        alert(error.response.error.msgKo);
                    });

                } else {
                    $scope.err.Open("현재 다른팀이 진행중입니다. 잠시후에 시도해주세요.");
                    $scope.misn.misn4Quiz.isPrinting = false;
                }
            });
        };

        /**
         * 인쇄 전송 버튼
         * @constructor
         */
        $scope.misn.misn4Quiz.GoPrint = function() {

            $scope.misn.misn4Quiz.isPrinting = true;

            CoreSvc.GetCurrentProgram().then(function(res) {

                // 현재 서버에서 인쇄중인지 확인
                if(res.dataInfo.is_print === "0") {

                    CoreSvc.Action(0, 1, $scope.teamInfo.ctrlNo).then(function(res) {

                        $scope.cmf.Open("전송 중 입니다.");
                        $scope.cmf.isDisableClose = true;

                        setTimeout(function() {
                            $scope.cmf.Open("코드분석 중 입니다.");

                            setTimeout(function() {
                                $scope.cmf.Open("인쇄 중 입니다.");

                                setTimeout(function() {

                                    $scope.cmf.msg = "성공적으로 인쇄되었습니다.";
                                    $scope.cmf.isDisableClose = false;

                                    setTimeout(function() {
                                        $scope.GoGetInvenItem(3, 5, 6, 243, 60);
                                    }, 2000);

                                }, 5000);
                            }, 10000);






                        }, 3000);

                    })
                    .catch(function(error) {
                        alert(error.response.error.msgKo);
                    });

                } else {
                    $scope.err.Open("현재 다른팀이 진행중입니다.<br/>잠시후에 시도해주세요.");
                    $scope.misn.misn4Quiz.isPrinting = false;
                }
            });


        };



        $scope.misn.misn5Quiz = {};
        $scope.misn.misn5Quiz.key = [
            { answer: "인지질" },
            { answer: "항생제" },
            { answer: "리보솜" },
            { answer: "100" },
            { answer: "숙주" },
            { answer: "꼬리섬유" },
            { answer: "유전물질" }
        ];

        $scope.misn.misn5Quiz.pw = ["2053", "3426", "2619", "1230", "3053", "1220"];

        /**
         * 오큘러스 퀴즈 정답 확인
         * @constructor
         */
        $scope.misn.misn5Quiz.Check = function() {

            if(
                ($scope.misn.misn5Quiz.key[0].answer === $scope.misn.misn5Quiz.input1) &&
                ($scope.misn.misn5Quiz.key[1].answer === $scope.misn.misn5Quiz.input2) &&
                ($scope.misn.misn5Quiz.key[2].answer === $scope.misn.misn5Quiz.input3) &&
                ($scope.misn.misn5Quiz.key[3].answer === $scope.misn.misn5Quiz.input4) &&
                ($scope.misn.misn5Quiz.key[4].answer === $scope.misn.misn5Quiz.input5) &&
                ($scope.misn.misn5Quiz.key[5].answer === $scope.misn.misn5Quiz.input6) &&
                ($scope.misn.misn5Quiz.key[6].answer === $scope.misn.misn5Quiz.input7)
            ) { // 정답 확인

                $scope.misn.misn5Quiz.input1Error = false;
                $scope.misn.misn5Quiz.input2Error = false;
                $scope.misn.misn5Quiz.input3Error = false;
                $scope.misn.misn5Quiz.input4Error = false;
                $scope.misn.misn5Quiz.input5Error = false;
                $scope.misn.misn5Quiz.input6Error = false;


                $scope.GoPage(5);
            } else {



                if($scope.misn.misn5Quiz.key[0].answer !== $scope.misn.misn5Quiz.input1) {
                    $scope.misn.misn5Quiz.input1Error = true;
                } else {
                    $scope.misn.misn5Quiz.input1Error = false;
                }

                if($scope.misn.misn5Quiz.key[1].answer !== $scope.misn.misn5Quiz.input2) {
                    $scope.misn.misn5Quiz.input2Error = true;
                } else {
                    $scope.misn.misn5Quiz.input2Error = false;
                }

                if($scope.misn.misn5Quiz.key[2].answer !== $scope.misn.misn5Quiz.input3) {
                    $scope.misn.misn5Quiz.input3Error = true;
                } else {
                    $scope.misn.misn5Quiz.input3Error = false;
                }

                if($scope.misn.misn5Quiz.key[3].answer !== $scope.misn.misn5Quiz.input4) {
                    $scope.misn.misn5Quiz.input4Error = true;
                } else {
                    $scope.misn.misn5Quiz.input4Error = false;
                }

                if($scope.misn.misn5Quiz.key[4].answer !== $scope.misn.misn5Quiz.input5) {
                    $scope.misn.misn5Quiz.input5Error = true;
                } else {
                    $scope.misn.misn5Quiz.input5Error = false;
                }

                if($scope.misn.misn5Quiz.key[5].answer !== $scope.misn.misn5Quiz.input6) {
                    $scope.misn.misn5Quiz.input6Error = true;
                } else {
                    $scope.misn.misn5Quiz.input6Error = false;
                }

                if($scope.misn.misn5Quiz.key[6].answer !== $scope.misn.misn5Quiz.input7) {
                    $scope.misn.misn5Quiz.input7Error = true;
                } else {
                    $scope.misn.misn5Quiz.input7Error = false;
                }




                $scope.err.Open("일부 정답이 맞지 않습니다.<br/>정답을 입력하세요.");
            }
        };


        $scope.misn.misn5Quiz.codeList = [
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" }
        ];

        $scope.misn.misn5Quiz.CheckCode = function() {
            if(
                ($scope.misn.misn5Quiz.code == $scope.misn.misn5Quiz.codeList[$scope.teamInfo.ctrlNo - 1].code)
            ) {
                $scope.GoGetInvenItem(4, 7, 8, 243, 187);
            } else {
                $scope.err.Open("빈칸에 올바른 코드를 입력하세요.");
            }
        };





        $scope.misn.misn6Cure = {};



        $scope.misn.misn6Cure.codeList = [
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" },
            { code: "0732" }
        ];

        $scope.misn.misn6Cure.CheckCode = function() {
            if(
                ($scope.misn.misn6Cure.code == $scope.misn.misn6Cure.codeList[$scope.teamInfo.ctrlNo - 1].code)
            ) {
                $scope.GoPage(4);
                $scope.GoStep(2);
                $scope.PlayAudio('siren.mp3');
            } else {
                $scope.err.Open("빈칸에 올바른 코드를 입력하세요.");
            }
        };



        $scope.misn.misn6Cure.GetARItem = function() {

            $scope.GoGetInvenItem(5, 7, 8, 243, 326);

        };




        $scope.isFinalCompose = false;
        $scope.GoCompose = function() {
            $scope.isFinalCompose = true;
            $scope.GoMission(6);

            setTimeout(function() {
                $scope.misn.misn7Final.Step1();
            }, 1000);

        };

        $scope.processing2 = false;

        $scope.misn.misn7Final = {};

        $scope.misn.misn7Final.pg = 1;
        $scope.misn.misn7Final.per = 0;
        $scope.misn.misn7Final.perResult = 0;
        $scope.misn.misn7Final.vacName = '';
        $scope.misn.misn7Final.dataPer = 0;

        $scope.misn.misn7Final.codeList = [
            "VM6436", "VM4357", "VM2704", "VM9754", "VM0819", "VM0214"
        ];


        $scope.misn.misn7Final.Step1 = function() {

            var invenWrap = $("#Mission7").find(".inven-list");
            var idx = 0;
            var interval = null;

            interval = $interval(function() {
                if(idx < 6) {
                    $(".final-inven-"+(idx+1)).addClass("final");
                    idx++;
                } else {
                    $interval.cancel(interval);
                }
            }, 700);



            setTimeout(function() {
                invenWrap.find(".icon-0").animate({ "left" : "329px" }, 2500);
                invenWrap.find(".icon-1").animate({ "left" : "199px" }, 2500);
                invenWrap.find(".icon-2").animate({ "left" : "69px" }, 2500);
                invenWrap.find(".icon-3").animate({ "left" : "-61px" }, 2500);
                invenWrap.find(".icon-4").animate({ "left" : "-191px" }, 2500);
                invenWrap.find(".icon-5").animate({ "left" : "-321px" }, 2500);
            }, 5000);




            setTimeout(function() {

                $scope.processing = true;
                var interval2 = null;

                // 아이템 획득 진행 상황
                setTimeout(function() {
                    $scope.misn.misn7Final.per = 100;
                    interval2 = $interval(function() {
                        if($scope.misn.misn7Final.perResult < 100) {
                            $scope.misn.misn7Final.perResult++;
                        }
                    }, 50);
                }, 1000);

                // 애니메이션 효과
                setTimeout(function() {

                    var missionWrap = $("#Mission"+($scope.misn.curMisnNo+1));
                    missionWrap.find(".inven-frame-wrap").fadeOut(2000);
                    missionWrap.find(".inven-item-result-wrap").fadeOut(2000);
                    missionWrap.find(".scope-inven").fadeOut(2000);

                    // 페이지 이동
                    setTimeout(function() {
                        $scope.processing2 = true;
                        $scope.misn.misn7Final.per = 0;
                        $scope.misn.misn7Final.perResult = 0;
                        $interval.cancel(interval2);
                    }, 5000);
                }, 7000);
            }, 9000);

            MisnSvc.SaveMissionArchivePage(6, 1);
            CoreSvc.Update(MisnSvc.GetAllMissionsPercent(), 6);
        };



        $scope.misn.misn7Final.Step2 = function() {
            $scope.misn.misn7Final.pg = 2;
            MisnSvc.SaveMissionArchivePage(6, 2);
            CoreSvc.Update(MisnSvc.GetAllMissionsPercent(), 6);
        };


        $scope.misn.misn7Final.isFinal = false;

        $scope.misn.misn7Final.Step3 = function() {

            // 희석 비율 확인
            if(
                ($scope.misn.misn7Final.input2 === $scope.misn.misn4Quiz.codeList[$scope.teamInfo.ctrlNo - 1].dose) &&
                ($scope.misn.misn7Final.input3 === $scope.misn.misn4Quiz.codeList[$scope.teamInfo.ctrlNo - 1].ug)
            ) {


                CoreSvc.GetCurrentProgram().then(function(res) {

                    // 현재 서버에서 진행중인지 확인
                    if(res.dataInfo.is_final_step === "0") {

                        CoreSvc.Action(1, 0, $scope.teamInfo.ctrlNo, $scope.misn.misn7Final.input4).then(function(res) {


                            $scope.misn.misn7Final.isFinal = true;


                            // 데이터 전송중...
                            $(".data-prg").fadeIn();


                            setTimeout(function() {
                                var intervald = null;
                                intervald = $interval(function() {
                                    if($scope.misn.misn7Final.dataPer < 100) {
                                        $scope.misn.misn7Final.dataPer++;
                                    }
                                }, 50);
                                $("#misn7Bar").addClass("fill");


                                setTimeout(function() {

                                    // 백신 제조 영상
                                    $scope.misn.misn7Final.pg = 3;
                                    MisnSvc.SaveMissionArchivePage(6, 3);
                                    CoreSvc.Update(MisnSvc.GetAllMissionsPercent(), 6, $scope.misn.misn7Final.input4);

                                    $interval.cancel(intervald);

                                    setTimeout(function() {

                                        // 영상 재생 (7초)
                                        var video = document.getElementById("finalVideo");
                                        video.currentTime = 0;
                                        video.play();
                                        $scope.PlayAudio('vac-making.mp3');

                                        setTimeout(function() {

                                            // 영상 멈추기
                                            video.pause();
                                            $scope.misn.misn7Final.pg = 4;
                                            $scope.PlayAudio('vac-success.mp3');
                                            $scope.misn.misn7Final.isFinal = false;

                                        }, 17000);

                                    }, 1000);

                                }, 10000);



                            }, 1000);

                        })
                        .catch(function(error) {
                            alert(error.response.error.msgKo);
                        });


                    } else {
                        $scope.err.Open("현재 다른팀이 진행중입니다.<br/>잠시후에 시도해주세요.");
                        $scope.misn.misn4Quiz.isPrinting = false;
                    }
                });



            } else {
                $scope.err.Open("정확한 희석 비율을 입력하세요.");
            }





        };








        $scope.isLogining = false;

        /**
         * 로그인
         * @constructor
         */
        $scope.Login = function() {
            if(!$scope.isLogining) {

                $scope.isLogining = true;


                CoreSvc.Connect($scope.teamInfo.idCode, $scope.teamInfo.name, $scope.teamInfo.ctrlNo).then(function(res) {

                    CoreSvc.GetCurrentProgram().then(function(res) {
                        if(res.dataInfo) {
                            localStorage.setItem('prgID', res.dataInfo.ID);
                            localStorage.setItem('dtEnd', res.dataInfo.dt_end);
                        }
                    })
                    .catch(function(error) {
                        alert(error.response.error.msgKo);
                    });

                    localStorage.setItem('teamID', res.dataInfo.ID);
                    localStorage.setItem('idCode', $scope.teamInfo.idCode);
                    localStorage.setItem('name', $scope.teamInfo.name);
                    localStorage.setItem('misnArch', JSON.stringify($scope.misn.archive));
                    $scope.CheckMission();
                    $location.path("/start");
                    $scope.isLogining = false;

                    $scope.stopwatch.Reset();
                })
                .catch(function(error) {
                    alert(error.response.error.msgKo);
                });
            }
        };

        /**
         * 로그아웃 (초기화)
         * @constructor
         */
        $scope.Logout = function() {
            clearTimeout($scope.forceTimer);

            $scope.forceTimer = setInterval(function(){
                $scope.forceCloseQ = 5;
            },$scope.forceInterval);

            $scope.forceCloseQ = $scope.forceCloseQ - 1;

            if(!$scope.forceCloseQ) {
                if(confirm("현재 미션을 초기화할까요?")) {

                    CoreSvc.Disconnect().then(function(res) {

                        //localStorage.clear();
                        localStorage.removeItem('teamID');
                        localStorage.removeItem('name');
                        localStorage.removeItem('idCode');
                        localStorage.removeItem('misnArch');
                        localStorage.removeItem('dtEnd');

                        // 초기화
                        $scope.teamInfo.idCode = "";
                        $scope.teamInfo.name = "";

                        // 재시작
                        $ionicHistory.clearHistory();
                        setTimeout(function (){
                            $window.location.reload(true);
                        }, 100);

                    })
                    .catch(function(error) {
                        alert(error.response.error.msgKo);
                    });

                } else {
                    $scope.forceCloseQ = 5;
                }
            }
        };

        /**
         * 로그인 확인
         * @param isLogin
         * @param url
         * @constructor
         */
        $scope.LoginCheck = function(isLogin, url) {

            if(isLogin) { // 로그인 확인

                if(!CoreSvc.isLogin()){ // 로그인 실패
                    $location.path(url);
                } else {
                    $scope.teamInfo.name = CoreSvc.GetTeamName();
                    $scope.teamInfo.idCode = CoreSvc.GetCodeID();
                    $scope.teamInfo.id = CoreSvc.GetTeamID();
                }

            } else { // 로그아웃 확인

                if(CoreSvc.isLogin()){ // 로그인 상태
                    $location.path(url);
                }

            }
        };





        $scope.CheckComplete = function() {

        };





        $scope.map = {};
        $scope.map.open = false;
        $scope.map.no = 1;
        $scope.map.spotNo = null;

        /**
         * 지도 영역 표시 체크
         * @param noMisn
         * @param noPage
         * @constructor
         */
        $scope.map.CheckSpot = function(noMisn, noPage) {

            if($scope.misn.list[noMisn].map[noPage].length) {


                $(".btn-map").addClass("active");

                angular.forEach($scope.misn.list[noMisn].map[noPage], function(value, key) {
                    $(".map-spot-"+value.mapNo+"-"+value.mapSpotNo).addClass("active");
                    //$scope.map.no = value.mapNo;
                    //$scope.map.spotNo  = value.mapSpotNo;
                });


            } else {
                $(".map-spot").removeClass("active");
                $(".btn-map").removeClass("active");
                $scope.map.spotNo  = null;
            }

        };


        $scope.keymap = {};
        $scope.keymap.open = false;
        $scope.keymap.list = [];

        $scope.keymap.Load = function() {

            $scope.keymap.list = MisnSvc.GetMissionArchive();
        };


        /**
         * 에러 메세지
         * @type {{}}
         */
        $scope.err = {};
        $scope.err.msg = null;
        $scope.err.isOpen = false;

        /**
         * 에러 메세지 오픈
         * @param msg
         * @constructor
         */
        $scope.err.Open = function(msg) {
            $scope.err.msg = msg;
            $scope.err.isOpen = true;
        };

        /**
         * 확인 메세지
         * @type {{}}
         */
        $scope.cmf = {};
        $scope.cmf.msg = null;
        $scope.cmf.isOpen = false;
        $scope.cmf.isDisableClose = false;

        /**
         * 확인 메세지 오픈
         * @param msg
         * @constructor
         */
        $scope.cmf.Open = function(msg) {
            $scope.cmf.msg = msg;
            $scope.cmf.isOpen = true;
        };
    })
    .controller('MapCtrl', function($scope) {



    })
    .controller('KeymapCtrl', function($scope) {


    })
    .controller('MissionCtrl', function($scope) {


    });





