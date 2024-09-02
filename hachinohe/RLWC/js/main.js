var settings = {
	// Mode: "act",

	NumberOfAdults: "1",

	Shortname: "RLWC2021",

	BrandingStyle: V3.Utils.QueryString["exl_bs"] || "RLWC2021",

	Campaign: {
		AdCampaignCode: "",

		DealCampaignCode: null,
	},

	Language: "en-US",

	CampaignService: V3.WebServices.CampaignService,

	EntityService: DistributorToolkit.Services.EntityService,

	InjectionService: DistributorToolkit.Services.InjectionService,

	PriceWindowTickets: {
		Date: {
			Manchester: new V3Date(2021, 10, 27),

			Newcastle: new V3Date(2021, 9, 23),

			York: new V3Date(2021, 9, 23),

			Leeds: new V3Date(2021, 9, 23),

			Liverpool: new V3Date(2021, 9, 23),

			Coventry: new V3Date(2021, 9, 23),

			Sheffield: new V3Date(2021, 9, 23),
		},

		Size: 7 * 6, //6 weeks
	},

	PriceWindow: {
		Date: new V3Date(),

		Size:
			(new Date(2021, 10, 27).getTime() - new Date().getTime()) /
			(1000 * 3600 * 24),
	},

	PageSize: 6,

	SortOrder: 1,

	TicketsContainer: "results-tickets",

	AccommodationContainer: "results-accommodations",

	ActivitiesContainer: "results-activities",

	TicketProviders: [
		"173579DF-0A4E-439C-A447-835867FDB348", //Manchester - RLWC2021Tickets_OldTrafford

		"7827A852-1CD4-4D62-9AE7-F7891FABFC23", //Newcastle - RLWC2021Tickets_StJamesPark

		"B18CD635-1EEC-4123-BBDC-14AA5D3B27CB", //Newcastle - RLWC2021Tickets_openingweekendnewcastle

		"4B838188-DE3E-4D29-917D-23AE6876349B", //Newcastle - RLWC2021Tickets_kingstonpark

		"0300460B-544A-434E-8558-67DA76C488FC", //York - RLWC2021Tickets_yorklnercommunitystadium

		"0B9E6CFC-B515-47C8-9378-63CAC474BDA0", //Leeds - RLWC2021Tickets_emeraldheadingleystadium

		"DDED5AB1-A306-49F0-B6C3-C7B514163735", //Leeds - RLWC2021Tickets_ellandroad

		"24820F14-E74B-4F0B-86C0-4885D6CECA96", //Liverpool - RLWC2021Tickets_anfield

		"6623D08D-E5D4-4AE2-829D-BF7534972FE8", //Liverpool - RLWC2021Tickets_msbankarena

		"9D245766-2FD0-4166-8F44-A3B13F3F5C84", //Coventry - RLWC2021Tickets_ricoharena

		"0ECD572D-F4CC-4DF8-8863-A5B750B4E98F", // Sheffield - RLWC2021Tickets_bramalllane
	],

	TicketProvider: {
		Manchester: ["173579DF-0A4E-439C-A447-835867FDB348"],

		Newcastle: [
			"B18CD635-1EEC-4123-BBDC-14AA5D3B27CB", //RLWC2021Tickets_openingweekendnewcastle

			"7827A852-1CD4-4D62-9AE7-F7891FABFC23", //RLWC2021Tickets_StJamesPark

			"4B838188-DE3E-4D29-917D-23AE6876349B", //RLWC2021Tickets_kingstonpark
		],

		York: ["0300460B-544A-434E-8558-67DA76C488FC"], // RLWC2021Tickets_yorklnercommunitystadium

		Leeds: [
			"0B9E6CFC-B515-47C8-9378-63CAC474BDA0", //RLWC2021Tickets_emeraldheadingleystadium

			"DDED5AB1-A306-49F0-B6C3-C7B514163735", //RLWC2021Tickets_ellandroad
		],

		Liverpool: [
			"24820F14-E74B-4F0B-86C0-4885D6CECA96", //RLWC2021Tickets_anfield

			"6623D08D-E5D4-4AE2-829D-BF7534972FE8", //RLWC2021Tickets_msbankarena
		],

		Coventry: [
			"9D245766-2FD0-4166-8F44-A3B13F3F5C84", //RLWC2021Tickets_ricoharena
		],

		Sheffield: [
			"0ECD572D-F4CC-4DF8-8863-A5B750B4E98F", //RLWC2021Tickets_bramalllane
		],
	},

	NoImageUrl:
		"https://www.reforsindo.com/devwork/hadi/hachinohe/images/no_photo.jpg",

	BannerContainerId: "pnlCampaignBanner",
};

V3.Namespace("Page", window);

