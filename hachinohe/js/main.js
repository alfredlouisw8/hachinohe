const AdCampaign = getParameterByName("exl_acp") || "";

var settings = {
	// Mode: "act",
	NumberOfAdults: "1",
	Shortname: "visit_hachinohe_web",
	BrandingStyle: V3.Utils.QueryString["exl_bs"] || "visit_hachinohe_web",
	Campaign: {
		AdCampaignCode: AdCampaign,
		DealCampaignCode: null,
	},
	Language: getLanguage(),
	CampaignService: V3.WebServices.CampaignService,
	EntityService: DistributorToolkit.Services.EntityService,
	InjectionService: DistributorToolkit.Services.InjectionService,
	PriceWindow: {
		Date: new V3Date(),
		Size: 7 * 6, //6 weeks
	},
	PageSize: 6,
	SortOrder: 0,
	ResultsContainerId: "results-container",
	ResultsContainerMapId: "results-map",
	zoomMap: 7,
	centerLocation: { lat: 41.04193177775409, lng: 140.54584898125 },
	NoImageUrl:
		"https://www.reforsindo.com/devwork/hadi/hachinohe/images/no_photo.jpg",
	BannerContainerId: "pnlCampaignBanner",
};

/****************************************
 Global Variables
 ****************************************/
var animationSpeed = 300;
var smallScreenWidth = 640;
var largeScreenWidth = 768;
var productImageRatio = 3 / 4;
var cartImageRatio = 3 / 4;

/****************************************
 Utilities
 ****************************************/
// Grab all the data from a result item

function getItemInfo(item) {
	var data = {};

	// Find all the details about the item
	// data["status"] = $(item).data("status");
	data["title"] = $(item).find(".product-title").text();
	data["subtitle"] = $(item).find(".product-subtitle").text();
	data["price"] = $(item).find(".amount").text().trim();
	data["image"] = $(item).data("image");
	data["id"] = $(item).data("id");
	data["phone"] = $(item).data("phone");
	data["email"] = $(item).data("email");
	data["website"] = $(item).data("website");
	data["add1"] = $(item).data("add1");
	data["add2"] = $(item).data("add2");
	data["desc"] = $(item)
		.find(".product-details .product-desc.product-desc-long")
		.html();
	// console.log(data["status"]);
	return data;
}

// Set the item height based on width
function setItemHeight(item, ratio) {
	$(item).height($(item).width() * ratio);
}

/****************************************
 Book Modal
 ****************************************/
function showBookModal(event) {
	event.preventDefault();
	event.stopPropagation();
}

/****************************************
 Result Items
 ****************************************/
// Show the discount information if they have content
function showSpecials() {
	$(".special-label").each(function () {
		if ($(this).html() != "") $(this).show();
	});
}

