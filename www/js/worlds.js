/**
 * AR 인식을 위한 경로
 * @type {*[]}
 */
var worlds = [
    [
        {
            "path": "www/world/mission3/index.html",
            "requiredFeatures": [
                "2d_tracking"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        },
        {
            "path": "www/world/mission4/index.html",
            "requiredFeatures": [
                "2d_tracking"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        },
        {
            "path": "www/world/mission6/index.html",
            "requiredFeatures": [
                "2d_tracking"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        }
    ]
];

function getWordPath(category, sample) {
    return worlds[category][sample];

};