$(document).ready(function () {
	getPage();
});

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

	// service type : tickets, accommodations or activities

	data["serviceType"] = $(item).find(".serviceType").val();

	data["ticketDate"] = $(item).find(".ticketDate").val();

	data["title"] = $(item)
		.find(".product-title")

		.text();

	data["subtitle"] = $(item)
		.find(".product-subtitle")

		.text();

	data["price"] = $(item)
		.find(".amount")

		.text();

	data["image"] = $(item).data("image");

	data["id"] = $(item).data("id");

	data["phone"] = $(item).data("phone");

	data["email"] = $(item).data("email");

	data["website"] = $(item).data("website");

	data["add1"] = $(item).data("add1");

	data["add2"] = $(item).data("add2");

	data["desc"] = $(item)
		.find(".product-details .product-desc.product-desc-short")

		.html();

	// console.log(data["status"]);

	// console.log(data["id"]);

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

	modal.find(".address1").text(data["add1"] + data["add2"]);

	$(".product-info.address2").removeClass("pin");

	if (!data["add1"]) {
		$(".product-info.address1").hide();

		$(".product-info.address2").addClass("pin");
	}

	if (!data["add2"]) $(".product-info.address2").hide();

	var desc = data["desc"];

	modal.find(".product-details").html(desc);

	if (isExistInCart(data["id"])) {
		modal.find(".add-btn").addClass("LT-19");

		modal.find(".add-btn").removeClass("LT-14");
	} else {
		modal.find(".add-btn").addClass("LT-14");

		modal.find(".add-btn").removeClass("LT-19");
	}

	//show preview modal

	$(".preview-body").scrollTop();

	$(".preview-parent").show();

	loadSlick();
}

function showWarning() {
	closeCartModal();

	$(".warning-parent").show();
}

function closeWarning() {
	$(".warning-parent").hide();
}