// Populate and display the preview modal
function showPreviewModal(event) {
	event.preventDefault();
	event.stopPropagation();

	var $this = $(this);

	// Find the list item that was clicked
	var item = $this.closest("li");

	// Find all the details about that item
	var data = null;
	data = getItemInfo(item);

	// alert(JSON.stringify(data));

	// Assign values to the modal
	$(".product-info").show();
	var modal = $(".preview-box");
	modal.data("id", data["id"]);
	modal.data("status", data["status"]);
	modal.find(".product-title").text(data["title"]);
	modal.find(".product-subtitle").text(data["subtitle"]);
	modal.find(".product-price .dollar").text(data["price"] ? "From " : "");
	modal.find(".product-price .amount").text(data["price"]);
	modal.find(".product-add").attr("data-id", data["id"]);

	var imageHolder = modal.find(".product-images .product-images-slick");
	imageHolder.html("");

	let imageLink;
	for (var i in data["image"]) {
		imageLink = data["image"][i].l;
		// imageLink = imageLink.replace('book','uatbook');

		switch (data["image"][i].t) {
			case "i": // images
				$(
					"<div class='slick-bg-image fouc-stopper'><img class='product-image' src='" +
						imageLink +
						"' data-lazy='" +
						imageLink +
						"' alt='' /></div>"
				).appendTo(imageHolder);
				break;
			case "y": // youTube videos
				$(
					"<div><iframe width='100%' height='315' src='https://www.youtube.com/embed/" +
						imageLink +
						"' frameborder='0' allowfullscreen></iframe></div>"
				).appendTo(imageHolder);
				break;
			default:
		}
	}

	modal.find(".product-info.phone").text(data["phone"]);
	if (!data["phone"]) $(".product-info.phone").hide();

	modal.find(".product-info.email a").attr("href", "mailto:" + data["email"]);
	modal.find(".product-info.email a").text(data["email"]);
	if (!data["email"]) $(".product-info.email").hide();

	modal.find(".product-info.website a").attr("href", data["website"]);
	modal
		.find(".product-info.website a")
		.text(data["website"] ? data["website"].replace(/^https?\:\/\//i, "") : "");
	if (!data["website"]) $(".product-info.website").hide();

	modal.find(".product-info.address1").text(data["add1"] + ", " + data["add2"]);

	$(".product-info.address2").removeClass("pin");
	if (!data["add1"]) {
		$(".product-info.address1").hide();
		$(".product-info.address2").addClass("pin");
	}
	if (!data["add2"]) $(".product-info.address2").hide();

	var desc = data["desc"];
	modal.find(".product-details").html(desc);

	if (isExistInCart(data["id"])) {
		modal.find(".add-btn").addClass(getRemoveClass());
		modal.find(".add-btn").removeClass(getAddClass());
	} else {
		modal.find(".add-btn").addClass(getAddClass());
		modal.find(".add-btn").removeClass(getRemoveClass());
	}

	//show preview modal
	$(".preview-body").scrollTop();
	$(".preview-parent").show();

	//Translate Page
	translatePage();

	loadSlick();
}

function getAddClass() {
	return $("#productType").val() == "3" ? "LT-102" : "LT-117";
}

function getRemoveClass() {
	return $("#productType").val() == "3" ? "LT-103" : "LT-118";
}

function showCartModal() {
	$(".cart-modal-parent").show();
	translatePage();
}

//close preview modal
function closePreview() {
	$(".preview-parent").hide();
	unloadSlick();
}

function closeCartModal() {
	$(".cart-modal-parent").hide();
}

function loadSlick() {
	var slickContainer = $(".product-images-slick");
	const options = {
		lazyLoad: "progressive",
		dots: true,
		arrows: true,
		draggable: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
		// centerMode: true,
	};

	slickContainer.slick(options);
}

function unloadSlick() {
	var slickContainer = $(".product-images-slick");
	slickContainer.slick("unslick");
}

// Load more results
function loadMore(event) {
	event.preventDefault();
	event.stopPropagation();

	// alert("load more results");
}

/****************************************
 Shopping Cart
 ****************************************/
// Create a shopping cart item
function buildCartItem(data) {
	// Get the first image
	var img = null;
	for (var i in data["image"]) {
		if (data["image"][i].t === "i") {
			img = img || data["image"][i].l;
		}
	}

	const productId = data["id"];
	// Build the cart item
	var $item = $(
		[
			'<li class="' +
				data["id"] +
				'" data-id="' +
				data["id"] +
				'" data-status="' +
				data["status"] +
				'" data-image="' +
				img +
				'">',
			'<div class="cart-item clearfix" data-equalizer>',
			// '<div class="small-5 medium-5 xlarge-5 columns cart-item-image" data-equalizer-watch>',
			// '<div class="cart-item-thumb"></div>',
			// '</div>',
			'<div class="cart-item-desc" data-equalizer-watch>',
			'<div class="product-title">' + data["title"] + "</div>",
			'<div class="product-price"><span class="LT-17 from">From </span>',
			'<span class="amount">' + data["price"] + "</span>",
			` <span class="LT-17 from ja-price">From</span>`,
			"</div>",
			'<div class="cart-button-container">' +
				`<button class="trashcan cart-item-remove mybtn btn-white LT-18" 
              onclick="removeFromCart('${productId}')">Remove</button>` +
				"</div>",
			"</div>",
			'<div class="small-1 columns" data-equalizer-watch>',
			'<div class="trashcan"></div>',
			"</div>",
			"</div>",
			"</li>",
		].join("\n")
	);

	//if title is undefined or empty, don't add to the basket
	if (data["title"]) {
		$item.appendTo(".item-list");
	}
}

// Add an item to the shopping cart
function addToCart(event, isPreviewed = false) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}

	// Get the item data
	var parent = $(event.target).closest(".product-id");
	if (parent.prop("tagName") === "LI") {
		parent.attr("data-status", "true");
		var data = getItemInfo(parent);

		data["status"] = "true";
	} else if (parent.length > 0) {
		var id = parent.data("id");
		var status = parent.data("status");
		parent.attr("data-status", "true");
		var data = getItemInfo($(".product-list li[data-id=" + id + "]"));
		data["status"] = "true";
	} else {
		parent = $(this).closest("#mapInfoBox");
		parent.attr("data-status", "true");
		var data = getItemInfo(parent);
		data["status"] = "true";
	}

	// Prevent duplicate items being added
	if ($(".shopping-cart li[data-id = " + data["id"] + "]").length === 0) {
		// Build the cart item
		buildCartItem(data);

		// Update the "Book now" button
		updateBookBtn();

		// Save the shopping cart information
		saveCookie();

		$(".btn-" + parent.data("id")).removeClass(getAddClass());
		$(".btn-" + parent.data("id")).addClass(getRemoveClass());
	} else {
		removeFromCart(data["id"]);
	}

	if (isPreviewed) {
		//close preview
		closePreview();
	}

	translatePage();
}

