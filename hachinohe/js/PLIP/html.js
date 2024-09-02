function setUpItineraryPage() {
	const productType = $("#productType").val();

	const heading = setUpHeading(productType);

	const searchSection = setUpSearch(productType);

	const resultSection = setUpResultSection();

	const previewSection = setUpPreviewParent();

	const cartModal = setUpCartModal();

	const itinerary = `

        ${heading}        

        <!-- Search & Book form -->

        ${searchSection}

        <!-- Results Section -->

        ${resultSection}

        <!-- Results Section ends here -->

        ${previewSection}

        ${cartModal}        

    `;

	// $('.itinerary-page-content').html(itinerary);
}

function setUpHeading(productType) {
	let titleClass = "LT-0";

	let subTitleClass = "LT-79";

	let instructionsClass = "LT-113";

	switch (productType) {
		//Accommodations

		case "0":
			titleClass = "LT-0";

			subTitleClass = "LT-79";

			break;

		//Activities

		case "1":
			titleClass = "LT-7";

			subTitleClass = "LT-80";

			break;

		//Restaurants

		case "2":
			titleClass = "LT-95";

			subTitleClass = "LT-99";

			break;

		//Local Produce

		case "3":
			titleClass = "LT-97";

			subTitleClass = "LT-100";

			break;

		//Local Produce

		case "4":
			titleClass = "LT-106";

			subTitleClass = "LT-107";

			break;

		default:
			break;
	}

	return `

        <div class="page-heading--title">

            <h1><span class="${titleClass}">Where to Stay</span> </h1>

            <h3><span class="${subTitleClass}">Find accommodation in the Hachinohe and surrounding area</span></h3>

            <h5 style="margin-bottom: 15px"><span class="${instructionsClass}">Instruction</span></h5>

        </div>

    `;
}

function setUpSearch(productType) {
	let searchSection = searchAccommodation();

	switch (productType) {
		//Accommodations

		case "0":
			break;

		//Activities

		case "1":
			searchSection = searchActivities();

			break;

		//Restaurants

		case "2":
			searchSection = searchRestaurants();

			break;

		//Local Produce

		case "3":
			searchSection = searchProduce();

			break;

		//All

		case "4":
			searchSection = searchAll();

			break;

		default:
			break;
	}

	return searchSection;
}

function searchAccommodation() {
	return `

    <div class="search-row" style="text-align: left;">

            <input type="hidden" id="searchFor" name="searchFor" value="" aria-labelledby="searchForLabel">

            <div class="search-wrapper select-search icon-before type-map">

                <select id="searchDestination" name="searchDestination" class="selectBox medium-3 column" aria-labelledby="searchDestinationLabel">

                    <option value="" class="LT-1">Destination</option>

                    <option value="" class="LT-90">Anywhere</option>

                </select>

            </div>

            <div class="search-wrapper select-search icon-before type-tag">

                <select id="priceRange" name="searchPrice" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">

                    <option value="" class="LT-2">Any Price</option>

                    <option value="0-9999">< ¥9.999</option>

                    <option value="10000-14999">¥10.000 - ¥14.999</option>

                    <option value="15000-19999">¥15.000 - ¥19.999</option>

                    <option value="20000-">¥20.000 +</option>

                </select>

            </div>

            <div class="search-wrapper select-search icon-before type-pax">

                <select id="numberOfPax" name="numberOfPax" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">                    

                    <option value="1" class="LT-114 LT-APPEND">1</option>

                    <option value="2" class="LT-115 LT-APPEND">2</option>

                    <option value="3" class="LT-115 LT-APPEND">3</option>

                    <option value="4" class="LT-115 LT-APPEND">4</option>

                    <option value="5" class="LT-115 LT-APPEND">5</option>

                    <option value="6" class="LT-115 LT-APPEND">6</option>

                    <option value="7" class="LT-115 LT-APPEND">7</option>

                    <option value="7" class="LT-115 LT-APPEND">8</option>

                    <option value="7" class="LT-115 LT-APPEND">9</option>

                    <option value="7" class="LT-115 LT-APPEND">10</option>

                </select>

            </div>



            <div class="search-wrapper input-search">

                <input id="Keyword" type="text" name="Keyword" value="" class="search-keyword LT-3 LT-ph" aria-labelledby="KeywordLabel"

                       placeholder="Type Name">

            </div>

            <div class=" search-wrapper">

                <button class="search-btn btn-black"><span class="LT-4">Search</span></button>

            </div>

        </div>

    `;
}