function showCartModal() {
	$(".cart-modal-parent").show();
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

			'<input type="hidden" class="service-type" value="' +
				data["serviceType"] +
				'">',

			'<div class="product-title">' + data["title"] + "</div>",

			'<div class="' +
				data["serviceType"] +
				' ticketDate" >' +
				new Date(data["ticketDate"]).toDateString() +
				"</div>",

			'<div class="product-price"><span class="LT-17">From </span>',

			'<span class="dollar">' +
				(data["price"] ? "" : "") +
				'</span><span class="amount">' +
				data["price"] +
				"</div",

			"</div>",

			'<div class="cart-button-container">' +
				`<button class="trashcan cart-item-remove" 

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
		$(".booking-cart .item-list").append($item);
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

	if ($(".booking-cart li[data-id = " + data["id"] + "]").length === 0) {
		// Build the cart item

		buildCartItem(data);

		// Update the "Book now" button

		updateBookBtn();

		// Save the shopping cart information

		saveCookie();

		$(".btn-" + parent.data("id")).removeClass("LT-14");

		$(".btn-" + parent.data("id")).addClass("LT-19");
	} else {
		removeFromCart(data["id"]);
	}

	if (isPreviewed) {
		//close preview

		closePreview();
	}
}

// Remove an item from the shopping cart

function removeFromCart(productId = null) {
	var $eqElem = $("body").find("[data-id='" + productId + "']");

	$eqElem.attr("data-status", "false");

	var add_btn = $(".btn-" + productId);

	add_btn.removeClass("LT-19");

	add_btn.addClass("LT-14");

	$("." + productId).remove();

	updateBookBtn();

	// Save the shopping cart information

	saveCookie();
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
	var count = $(".cart-column .item-list > li").length;

	$(".booking-cart__count").html(count);

	if (count == 0) {
		$(".booking-cart .item-list").addClass("item-list--empty");
	} else {
		$(".booking-cart .item-list").removeClass("item-list--empty");
	}
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

		var serviceType = $this.find(".service-type").val();

		var ticketDate = $this.find(".ticketDate").html();

		var id = $this.data("id");

		var status = $this.data("status");

		var image = $this.data("image");

		var title = $this.find(".product-title").text();

		var price = $this.find(".amount").text();

		journey.push({
			id: id,

			serviceType: serviceType,

			status: status,

			image: image,

			title: title,

			price: price,

			ticketDate: ticketDate,
		});
	});

	Cookies.defaults = { expires: 1 };

	Cookies.set("journeyName_MG", name);

	Cookies.set("journeyCart_MG", journey);
}

// Get data from the cookie and recreate the shopping cart

function populateFromCookie() {
	var data = Cookies.getJSON();

	$(".booking-cart .journey-name").val(data["journeyName_MG"]);

	var journey = data["journeyCart_MG"] || []; // in case the cookie info doesn't exist

	$(".cart-results > .item-list").html();

	for (var i = 0; i < journey.length; i++) {
		// buildCartItem() is expecting an object array

		journey[i]["image"] = [{ t: "i", l: journey[i]["image"] }];

		buildCartItem(journey[i]);
	}

	// Update the "Book now" button

	updateBookBtn();
}

function isExistInCart(itemId) {
	const cart = Cookies.getJSON()["journeyCart_MG"];

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
			if (
				$(this)
					.val()

					.toLowerCase() == ""
			) {
				$(this).val("Name");
			}
		});
}

/****************************************

 Ready To Go

 ****************************************/

$(document).ready(function () {
	cookieConsent();

	/****************************************

     Initialisation

     ****************************************/

	// Set the height of the product images

	setItemHeight($(".product-list .product-image"), productImageRatio);

	// Make special offers visible

	showSpecials();

	// Search placeholder replacement

	keywordFill();

	// Fix initial bounce of selectBox-0.2.js

	$(".sbToggle, .sbSelector").off("click");

	$(".sbToggle, .sbSelector").on("click", function (event) {
		event.preventDefault();

		event.stopPropagation();

		$(this)
			.siblings(".sbOptions")

			.slideToggle();
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

	draggingController();

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

	// Make the hover overlay visible on "touch" and hide other overlays

	// $(".product-list li").on("touchstart", function() {

	//     $(this)

	//         .siblings()

	//         .removeClass("show-overlay");

	//     $(this).toggleClass("show-overlay");

	// });

	// Display product overlay when tabbing though buttons

	$(".button-container a")
		.on("focus", function () {
			$(this)
				.closest(".product-overlay")

				.addClass("show");
		})

		.on("blur", function () {
			$(this)
				.closest(".product-overlay")

				.removeClass("show");
		});
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

function getTicketIds() {
	const campaignCode = settings.Campaign.AdCampaignCode;

	const distributor = settings.Shortname;

	V3.WebServices.EntityService.Search(
		function (data) {
			settings.TicketIds = pluckTickets(data.Entities);

			Page.Controller = new V3.TNTController(settings);
		},
		function (response) {
			//fail

			console.log("failed to get ticket ids", response);
		},

		{
			Shortname: distributor,
			Campaign: { AdCampaignCode: campaignCode, DealCampaignCode: "" },

			Filter: {
				Type: "Service",
				MustBeInAdCampaign: true,
				MustBeInDealCampaign: false,
			},
		}
	);
}

function pluckTickets(data) {
	let ticketIds = [];

	let ticketProviders =
		settings.TicketProvider[settings.Campaign.AdCampaignCode];

	data.forEach(function (item, index) {
		if (ticketProviders.contains(item.ParentId.toUpperCase())) {
			ticketIds.push(item.Id);
		}
	});

	return ticketIds;
}

function initMap() {
	var map = new google.maps.Map(document.getElementById("results-map"), {
		zoom: settings.zoomMap,

		center: settings.centerLocation,
	});
}

$(window).load(function () {
	// $(".my-journey-wrapper").animate({ opacity: 1 }, animationSpeed);

	$(".cart-btn-mobile-wrapper").on("click", showCartModal);

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
	var $searchRow = document.querySelector(".wishlist__subtitle");

	// console.log(isScrolledIntoView($searchRow));

	if (isScrolledIntoView($searchRow)) {
		document.querySelector("body").classList.remove("wishlist-sticky");
	} else {
		document.querySelector("body").classList.add("wishlist-sticky");
	}

	// var shoppingCartBottom = document.querySelector('.booking-cart').getBoundingClientRect().bottom;

	// var footerTop = document.querySelector('.footer').getBoundingClientRect().top;

	// var isSticky = document.querySelector('.wishlist-sticky') != null;

	//

	// console.log('isSticky = ' + isSticky + 'shoppingCart = ' + (shoppingCartBottom >= footerTop))

	//

	// if (isSticky && shoppingCartBottom >= footerTop) {

	//     document.querySelector('body').classList.remove('wishlist-sticky');

	// } else {

	//     if(!isScrolledIntoView($searchRow)){

	//         document.querySelector('body').classList.add('wishlist-sticky');

	//     }

	// }
});

function getPage() {
	$.ajax({
		url: "https://itinerary.hadi-syahbal.com/RLWC/",

		type: "GET",

		crossDomain: true,

		dataType: "html",
	})

		.done(function (data) {
			// done

			$(".iframe-container").html(data);

			//set  ad campaign code

			const adCampaignCode = $("#campaign-code").val();

			settings.BrandingStyle = "RLWC2021";

			settings.Campaign.AdCampaignCode = adCampaignCode;

			getTicketIds();

			// Fill shopping cart with data stored in the cookie

			populateFromCookie();
		})

		.fail(function () {
			// error

			console.error("Error buliding destinations dropdown");
		})

		.always(function () {
			// finished
		});
}

function openAccordion(serviceType) {
	const targetAccordion = $(`.accordion-${serviceType}`);

	// $('.accordion').not(`.accordion-${serviceType}`).removeClass('accordion--active');

	if (targetAccordion.hasClass("accordion--active")) {
		targetAccordion.removeClass("accordion--active");
	} else {
		targetAccordion.addClass("accordion--active");
	}
}

function openPrivacyPolicy() {
	event.preventDefault();

	$(".privacy-policy-parent").show();
}

function openTerm() {
	event.preventDefault();

	$(".term-parent").show();
}

function closeNotice() {
	$(".notice-parent").hide();
}

var helper = (function () {
	const fullDateRegex = [
		"\\s*\\d+[th|rd|st|nd]{2}\\s+[a-z]+\\s+\\d{4}\\s?", // ex: 3rd November 2021

		"\\s*\\d{1,2}-\\d{1,2}-\\d{4}\\s?", // ex: 03-11-2021 or 3-11-2021

		"\\s*\\d{1,2}\\/\\d{1,2}\\/\\d{4}\\s?", // ex: 03/11/2020 or 3/1/2020
	];

	const dateRegex = [
		"\\s*\\d+[th|rd|st|nd]{2}\\s?", // 3rd

		"\\s*\\d{1,2}-", // 03- or 3-

		"\\s*\\d{1,2}\\/", // 03/ or 3/
	];

	const yearRegex = [
		"\\s+\\d{4}\\s?", // 2021

		"-\\d{4}\\s?", // -2021

		"\\/\\d{4}\\s?", // /2021
	];

	function extractFullDate(text) {
		const match = text.match(new RegExp(fullDateRegex.join("|"), "ig"));

		return match && match.length ? match[0] : "";
	}

	function extractDate(fullDate) {
		const match = fullDate.match(new RegExp(dateRegex.join("|"), "ig"));

		return match && match.length
			? match[0].replace(/-|\/|\s|th|rd|st|nd/g, "")
			: "";
	}

	function extractMonth(fullDate) {
		return fullDate
			.replace(extractDate(fullDate), "")

			.replace(extractYear(fullDate), "")

			.replace(/-|\/|\s|th|rd|st|nd/g, "");
	}

	function extractYear(fullDate) {
		const match = fullDate.match(new RegExp(yearRegex.join("|"), "ig"));

		return match && match.length ? match[0].replace(/-|\/|\s/g, "") : "";
	}

	function extract(text) {
		if (text === "xxx") {
			return "";
		}

		const fullDate = extractFullDate(text);

		const month = extractMonth(fullDate);

		const date = extractDate(text);

		const year = extractYear(fullDate);

		return new Date(`${year}/${getDateInNumber(month)}/${date}`).toStringFormat(
			"yyyy/MM/dd"
		);
	}

	function getTheEarliestDate(strDates) {
		const dates = strDates

			.filter(function (date) {
				if (isNaN(new Date(date).getTime())) {
					return false;
				}

				return true;
			})
			.map((date) => new Date(date));

		if (!dates.length) {
			//default starting date

			return settings.PriceWindowTickets.Date[settings.Campaign.AdCampaignCode]
				.toString()
				.substring(0, 10);
		} else {
			// sort asc dates then return the first index

			const earliestDate = dates.sort(function (a, b) {
				return a.getTime() - b.getTime();
			})[0];

			return new V3Date(
				earliestDate.getFullYear(),
				earliestDate.getMonth(),
				earliestDate.getDate()
			)

				.toString()
				.substring(0, 10);
		}
	}

	const _date = {
		jan: 1,

		january: 1,

		feb: 2,

		february: 2,

		mar: 3,

		march: 3,

		apr: 4,

		april: 4,

		may: 5,

		jun: 6,

		june: 6,

		jul: 7,

		july: 7,

		aug: 8,

		august: 8,

		sep: 9,

		september: 9,

		oct: 10,

		october: 10,

		nov: 11,

		november: 11,

		dec: 12,

		december: 12,
	};

	function getDateInNumber(dateStr = "") {
		dateStr = dateStr.toLowerCase();

		//if numeric is less or equal to 12, don't do anything and just return the value

		if (!isNaN(dateStr) && parseInt(dateStr) <= 12) return dateStr;

		//if does not exist in _date const, return 1

		if (!_date.hasOwnProperty(dateStr)) return 1;

		return _date[dateStr];
	}

	return {
		extractDateFromText: extract,

		getTheEarliestDate: getTheEarliestDate,
	};
})();