// Remove an item from the shopping cart
function removeFromCart(productId = null) {
	var $eqElem = $("body").find("[data-id='" + productId + "']");

	$eqElem.attr("data-status", "false");
	var add_btn = $(".btn-" + productId);

	add_btn.removeClass(getRemoveClass());
	add_btn.addClass(getAddClass());

	$("." + productId).remove();
	updateBookBtn();

	// Save the shopping cart information
	saveCookie();

	//Translate Page
	translatePage();
}

// Equalizes the heights of divs within a shoppinf cart item so that the arrows and trashcan icon appear in line
function cartItemHeight($item) {
	if ($item) {
		var height = Math.max(
			$item.find(".cart-item-image").height(),
			$item.find(".cart-item-desc").height()
		);
		$item.find(".cart-item > div").css("height", height);
	}
}

// Update the count on the "Book now" buttons
function updateBookBtn() {
	const langClass = $("#productType").val() == "3" ? "LT-101" : "LT-116";

	var count = $(".cart-column .item-list li").length;
	$(".itinerary-title").html(
		`<span class="${langClass}">Itinerary</span>` +
			(count != 0 ? " (" + count + ")" : "")
	);
	$(".my-journey-btn").html(
		`<span class="${langClass}">Itinerary</span>` +
			(count != 0 ? " (" + count + ")" : "")
	);

	return "";
}

// Move a cart item up one place
function moveUp() {
	var parent = $(this).closest("li");
	parent.insertBefore(parent.prev());

	// Save the shopping cart information
	saveCookie();
}

// Move a cart item down one place
function moveDown() {
	var parent = $(this).closest("li");
	parent.insertAfter(parent.next());

	// Save the shopping cart information
	saveCookie();
}

// Add event handlers to shopping cart items
function addCartEvents() {
	// Disable previous events
	$(".arrow-up, .arrow-down, .trashcan").off("click");
	$(".cart-item").off("touchend");

	// Add click events
	$(".arrow-up").on("click", moveUp);
	$(".arrow-down").on("click", moveDown);
}

// Open the shopping cart modal on small (mobile) devices
function showCartModal(event) {
	$(".cart-modal-parent").show();
}

// Close the cart modal and make the "Journey" button appear
function closeCartModal() {
	$(".cart-modal-parent").hide();
}

// Position the "My Journey" button
function moveMyJourney() {}

/****************************************
 Shopping Cart Cookie
 ****************************************/
