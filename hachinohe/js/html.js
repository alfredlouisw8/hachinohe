const ACCOMMODATION = "0";

const ACTIVITIES = "1";

const RESTAURANT = "2";

const PRODUCE = "3";

function setUpItineraryPage() {
	const productType = $("#productType")
		? $("#productType").val().toString()
		: "";

	const heading = setUpHeading(productType);

	const searchSection = setUpSearch(productType);

	const resultSection = setUpResultSection(productType);

	const previewSection = setUpPreviewParent(productType);

	const cartModal = setUpCartModal(productType);

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

	$(".itinerary-page-content").html(itinerary);
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

			instructionsClass = "";

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

            <h4><span class="${subTitleClass}">Find accommodation in the Hachinohe and surrounding area</span></h4>

            <h5 style="margin-bottom: 15px"><span class="${instructionsClass}"></span></h5>

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
			searchSection = ""; //searchProduce();

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



<!--            <div class="search-wrapper select-search icon-before type-category">-->

<!--                <select id="category" name="searchCategory" class="selectBox medium-3 column" aria-labelledby="searchPriceLabel">-->

<!--                    <option value="" class="LT-105">category</option>                    -->

<!--                </select>-->

<!--            </div>-->

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

                <select id="productTypeOption" name="productTypeOption" class="selectBox medium-3 column" aria-labelledby="searchDestinationLabel">

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

function setUpResultSection(productType) {
	const tabClass = productType == "3" ? "LT-96" : "LT-77";

	const basketClass = productType == "3" ? "LT-101" : "LT-116";

	const redirectToCabsClass = productType == "3" ? "LT-12" : "LT-12";

	return `

 <div class="product-holder module clearfix">

            <div class="cart-btn-mobile-wrapper" onclick="showCartModal()">

                <div style="overflow: hidden;width: 100%;height: auto">

                    <div class="cart-btn-mobile">

                        <div class="text-left itinerary-title ${redirectToCabsClass}">行程</div>

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

                            <div class="text-left itinerary-title"><span class="${basketClass}">Itinerary</span></div>

                        </div>

                        <div class="book-btn-wrapper text-center show-for-medium-up">

                            <button class="button continue-btn btn-black">

                                <span class="${redirectToCabsClass}">Check Availability</span>

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

function setUpPreviewParent(productType) {
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

function setUpCartModal(productType) {
	const redirectToCabsClass = productType === PRODUCE ? "LT-119" : "LT-12";

	const basketClass = productType === PRODUCE ? "LT-101" : "LT-116";

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

                                    <div class="text-left itinerary-title ${basketClass}">Itinerary</div>

                                </div>

                                <div class="cart-results">

                                    <ul class="item-list"></ul>

                                </div>

                            </div>

                        </div>

                        <div class="cart-modal-footer">

                            <button class="button continue-btn ${redirectToCabsClass}">

                                Check Availability

                            </button>

                        </div>

                    </div>

                </div>

          </div>

     `;
}
