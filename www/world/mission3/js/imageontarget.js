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
		this.imgButton2 = new AR.ImageResource("assets/btn-wrong-ar.png");



		var img1 = new AR.ImageResource("assets/ar_3_1.png");
		var overlay1 = new AR.ImageDrawable(img1, 1, { offsetX: 0, offsetY: 0 });
		var button1 = this.createWwwButton("3_0", "스티커 1", 0.3, { offsetX: 0, offsetY: -1 });
		var page1 = new AR.Trackable2DObject(this.tracker, "3_1", { drawables: { cam: [overlay1, button1] } });

		var img2 = new AR.ImageResource("assets/ar_3_2.png");
		var overlay2 = new AR.ImageDrawable(img2, 1, { offsetX: 0, offsetY: 0 });
		var button2 = this.createWwwButton("3_1", "스티커 2", 0.3, { offsetX: 0, offsetY: -1 });
		var page2 = new AR.Trackable2DObject(this.tracker, "3_2", { drawables: { cam: [overlay2, button2] } });



		var img3 = new AR.ImageResource("assets/ar_3_3.png");
		var overlay3 = new AR.ImageDrawable(img3, 1, { offsetX: 0, offsetY: 0 });
		var page3 = new AR.Trackable2DObject(this.tracker, "3_3", { drawables: { cam: [overlay3] } });

		var img4 = new AR.ImageResource("assets/ar_3_4.png");
		var overlay4 = new AR.ImageDrawable(img4, 1, { offsetX: 0, offsetY: 0 });
		var page4 = new AR.Trackable2DObject(this.tracker, "3_4", { drawables: { cam: [overlay4] } });

		var img5 = new AR.ImageResource("assets/ar_3_5.png");
		var overlay5 = new AR.ImageDrawable(img5, 1, { offsetX: 0, offsetY: 0 });
		var page5 = new AR.Trackable2DObject(this.tracker, "3_5", { drawables: { cam: [overlay5] } });

		var img6 = new AR.ImageResource("assets/ar_3_6.png");
		var overlay6 = new AR.ImageDrawable(img6, 1, { offsetX: 0, offsetY: 0 });
		var page6 = new AR.Trackable2DObject(this.tracker, "3_6", { drawables: { cam: [overlay6] } });


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