// Store the shopping cart data in a cookie
function saveCookie() {
	var name = $(".journey-name").val();
	var journey = [];
	$(".cart-column .item-list li").each(function (i) {
		var $this = $(this);
		var id = $this.data("id");
		var status = $this.data("status");
		var image = $this.data("image");
		var title = $this.find(".product-title").text();
		var price = $this.find(".amount").text();
		journey.push({
			id: id,
			status: status,
			image: image,
			title: title,
			price: price,
		});

		console.log({ itemIndex: i });
	});

	localStorage.setItem("hachinohe_cart", JSON.stringify(journey));
}

// Get data from the cookie and recreate the shopping cart
function populateFromCookie(productNames = null) {
	var journey = JSON.parse(localStorage.getItem("hachinohe_cart") || "[]");

	// var journey = data["journeyCart_MG"] || []; // in case the cookie info doesn't exist
	$(".cart-results > .item-list").html();
	for (var i = 0; i < journey.length; i++) {
		//replace product name according to selected language
		journey[i]["title"] =
			productNames && productNames.length > 0
				? productNames[journey[i]["id"]]
				: journey[i]["title"];

		// buildCartItem() is expecting an object array
		journey[i]["image"] = [{ t: "i", l: journey[i]["image"] }];

		buildCartItem(journey[i]);
	}

	// Update the "Book now" button
	updateBookBtn();
	//Translate page
	translatePage();
}

function isExistInCart(itemId) {
	const cart = JSON.parse(localStorage.getItem("hachinohe_cart") || "[]");
	const cartLength = cart ? cart.length : 0;

	for (let i = 0; i < cartLength; i++) {
		if (cart[i]["id"].trim() == itemId.trim()) {
			return true;
		}
	}
	return false;
}

/****************************************
 Dragging
 ****************************************/
function draggingController() {
	if ($(window).innerWidth() > smallScreenWidth) addDragging();
	else removeDragging();
}

// Add dragging functionality
function addDragging() {}

// Remove dragging functionality (used on small/mobile for better scrolling)
function removeDragging() {}

/****************************************
 Search bar
 ****************************************/
// Hide/Show the search bar
function toggleSearch() {
	$(".toggle-search img").toggleClass("expanded");
	$(".search-details").slideToggle(animationSpeed, function () {
		moveMyJourney();
	});
}

// Placeholder replacement
function keywordFill() {
	// Remove previous events from site.js
	$(".keyword").off("focus blur keyup");

	// Add new events
	$(".keyword")
		.on("focus", function () {
			if ($(this).val() == "Name") {
				$(this).val("");
			}
		})
		.on("blur", function () {
			if ($(this).val().toLowerCase() == "") {
				$(this).val("Name");
			}
		});
}

/****************************************
 Ready To Go
 ****************************************/
$(document).ready(function () {
	V3.Namespace("Page", window);
	cookieConsent();

	/****************************************
     Initialisation
     ****************************************/

	// Set the height of the product images
	setItemHeight($(".product-list .product-image"), productImageRatio);

	// Fill shopping cart with data stored in the cookie
	// populateFromCookie();

	// Make special offers visible
	showSpecials();

	// Search placeholder replacement
	keywordFill();

	// Fix initial bounce of selectBox-0.2.js
	$(".sbToggle, .sbSelector").off("click");
	$(".sbToggle, .sbSelector").on("click", function (event) {
		event.preventDefault();
		event.stopPropagation();
		$(this).siblings(".sbOptions").slideToggle();
	});

	/****************************************
     Events
     ****************************************/
	// Toggle the search field visibility
	//$(".toggle-search").on("click", toggleSearch);

	// Close cart modal by clicking the cross
	$(".cart-close").on("click", closeCartModal);

	// Clicking the "My Journey" button
	$(".my-journey-btn").on("click", showCartModal);

	// Click the "Book" button
	$(".book-btn").on("click", showBookModal);

	// Click the "Continue" button
	$(".continue-btn").on("click", function (event) {
		event.preventDefault();
		//     alert("Continue Booking");
	});

	// Add dragging ability
	// draggingController();

	// React to screen changes
	$(window).on("scroll resize", moveMyJourney);
	$(window).on("resize", function () {
		draggingController();
		setItemHeight($(".product-list .product-image"), productImageRatio);
		// setItemHeight($(".item-list .cart-item-thumb"), cartImageRatio);
	});

	// Remove style changes to shopping cart icons on "touch" anywhere
	$("body").on("touchstart", function () {
		$(".item-list .trashcan").removeAttr("style");
		$(".product-list .product-overlay").removeAttr("style");
	});

	//set up hachinohe wordpress
	setUpHachinoheWordpress();

	// Display product overlay when tabbing though buttons
	$(".button-container a")
		.on("focus", function () {
			$(this).closest(".product-overlay").addClass("show");
		})
		.on("blur", function () {
			$(this).closest(".product-overlay").removeClass("show");
		});

	Page.Controller = new V3.TNTController(settings);
	$("#results-map").on("click", ".add-btn", addToCart);
});