function searchActivities() {
	return searchAccommodation();
}

function searchRestaurants() {
	return searchAccommodation();
}

function searchProduce() {
	return `

    <div class="search-row" style="text-align: left;">

            <input type="hidden" id="searchFor" name="searchFor" value="" aria-labelledby="searchForLabel">



            <div class="search-wrapper select-search icon-before type-map">

                <select id="searchDestination" name="searchDestination" class="selectBox medium-3 column" aria-labelledby="searchDestinationLabel">

                    <option value="" class="LT-1">Destination</option>

                    <option value="" class="LT-90">Anywhere</option>

                </select>

            </div>

            <div class="search-wrapper select-search icon-before type-tag">

                <select id="priceRange" name="searchPrice" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">

                    <option value="" class="LT-2">Any price</option>

                    <option value="0-9999">&lt; ¥9.999</option>

                    <option value="10000-14999">¥10.000 - ¥14.999</option>

                    <option value="15000-19999">¥15.000 - ¥19.999</option>

                    <option value="20000-">¥20.000 +</option>

                </select>

            </div>



            <div class="search-wrapper select-search icon-before type-category">

                <select id="category" name="searchCategory" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">

                    <option value="" class="LT-105">category</option>                    

                </select>

            </div>

            <div class=" search-wrapper">

                <button class="search-btn btn-black"><span class="LT-4">Search</span></button>

            </div>

        </div>

    `;
}

function searchAll() {
	return `

    <div class="search-row" style="text-align: left;">

            <input type="hidden" id="searchFor" name="searchFor" value="" aria-labelledby="searchForLabel">



            <div class="search-wrapper select-search icon-before type-map">

                <select id="searchDestination" name="searchDestination" class="selectBox medium-3 column" aria-labelledby="searchDestinationLabel">

                    <option value="" class="LT-1">Destination</option>

                    <option value="" class="LT-90">Anywhere</option>

                <option value="2ea962fc-1cde-455a-85ab-353149724b24" class="LT-81">Hachinohe City</option><option value="86a34872-89bf-4d74-b5df-6f35b25027a4" class="LT-82">Sannohe Town</option><option value="ec79580b-24b7-475c-ad44-63ad94943581" class="LT-83">Gonohe Town</option><option value="2f32b195-7b6d-48a7-9258-a7ffc59a613d" class="LT-84">Takko Town</option><option value="42384f81-a5d4-478f-a45f-f71e95fc7de9" class="LT-85">Nanbu Town</option><option value="59049e9e-24db-4ad4-8cf2-128e60555314" class="LT-86">Hashikami Town</option><option value="194aa183-dda5-45a7-89b1-0187d1e5e115" class="LT-87">Shingo Village</option><option value="d8ea2219-6597-4937-aeac-941fd29c905e" class="LT-89">Oirase Town</option></select>

            </div>

            <div class="search-wrapper select-search icon-before type-group">

                <select id="productType" name="productType" class="selectBox medium-3 column" aria-labelledby="searchDestinationLabel">

                    <option value="" class="LT-108">All</option>

                    <option value="0" class="LT-109">Accommodations</option>

                    <option value="1" class="LT-110">Activities</option>

                    <option value="2" class="LT-111">Restaurants</option>

                    <option value="3" class="LT-112">Local Produces</option>

                </select>

            </div>

            <div class="search-wrapper select-search icon-before type-tag">

                <select id="priceRange" name="searchPrice" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">

                    <option value="" class="LT-2">Any Price</option>

                    <option value="0-9999">&lt; ¥9.999</option>

                    <option value="10000-14999">¥10.000 - ¥14.999</option>

                    <option value="15000-19999">¥15.000 - ¥19.999</option>

                    <option value="20000-">¥20.000 +</option>

                </select>

            </div>



            <div class="search-wrapper input-search">

                <input id="Keyword" type="text" name="Keyword" value="" class="search-keyword LT-3 LT-ph" aria-labelledby="KeywordLabel" placeholder="Type Name">

            </div>

            <div class=" search-wrapper">

                <button class="search-btn btn-black"><span class="LT-4">Search</span></button>

            </div>

        </div>

    `;
}

