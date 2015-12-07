var World = {
	loaded: false,

	init: function initFn() {
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		/*
		 First an AR.ClientTracker needs to be created in order to start the recognition engine. It is initialized with a URL specific to the target collection. Optional parameters are passed as object in the last argument. In this case a callback function for the onLoaded trigger is set. Once the tracker is fully loaded the function worldLoaded() is called.

		 Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
		 Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.

		 Adding multiple targets to a target collection is straightforward. Simply follow our Target Management Tool documentation. Each target in the target collection is identified by its target name. By using this target name, it is possible to create an AR.Trackable2DObject for every target in the target collection.
		 */
		this.tracker = new AR.ClientTracker("assets/tracker.wtc", {
			onLoaded: this.worldLoaded
		});

		/*
		 The button is created similar to the overlay feature. An AR.ImageResource defines the look of the button and is reused for both buttons.
		 */
		this.imgButton = new AR.ImageResource("assets/btn-save-ar.png");


		var button1 = this.createWwwButton("6_0", "스티커 1", 0.5, { offsetX: 0, offsetY: 0 });
		var page1 = new AR.Trackable2DObject(this.tracker, "cover", { drawables: { cam: [button1] } });


	},

	createWwwButton: function createWwwButtonFn(itemNo, itemName, size, options) {
		/*
		 As the button should be clickable the onClick trigger is defined in the options passed to the AR.ImageDrawable. In general each drawable can be made clickable by defining its onClick trigger. The function assigned to the click trigger calls AR.context.openInBrowser with the specified URL, which opens the URL in the browser.
		 */
		options.onClick = function() {
			document.location = 'architectsdk://getItem?id='+itemNo;
		};
		return new AR.ImageDrawable(this.imgButton, size, options);
	},

	createWwwButton2: function createWwwButtonFn(itemNo, itemName, size, options) {
		/*
		 As the button should be clickable the onClick trigger is defined in the options passed to the AR.ImageDrawable. In general each drawable can be made clickable by defining its onClick trigger. The function assigned to the click trigger calls AR.context.openInBrowser with the specified URL, which opens the URL in the browser.
		 */
		options.onClick = function() {
			document.location = 'architectsdk://getItem?id='+itemNo;
		};
		return new AR.ImageDrawable(this.imgButton2, size, options);
	},

	worldLoaded: function worldLoadedFn() {
		/*
		 var cssDivInstructions = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
		 var cssDivStyle = " style='display: table-cell;vertical-align: middle; text-align: left; padding-right: 15px;'";
		 document.getElementById('loadingMessage').innerHTML =
		 "<div" + cssDivInstructions + ">다음 이미지를 스캔하세요 (3초간):</div>" +
		 "<div" + cssDivStyle + "><img src='assets/TC1-thumb.jpg'></img></div>" +
		 "<div" + cssDivStyle + "><img src='assets/TC2-thumb.jpg'></img></div>" +
		 "<div" + cssDivStyle + "><img src='assets/TC3-thumb.jpg'></img></div>" +
		 "<div" + cssDivStyle + "><img src='assets/TC4-thumb.jpg'></img></div>";

		 // Remove Scan target message after 10 sec.
		 setTimeout(function() {
		 var e = document.getElementById('loadingMessage');
		 e.parentElement.removeChild(e);
		 }, 5000);
		 */
	}
};

World.init();