function cookieConsent() {
	var cookieConsentContainer = document.querySelector("#cookieConsent button");
	if (document.cookie.indexOf("gdpr_consent") >= 0) {
		document.body.classList.add("consent-given");
	}

	if (cookieConsentContainer) {
		cookieConsentContainer.addEventListener(
			"click",
			function (el) {
				el.preventDefault();
				document.cookie =
					"gdpr_consent=_gdpr_consent_given; max-age=31536000; path=/";
				document.body.classList.add("consent-given");
			},
			false
		);
	}
}

function isScrolledIntoView(el) {
	if (!el) return;
	var rect = el.getBoundingClientRect();
	var elemTop = rect.top;
	var elemBottom = rect.bottom;
	var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
	return isVisible;
}

function userAgent() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("Trident/"); //IE 11

	if (msie > 0) {
		document.body.className = document.body.className
			? document.body.className + " ie11"
			: "ie11";
	}
}

function populateDesintations(parentLocationId) {
	V3.WebServices.EntityService.GetChildLocations(
		function (data) {
			//success
			buildDestinations(data);
		},
		function (response) {
			//fail
			console.log("fail", response);
		},
		parentLocationId //'902b19b4-19f4-4e16-88e9-f79ba53a4749'//Aomori ken book
	);

	//'5d72b8ce-7937-4bc0-8809-d6d01be5edf2'//Aomori ken devbook
}

function getCountryId() {
	V3.WebServices.EntityService.GetPrimaryLocations(
		function (data) {
			//success
			getAomoriKen(data[0].Id);
		},
		function (response) {
			//fail
			console.log("fail", response);
		},
		["Country"]
	);
}

function getAomoriKen(CountryId) {
	V3.WebServices.EntityService.GetChildLocations(
		function (data) {
			//Find Aomori Ken (SAmk)
			for (i = 0; i <= data.length - 1; i++) {
				if (data[i].Code == "SAmK") {
					populateDesintations(data[i].Id);
				}
			}
		},
		function (response) {
			//fail
			console.log("fail", response);
		},
		CountryId
	);
}

function buildDestinations(data) {
	let destinations = [];
	data.forEach(function (item, index) {
		destinations[item["Name"].toLowerCase()] = item["Id"];
	});

	const aomoriCityCodes = {
		hachinohe: "LT-81",
		sannohe: "LT-82",
		gonohe: "LT-83",
		takko: "LT-84",
		nambu: "LT-85",
		hashikami: "LT-86",
		shingo: "LT-87",
		oirase: "LT-89",
	};

	const aomoriCities = [
		"hachinohe",
		"sannohe",
		"gonohe",
		"takko",
		"nambu",
		"hashikami",
		"shingo",
		"oirase",
	];

	aomoriCities.forEach(function (item) {
		$(
			"#searchDestination"
		).append(`<option value="${destinations[item]}" class="${aomoriCityCodes[item]}">
                    Hachinohe </option>`);
	});
}