function setUpResultSection() {
	const tabClass = $("#productType").val() == "3" ? "LT-96" : "LT-77";

	return `

 <div class="product-holder module clearfix">

            <div class="cart-btn-mobile-wrapper" onclick="showCartModal()">

                <div style="overflow: hidden;width: 100%;height: auto">

                    <div class="cart-btn-mobile">

                        <div class="text-left itinerary-title">Itinerary</div>

                    </div>

                </div>

            </div>    <div class="products-row">

                <!-- Result Items -->

                <div class="results-column">

                    <div class="tab-wrapper">

                        <div class="tab-headers">

                            <div class="tab-title LT-76">View By:</div>

                            <div class="tab-headers-wrapper">

                                <div class="tab-header tab-header-1 tab-header-active ${tabClass}" tab="tab-1">

                                    Rates

                                </div>

                                <div class="tab-header tab-header-2 LT-78" tab="tab-2">

                                    Map

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="tab tab-1 tab-active">

                        <div class="columns" id="results-container"></div>

                        <div class="more-btn-column">

                            <button class="mybtn btn-black more-btn LT-16">Load More</button>

                            <img src="https://www.reforsindo.com/devwork/hadi/hachinohe/images/ajax-loader.gif" class="loader" alt="loading...">

                        </div>

                    </div>

                    <div class="tab tab-2">

                        <div id="results-map"></div>

                    </div>

                </div>

                <!-- Result Items ends here -->

                <!-- Booking Cart -->

                <div class="cart-column">

                    <div class="shopping-cart">

                        <div class="cart-top">

                            <div class="text-left itinerary-title"><span class="LT-11">Itinerary</span></div>

                        </div>

                        <div class="book-btn-wrapper text-center show-for-medium-up">

                            <button class="button continue-btn btn-black">

                                <span class="LT-12">Check Availability</span>

                            </button>

                        </div>

                        <div class="cart-results">

                            <ul class="item-list"></ul>

                        </div>

                    </div>        </div>

                <!-- Booking Cart ends here -->

            </div>

        </div>

 `;
}