async function setUpHeadingImage() {
	const productType = $("#productType").val();

	let headingImage =
		"https://www.reforsindo.com/devwork/hadi/hachinohe/images/all_TOP.jpg";
	switch (productType) {
		case "0":
			headingImage =
				"https://www.reforsindo.com/devwork/hadi/hachinohe/images/accommodations_TOP.jpg";
			break;
		case "1":
			headingImage =
				"https://www.reforsindo.com/devwork/hadi/hachinohe/images/activities_TOP.jpg";
			break;
		case "2":
			headingImage =
				"https://www.reforsindo.com/devwork/hadi/hachinohe/images/Epicurean_TOP.jpg";
			break;
		case "3":
			headingImage =
				"https://www.reforsindo.com/devwork/hadi/hachinohe/images/Produce_TOP.jpg";
			break;
		default:
			break;
	}

	const campaign = await getAdCampaign();

	headingImage =
		campaign && campaign.ImageUrl ? campaign.ImageUrl : headingImage;

	$(".page-heading").prepend(`<div class="page-heading--image" 
    style="background-image: url('${headingImage}')"></div>`);
}

async function getAdCampaign() {
	if (!settings.Campaign.AdCampaignCode) return null;

	const url =
		"https://book.txj.co.jp/v4/Services/CampaignService.jsws/GetAdCampaign?";
	const request = {
		rq: {
			shortname: settings.Shortname,
			Code: settings.Campaign.AdCampaignCode,
		},
	};

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	}).catch((error) => {
		console.error("Error:", error);
	});

	return await response.json();
}

function setUpHachinoheWordpress() {
	setUpItineraryPage();

	setUpHeadingImage();

	$("#page-heading--title").hide();

	$(".page-heading.type-bgcolor")
		.removeClass("type-bgcolor")
		.addClass("type-archive");

	$("h2.no-style").remove();
	$("ul.list-dib").remove();
}

function getProductType() {
	let productType = document.getElementById("productType").value;
	productType = productType == "4" ? null : productType;
	return productType;
}

function cutText(text) {
	return text;
	var english = /^[A-Za-z0-9]*$/;
	console.log(english.test(text));
	const MAX_LENGTH = english.test(text) ? 42 : 80;

	// if(getLanguage() == 'ja-JP' || getLanguage() == 'zh-CN'){
	//     return text.substr(0,47);
	// }

	if (text.length <= MAX_LENGTH) return text;

	const words = text.split("");

	let newText = "";
	let beforeText = "";

	for (i = 0; i <= words.length - 1; i++) {
		beforeText = newText;
		newText += "" + words[i];

		if (newText.length == MAX_LENGTH) {
			return newText;
		}

		if (newText.length > MAX_LENGTH) {
			return beforeText;
		}
	}
}

function showWarning($message) {
	$("body").append(warningModal($message));
	$(".warning-parent").show();
}

function closeWarning() {
	$(".warning-parent").remove();
}

function warningModal(message) {
	const closeText = getLanguageData(93);
	return `
        <div class="warning-parent">
            <div class="warning-overlay"></div>
            <div class="warning-container">
                <div class="warning-box">
                    <div class="warning-body">${message}</div>
                    <div class="warning-footer">
                        <div class="mybtn btn-black product-add button add-btn" 
                        onclick="closeWarning()">
                            ${closeText}                 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initMap() {
	var map = new google.maps.Map(document.getElementById("results-map"), {
		zoom: settings.zoomMap,
		center: settings.centerLocation,
	});
}

$(window).load(function () {
	userAgent();

	// populateDesintations();
	getCountryId();

	// $(".my-journey-wrapper").animate({ opacity: 1 }, animationSpeed);
	$(".cart-btn-mobile-wrapper").on("click", showCartModal);

	// Translate all coded texts on the page
	translatePage();

	$(".tab-header").click(function () {
		$(".tab-header-active").removeClass("tab-header-active");

		const me = $(this);

		me.addClass("tab-header-active");
		tab_active = me.attr("tab");

		$(".tab-active").removeClass("tab-active");
		$(`.${tab_active}`).addClass("tab-active");
	});
});

$(window).scroll(function () {
	var $searchRow = document.querySelector(".search-row");
	// console.log(isScrolledIntoView($searchRow));
	if (isScrolledIntoView($searchRow)) {
		document.querySelector("body").classList.remove("wishlist-sticky");
	} else {
		document.querySelector("body").classList.add("wishlist-sticky");
	}
});