function setUpPreviewParent() {
	return `

    <div class="preview-parent" style="display:none">

            <div class="preview-overlay" onclick="closePreview()"></div>

            <div class="preview-container">

                <div class="preview-box product-id">

                    <div style="width: 100%;height: 40px; overflow: hidden">

                        <div class="btn-close-preview" onclick="closePreview()">

                        </div>

                    </div>

                    <div class="preview-body">

                        <div>

                            <div class="col-product-images">

                                <div class="hide-for-medium-up">



                                </div>

                                <div class="product-images">

                                    <div class="product-images-slick"></div>



                                </div>

                                <div>

                                    <span style="font-weight: bold" class="LT-20">Location</span>:

                                    <span class="product-info address1 pin"></span>

                                </div>

                            </div>

                            <div class="col-product-details" >

                                <div id="previewModalTitle" class="product-title heading-l modalTitle">Title</div>

                                <div class="product-subtitle heading-xs modalSubTitle">Sub Title</div>

                                <div class="price-container">

                                    <div class="product-price">

                                        <span class="from LT-17"></span>

                                        <span class="amount">Price</span>

                                        <span class="from ja-price LT-17"></span>

                                    </div>

                                </div>

                                <div class="show-for-medium-up">

                                    <div class="overflow-scroll">

                                        <p class="product-details"></p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="preview-footer">

                        <div class="mybtn btn-black product-add button add-btn LT-14" onclick="addToCart(event,true)">

                            Add To Itinerary

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;
}

function setUpCartModal() {
	return `

         <div class="cart-modal-parent" style="display:none">

                <div class="cart-modal-overlay" onclick="closeCartModal()"></div>

                <div class="cart-modal-container">

                    <div class="cart-modal-box">

                        <div style="width: 100%;height: 40px; overflow: hidden">

                            <div class="btn-close-cart-modal" onclick="closeCartModal()">

                            </div>

                        </div>

                        <div class="cart-modal-body">

                            <div class="shopping-cart">

                                <div class="cart-top">

                                    <div class="text-left itinerary-title">Itinerary</div>

                                </div>

                                <div class="cart-results">

                                    <ul class="item-list"></ul>

                                </div>

                            </div>

                        </div>

                        <div class="cart-modal-footer">

                            <button class="button continue-btn LT-12">

                                Check Availability

                            </button>

                        </div>

                    </div>

                </div>

          </div>

     `;
}

function setUpItineraryBasket() {}

function setUpItineraryBasketForMobile() {}

function Providers() {
	let _providers = [];

	let _services = [];

	let _servicePageNumber = [];

	const _distributor = "visit_hachinohe_web";

	const _getMore = function () {
		this.searchProviders();
	};

	const _preview = function (service) {
		// servicePreview().service = service;

		// console.log(servicePreview().service);

		this.servicePreview.setService(service);

		this.servicePreview.open();
	};

	const _getServices = function (providerId) {
		this.searchServices(providerId);
	};

	const _searchProviders = function () {
		const request = {
			Shortname: _distributor,

			Campaign: {
				AdCampaignCode: "",

				DealCampaignCode: "",
			},

			Filter: {
				Type: "Provider",

				MustBeInAdCampaign: true,

				MustBeInDealCampaign: false,
			},

			Output: {
				CommonContent: {
					All: true,
				},
			},

			Paging: {
				pageNumber: this.providerPageNumber,

				PageSize: 6,
			},
		};

		const me = this;

		me.isLoadingProvider = true;

		V3.WebServices.EntityService.Search(
			function (data) {
				me.providerPageCount = data.Paging.NumberOfPages;

				data.Entities.forEach(function (item) {
					me.services[item.Id] = [];

					_servicePageNumber[item.Id] = 0;

					me.isLoadingService[item.Id] = false;

					me.serviceClicked[item.Id] = false;

					me.providers.push(item);
				});

				me.providerPageNumber++;

				me.isLoadingProvider = false;
			},
			function (response) {
				//fail

				console.log("fail", response);
			},

			request
		);
	};

	const _searchServices = function (providerId) {
		_servicePageNumber[providerId]++;

		const request = {
			Shortname: _distributor,

			Campaign: {
				AdCampaignCode: "",

				DealCampaignCode: "",
			},

			Filter: {
				Type: "Provider",

				MustBeInAdCampaign: true,

				MustBeInDealCampaign: false,

				Ids: [providerId],
			},

			Output: {
				CommonContent: {
					Name: true,
				},

				Children: {
					Output: {
						CommonContent: {
							All: true,
						},

						Availability: {
							StartDate: new V3Date(),

							NumberOfDays: 42,

							FlagCampaigns: true,

							MergeMethod: 2,

							LowestRateOnly: true,
						},
					},
				},
			},

			Paging: {
				pageNumber: _servicePageNumber[providerId],

				PageSize: 6,
			},
		};

		const me = this;

		me.isLoadingService[providerId] = true;

		V3.WebServices.EntityService.Search(
			function (data) {
				data.Entities[0].Children.forEach(function (item) {
					me.services[providerId].push(item);
				});

				me.isLoadingService[providerId] = false;

				me.serviceClicked[providerId] = true;
			},
			function (response) {
				//fail

				console.log("fail loading services", response);
			},

			request
		);
	};

	const _init = function () {
		console.log("init");

		this.searchProviders();
	};

	return {
		providers: _providers,

		services: _services,

		getMore: _getMore,

		init: _init,

		searchProviders: _searchProviders,

		searchServices: _searchServices,

		getServices: _getServices,

		isLoadingProvider: true,

		isLoadingService: [],

		providerPageCount: 0,

		providerPageNumber: 1,

		serviceClicked: [],

		preview: _preview,

		servicePreview: servicePreview(),
	};
}

function servicePreview() {
	let _show = false;

	function _open() {
		setTimeout(function () {
			loadSlick();

			$(".preview-parent").show();
		}, 30);
	}

	function _close() {
		$(".preview-parent").hide();

		unloadSlick();
	}

	function _setService(service) {
		this.service.Name = service.Name;

		this.service.Images = _setImages(service.Images);

		this.service.LongDescription = service.LongDescription;

		this.service.Address = service.PhysicalAddress
			? (service.PhysicalAddress.Line1 || "") +
			  (service.PhysicalAddress.City || "")
			: "";

		this.service.Price = service.Availability
			? service.Availability.Calendar.LowestRate
			: "";
	}

	function _setImages(images) {
		let _images = "";

		images.forEach(function (item) {
			_images += `<div class='slick-bg-image fouc-stopper'>

                            <img src="${item.Url}" alt="" data-lazy="${item.Url}">                            

                        </div>`;
		});

		return _images;
	}

	return {
		service: { Images: [] },

		show: _show,

		open: _open,

		close: _close,

		setService: _setService,
	};
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

	console.log("slick");

	$(".product-images-slick").not(".slick-initialized").slick(options);

	$(".product-images-slick").not(".slick-initialized").slick("slickNext");
}

function unloadSlick() {
	var slickContainer = $(".product-images-slick");

	slickContainer.slick("unslick");
}
