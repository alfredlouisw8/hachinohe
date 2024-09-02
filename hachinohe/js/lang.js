document.addEventListener("DOMContentLoaded", function (event) {
	setActivitiesAsDefault(); //temporary

	setUpHeaderFooter();

	translatePage();
});

function setActivitiesAsDefault() {
	return;

	let exl_grp = getParameterByName("exl_grp");

	exl_grp = exl_grp ? exl_grp.toLowerCase() : "";

	//sanitize url from all exl_grp

	const url = document.location.href;

	let sanitizedUrl = url.replace(/&?exl_grp=\w{3,4}&?/gi, "");

	if (
		document.location.pathname.toLowerCase() === "/v4/pages/search.aspx" &&
		exl_grp === "acc" &&
		!isLandingPage()
	) {
		document.location = sanitizedUrl + "&exl_grp=act";
	}
}

function setProvidedBy() {
	console.log("clicked");

	const provider = $(".entity-info.type-business > .name").html();

	$(".entity-info.type-business > .name").html("Provide By " + provider);
}

function translatePage() {
	console.log("translate");

	//Set selected language based on url

	selectLanguage();

	//attach event to language dropdown

	$(".language-select").on("change", changeLanguage);

	const data = getLanguageData();

	let el = null;

	data.forEach(function (item, index) {
		el = document.getElementsByClassName("LT-" + index);

		if (el) {
			for (var i = 0; i < el.length; i++) {
				if (el[i].classList.contains("LT-ph")) {
					el[i].placeholder = item;
				} else if (el[i].classList.contains("LT-APPEND")) {
					el[i].innerHTML = el[i].innerHTML.replace(item, "");

					el[i].innerHTML = el[i].innerHTML + " " + item;
				} else {
					el[i].innerHTML = item;
				}
			}
		}
	});
}

function setUpHeaderFooter() {
	const newHeader = get_header();

	$(".header-hidden").remove();

	const newFooter = get_footer();

	$(".footer-hidden").remove();

	$(".header").html(newHeader);

	$(".footer").html(newFooter);

	var popup = {
		status: false,

		action: function () {
			if (this.status == false) {
				$("#popup-menu").addClass("is-active");

				$("#header").addClass("is-popup");

				$("#site-logo").attr(
					"src",
					$("#site-logo").attr("src").replace("logo.", "logo-white.")
				);

				this.status = true;
			} else {
				$("#popup-menu").removeClass("is-active");

				$("#header").removeClass("is-popup");

				$("#site-logo").attr(
					"src",
					$("#site-logo").attr("src").replace("logo-white.", "logo.")
				);

				this.status = false;
			}
		},
	};

	$("#btn-gnav").on("click", function () {
		popup.action();
	});

	$("#btn-menu-close").on("click", function () {
		popup.action();
	});

	$(".btn-sp-menu").on("click", function () {
		popup.action();
	});
}

function selectLanguage() {
	const lang = getLanguage();

	const langOptions = [
		{ id: "ja-JP", label: "Japanese" },

		{ id: "en-US", label: "English" },

		{ id: "fr-FR", label: "French" },

		{ id: "zh-CN", label: "Chinese" },
	];

	$(".language-select").html("");

	let selectedLang = "";

	langOptions.forEach(function (item, index) {
		selectedLang = item.id == lang ? "selected" : "";

		$(".language-select").append(
			`<option value="${item.id}" ${selectedLang}>${item.label}</option>`
		);
	});

	document.documentElement.lang = lang.split("-")[0];
}

function getLanguage(initLang = null) {
	//language from input element default-lang in itinerary page / landing page

	const defaultLang = document.getElementById("default-lang");

	//language from 'lang' attribute in html

	const documentLang = document.documentElement.lang;

	//language from query parameter in the url

	const parameterLang = getParameterByName("lang");

	let lang = initLang ? initLang : "en-US";

	lang = documentLang ? documentLang : lang;

	lang = defaultLang ? defaultLang.value : lang;

	lang = parameterLang ? parameterLang : lang;

	return lang;
}

function getLanguageData(code = null) {
	if (code) return this[getLanguage().substring(0, 2) + "_lang"]()[code];

	return this[getLanguage().substring(0, 2) + "_lang"]();
}

function TryGetCampaignCode() {
	try {
		var match = /[&?]exl_acp=(.*?)&/gi.exec(window.location.href);

		if (match && match.length == 2 && match[1].length > 1) {
			return decodeURIComponent(match[1]);
		}
	} catch (err) {}

	return null;
}

function getParameterByName(name, url = "") {
	if (!url) url = window.location.href;

	name = name.replace(/[\[\]]/g, "\\$&");

	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");

	const results = regex.exec(url);

	if (!results) return null;

	if (!results[2]) return "";

	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function changeLanguage() {
	const url = window.location.href;

	const selectedLang =
		(url.includes("?") ? "&" : "?") + "lang=" + $(this).val();

	//sanitize url from all lang params

	let sanitizedUrl = url.replace(/&?lang=\w{0,7}-?\w{0,7}&?/gi, "");

	window.location.href = `${sanitizedUrl}${selectedLang}`;
}

function getSiteLanguage() {
	return getLanguage().substring(0, 2) === "ja"
		? "https://visithachinohe.com"
		: "https://visithachinohe.com/en";
}

function isLandingPage() {
	return document.location.host === "visithachinohe.com";
}

function getTopRightMenu() {
	const languageOptions = isLandingPage()
		? `<li>                

                                <select class="language-select">

                                    <option value="jp">Japanese</option>

                                    <option value="en">English</option>

                                    <option value="fr">French</option>

                                    <option value="cz">Chinese Traditional</option>

                                </select>                

                               </li>`
		: "";

	const _links =
		getLanguage().substring(0, 2).toLowerCase() == "ja"
			? `<ul class="list-separatebar with-last-bar">

                        <li>宿泊予約 <a href="https://kw.travel.rakuten.co.jp/keyword/Search.do?charset=utf-8&amp;f_max=30&amp;lid=topC_search_keyword&amp;f_query=%E5%85%AB%E6%88%B8%E5%B8%82" target="_blank">楽天</a> <a href="https://www.jalan.net/uw/uwp2011/uww2011init.do?keyword=%94%AA%8C%CB%8Es&amp;distCd=06&amp;rootCd=7701&amp;screenId=FWPCTOP&amp;image1.x=24&amp;image1.y=25" target="_blank">じゃらん</a></li>

                        <li><a href="https://visithachinohe.com/area">はちのへ圏域を知る</a></li>

                        <li><a href="https://visithachinohe.or.jp/" target="_blank">事業者の皆様へ</a></li>

                        ${languageOptions}

                    </ul>`
			: `<ul class="list-separatebar with-last-bar">

                        <li><span class="LT-8">宿泊予約 楽天</span> <a href="https://www.booking.com/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaHWIAQGYARW4ARfIAQzYAQPoAQGIAgGoAgO4AuSE6eoFwAIB&amp;sid=b18506572206cbc087b05d88eeb392f1&amp;lang=en-us&amp;sb_price_type=total&amp;soz=1&amp;lang_click=top;cdl=ja;lang_changed=1

                        " target="_blank">Booking.com</a> <a href="https://www.expedia.co.jp/Hotel-Search?adults=2&amp;currency=JPY&amp;destination=Hachinohe%20City&amp;endDate=2019-09-06&amp;langid=1033&amp;localDateFormat=yyyy%2FM%2Fd&amp;regionId=180619&amp;siteid=28&amp;sort=recommended&amp;startDate=2019-09-05&amp;useRewards=true" target="_blank">Expedia</a></li>

                        <li><a href="/en/access"><span class="LT-9">はちのへ圏域を知る</span></a></li>

                        <li><a href="https://visithachinohe.or.jp/" target="_blank"><span class="LT-10">事業者の皆様へ</span></a></li>

                        ${languageOptions}

                    </ul>`;

	return `     ${_links}               

                <ul class="menu-sns">

                    <li><a href="http://nav.cx/co6BbZW" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-line.svg"></a></li>

                    <li><a href="https://www.facebook.com/VisitHachinohe/" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-facebook.svg" alt="Facebook"></a></li>

                    <li><a href="https://twitter.com/hachinohe_kanko" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-twitter.svg" alt="Twitter"></a></li>

                    <li><a href="https://www.instagram.com/visit_hachinohe/" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-instagram.svg" alt="Instagram"></a></li>

                </ul>`;
}

function get_header() {
	const siteLanguage = getSiteLanguage();

	const bookingInfo = getTopRightMenu();

	const logoImage =
		getLanguage().substring(0, 2).toLowerCase() == "en"
			? "https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/logo.svg"
			: "https://visithachinohe.com/wp-content/themes/visithachinohe/assets/img/common/logo.svg";

	return `<div class="l-header-inner">

        <h1 class="header-logo"><a href="${siteLanguage}"><img id="site-logo" src="${logoImage}" alt="Visit Hachinohe ｜The Offical Guide to Hachinohe, Japan"></a></h1>

        <div class="header-nav">

            <div class="header-nav--sub popup-hidden">

               ${bookingInfo}

            </div>

            <nav class="header-nav--main" role="navigation" aria-label="メインメニュー">

                <ul>

                    <li class="header-nav-item">

                        <button class="btn-gnav LT-4" id="btn-gnav" type="button">Search</button>

                    </li>                 

                    <li class="header-nav-item popup-hidden"><a href="${siteLanguage}/topics" class="LT-24">Upcoming Events &amp; News</a></li>

                                        <li class="header-nav-item popup-hidden"><a href="${siteLanguage}/course"><span  class="LT-6">Plan Your Trip</span></a></li>

                    <li class="header-nav-item popup-hidden"><a href="${siteLanguage}/shopping" class="LT-42">Bring Hachinohe Home</a></li>

                       <li class="header-nav-item popup-hidden"><a href="${siteLanguage}/stories/platform"><span  class="LT-91">Book / Purchase</a></li>

                </ul>

            </nav>

        </div>

        <div class="btn-menu-close">

            <button id="btn-menu-close" type="button">

                <img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/btn-menu-close.svg" alt="メニューを閉じる">

            </button>

        </div>

        <div class="btn-sp-menu">

            <button type="button">

                <img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/btn-sp-menu.svg" alt="メニューを開く">

            </button>

        </div>

    </div>

    <div class="popup-menu" id="popup-menu">

        <div class="popup-menu-inner">

            <div class="search-menu flex column--3 no-drop">

                <a class="column" href="${siteLanguage}/stories" style="background-image: url(https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/img-search-menu01.jpg);"><span class="LT-21">Stories</span></a>

                <a class="column" href="${siteLanguage}/experiences" style="background-image: url(https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/img-search-menu02.jpg);"><span class="LT-22">Experiences</span></a>

                <a class="column" href="${siteLanguage}/places" style="background-image: url(https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/img-search-menu03.jpg);"><span class="LT-23">Places</span></a>

            </div>

            <div class="popup-menu--sp">

                <ul class="menu-text">

                    <li>

                        <select class="language-select">

                            <option value="jp">Japanese</option>

                            <option value="en">English</option>

                            <option value="fr">French</option>

                            <option value="cz">Chinese Traditional</option>

                        </select>

                    </li>

                    <li><a class="link-item type-news LT-24" href="${siteLanguage}/topics">Upcoming Events & News</a></li>

                    <li><a class="link-item type-modelcourse LT-27" href="${siteLanguage}/course">Trip Ideas & Itineraries</a></li>

                    <li><a class="link-item type-shopping LT-42" href="${siteLanguage}/shopping">Bring Hachinohe Home</a></li>                    

                    <li><a class="link-item LT-43" href="${siteLanguage}/access">Access</a></li>

                    <li><a class="link-item LT-44" href="https://visithachinohe.or.jp/" target="_blank">Contact us</a></li>

                    <li class="multiple"><span class="LT-8">Find a Hotel</span> <a href="https://www.booking.com/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaHWIAQGYARW4ARfIAQzYAQPoAQGIAgGoAgO4AuSE6eoFwAIB&sid=b18506572206cbc087b05d88eeb392f1&lang=en-us&sb_price_type=total&soz=1&lang_click=top;cdl=ja;lang_changed=1

" target="_blank">Booking.com</a> <a href="https://www.expedia.co.jp/Hotel-Search?adults=2&currency=JPY&destination=Hachinohe%20City&endDate=2019-09-06&langid=1033&localDateFormat=yyyy%2FM%2Fd&regionId=180619&siteid=28&sort=recommended&startDate=2019-09-05&useRewards=true" target="_blank">Expedia</a></li>

                </ul>

                <ul class="menu-sns">

                    <li><a href="http://nav.cx/co6BbZW"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-line-white.svg"></a></li>

                    <li><a href="https://www.facebook.com/tanesashiblog" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-facebook-white.svg" alt="Facebook"></a></li>

                    <li><a href="https://twitter.com/hachinohe_kanko" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-twitter-white.svg" alt="Twitter"></a></li>

                    <li><a href="https://www.instagram.com/visit_hachinohe/" target="_blank"><img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-instagram-white.svg" alt="Instagram"></a></li>

                </ul>

            </div>

            <div class="flex column--2 popup-menu--search">

                <div class="box--search-form">

                    <form role="search" method="get" id="searchform" action="/en">

                        <input type="text" value="" name="s" class="s LT-53 LT-ph" placeholder="Search keyword">

                        <button class="btn-search" type="submit">

                            <img src="https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/icon-search-button.svg" alt="Search for">

                        </button>

                    </form>          </div>

                <div class="popup-menu--sp">

                    <div class="menu-keyword">

                        <h3 class="title size-s LT-54">Popular</h3>

                        <ul class="panel exists-space column--2-fix list-search-keyword">

                            <li><a href="${siteLanguage}/?s=Tanesashi" class="LT-56">Tanesashi</a></li>

                            <li><a href="${siteLanguage}/?s=Morning" class="LT-57">Morning</a></li>

                            <li><a href="${siteLanguage}/?s=marient" class="LT-58">marient</a></li>

                            <li><a href="${siteLanguage}/?s=sansha" class="LT-59">sansha</a></li>

                            <li><a href="${siteLanguage}/?s=enburi" class="LT-60">enburi</a></li>

                            <li><a href="${siteLanguage}/?s=horse" class="LT-61">horse</a></li>

                            <li><a href="${siteLanguage}/?s=hacchi" class="LT-62">hacchi</a></li>

                            <li><a href="${siteLanguage}/?s=mutsu" class="LT-63">mutsu</a></li>

                            <li><a href="${siteLanguage}/?s=yokocho" class="LT-64">yokocho</a></li>

                            <li><a href="${siteLanguage}/?s=tatehana" class="LT-65">tatehana</a></li>

                        </ul>

                    </div>

                    <div class="menu-keyword">

                        <h3 class="title size-s LT-55">Recommended</h3>

                        <div class="textwidget custom-html-widget">

                            <ul class="panel exists-space column--2-fix list-search-keyword">

                                <li class="column"><a href="${siteLanguage}/?s=sansha" class="LT-66">Hachinohe Sansha Taisai</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=enburi" class="LT-67">Enburi</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=morning" class="LT-68">Morning Market</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=mutsu" class="LT-69">Morning Market in front of Mutsu-Minato Station</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=korekawa" class="LT-70">Korekawa Jomon Museum</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=tanesashi" class="LT-71">Tanesashi Coast</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=tatehana" class="LT-72">Tatehana Wharf Morning Market</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=kabushima" class="LT-73">Kabushima</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=marient" class="LT-74">Marient</a></li>

                                <li class="column"><a href="${siteLanguage}/?s=yokocho" class="LT-75">Yokocho</a></li>

                            </ul>

                         </div>            

                    </div>

                </div>

            </div>

        </div>

    </div>`;
}

function get_footer() {
	const siteLanguage = getSiteLanguage();

	const logoImage =
		getLanguage().substring(0, 2).toLowerCase() == "en"
			? "https://visithachinohe.com/en/wp-content/themes/visithachinohe/assets/img/common/logo-footer.svg"
			: "https://visithachinohe.com/wp-content/themes/visithachinohe/assets/img/common/logo-footer.svg";

	return `<div class="l-footer-inner">

        <div class="footer-logo">

            <img src="${logoImage}" alt="Visit Hachinohe ｜The Offical Guide to Hachinohe, Japan">

        </div>

        <div class="footer-mainnav">

            <div class="textwidget custom-html-widget"><div class="footer-nav">

                    <div class="footer-nav--title LT-5">The Visit Hachinohe Area</div>

                    <ul>

                        <li><a href="${siteLanguage}/area/hachinohe" class="LT-45">Hachinohe</a></li>

                        <li><a href="${siteLanguage}/area/sannohe" class="LT-46">Sannohe </a></li>

                        <li><a href="${siteLanguage}/area/gonohe" class="LT-47">Gonohe</a></li>

                        <li><a href="${siteLanguage}/area/takko" class="LT-48">Takko</a></li>

                        <li><a href="${siteLanguage}/area/nanbu" class="LT-49">Nanbu</a></li>

                        <li><a href="${siteLanguage}/area/hashikami" class="LT-50">Hashikami </a></li>

                        <li><a href="${siteLanguage}/area/shingo" class="LT-51">Shingo</a></li>

                        <li><a href="${siteLanguage}/area/oirase" class="LT-52">Oirase</a></li>

                    </ul>

                </div>

                <div class="footer-nav">

                    <div class="footer-nav--title LT-4">Search </div>

                    <ul>

                        <li><a href="${siteLanguage}/stories"><span class="LT-21">Stories</span></a></li>

                        <li><a href="${siteLanguage}/experiences"><span class="LT-22">Experiences</span></a></li>

                        <li><a href="${siteLanguage}/spots"><span class="LT-23">Places</span></a></li>

                    </ul>

                </div>

                <div class="footer-nav">

                    <div class="footer-nav--title LT-24">Upcoming Events & News</div>

                    <ul>

                        <li><a href="${siteLanguage}/tag/news" class="LT-25">News</a></li>

                        <li><a href="${siteLanguage}/tag/event" class="LT-26">Upcoming Events</a></li>

                    </ul>

                </div>

                <div class="footer-nav">

                    <div class="footer-nav--title LT-27">Trip Ideas & Itineraries</div>

                    <ul>

                        <li><a href="${siteLanguage}/course/sanriku" class="LT-28">The Sanriku Fukko National Park</a></li>

                        <li><a href="${siteLanguage}/course/zizakemankitsu" class="LT-29">Hachinohe After Dark: Bar Hopping</a></li>

                        <li><a href="${siteLanguage}/course/gokan" class="LT-30">Hachinohe Area through the Five Senses</a></li>

                        <li><a href="${siteLanguage}/course/inakagurashi" class="LT-31">From the Mountains to the Sea</a></li>

                        <li><a href="${siteLanguage}/course/umatokonamon" class="LT-32">Travel through Hachinohe’s Culinary History</a></li>

                        <li><a href="${siteLanguage}/course/beginnners" class="LT-33">The Hachinohe Area for Beginners

                            </a></li>

                    </ul>

                </div>

                <div class="footer-nav">

                    <div class="footer-nav--title LT-34">Travel Information</div>

                    <ul>

                        <li><a href="${siteLanguage}/area" class="LT-35">What’s the Hachinohe Area / Downloadable Pictures</a></li>

                        <li><a href="${siteLanguage}/brochure" class="LT-36">Downloadable Sightseeing Brochures</a></li>

                        <li><a href="${siteLanguage}/info" class="LT-37">Visitor Information Centers & Resources</a></li>

                        <li><a href="${siteLanguage}/guide" class="LT-38">Local Guides</a></li>

                        <li><a href="${siteLanguage}/access" class="LT-39">Access and Transportation Information</a></li>

                    </ul>

                </div></div>      </div>

        <div class="footer-subnav">

            <ul class="list-separatebar color-white">

                <li><a href="${siteLanguage}/area" class="LT-40">What is the Hachinohe Area</a></li>

                <li><a href="https://visithachinohe.or.jp/" target="_blank" class="LT-41">Corporate Site</a></li>

            </ul>

            <p class="footer-copyright"><small>&copy; 2019 VISIT HACHINOHE</small></p>

        </div>

    </div>`;
}

//english

function en_lang() {
	return [
		"Where To Stay", //0

		"Destination", //1

		"Any Price", //2

		"Type Name", //3

		"Search", //4

		"The Hachinohe Area", //5

		"Plan Your Trip", //6

		"What to Do", //7

		"Find a Hotel", //8

		"Access", //9

		"Contact us", //10

		"Itinerary", //11

		"Check Availability", //12

		"Japanese", //13

		"Add To Itinerary", //14

		"Preview", //15

		"Load More", //16

		"From", //17

		"Remove", //18

		"Remove From Itinerary", //19

		"Location", //20

		"Stories", //21

		"Experiences", //22

		"Places", //23

		"Upcoming Events & News", //24

		"News", //25

		"Upcoming Events", //26

		"Trip Ideas & Itineraries", //27

		"The Sanriku Fukko National Park", //28

		"Hachinohe After Dark: Bar Hopping", //29

		"Hachinohe Area through the Five Senses", //30

		"From the Mountains to the Sea", //31

		"Travel through Hachinohe’s Culinary History", //32

		"The Hachinohe Area for Beginners", //33

		"Travel Information", //34

		"What’s the Hachinohe Area / Downloadable Pictures", //35

		"Downloadable Sightseeing Brochures", //36

		"Visitor Information Centers & Resources", //37

		"Local Guides", //38

		"Access and Transportation Information", //39

		"What is the Hachinohe Area", //40

		"Corporate Site", //41

		"Bring Hachinohe Home", //42

		"Access", //43

		"Contact Us", //44

		"Hachinohe", //45

		"Sannohe", //46

		"Gonohe", //47

		"Takko", //48

		"Nanbu", //49

		"Hashikami", //50

		"Shingo", //51

		"Oirase", //52

		"Search Keyword", //53

		"Popular", //54

		"Recomended", //55

		"Tanesashi", //56

		"Morning", //57

		"Marient", //58

		"Sansha", //59

		"Enburi", //60

		"horse", //61

		"hacchi", //62

		"mutsu", //63

		"yokocho", //64

		"tatehana", //65

		"Hachinohe Sansha Taisai", //66

		"Enburi", //67

		"Morning Market", //68

		"Morning Market in front of Mutsu-Minato Station", //69

		"Korekawa Jomon Museum", //70

		"Tanesashi Coast", //71

		"Tatehana Wharf Morning Market", //72

		"Kabushima", //73

		"Marient", //74

		"Yokocho", //75

		"View By :", //76

		"Rates", //77

		"Map", //78

		"Find accommodation in the Hachinohe and surrounding area", //79

		"Find activities in the Hachinohe and surrounding area", //80

		"Hachinohe City", //81

		"Sannohe Town", //82

		"Gonohe Town", //83

		"Takko Town", //84

		"Nanbu Town", //85

		"Hashikami Town", //86

		"Shingo Village", //87

		"Aomori City", //88

		"Oirase Town", //89

		"Anywhere", //90

		"Book / Purchase", //91

		"Please add a product to the Itinerary to proceed", //92

		"Close", //93

		"Restaurants", //94

		"Where to Eat", //95

		"Produce", //96

		"Local Produce", //97

		"All", //98

		"Find restaurant in the Hachinohe and surrounding area", //99

		"Find local produce in the Hachinohe and surrounding area", //100

		"Shopping list", //101

		"Add to shopping list", //102

		"Remove from shopping list", //103

		"View Produce", //104

		"Category", //105

		"The Complete Hachinohe Experience", //106

		"Find accommodations, activities, restaurants, and local produces in the Hachinohe and surrounding area", //107

		"All", //108

		"Accommodations", //109

		"Activities", //110

		"Restaurants", //111

		"Local Produces", //112

		"Add all the experience menus you care about to the process, " +
			"and check the availability on the next page at once. ", //113

		"Person", //114

		"Persons", //115

		"Wishlist", //116

		"Add to wishlist", //117

		"Remove from wishlist", //118

		"Check Availability", //119
	];
}

//japanese

function ja_lang() {
	return [
		"八戸エリアの宿", // 0.Where To Stay

		"ロケーション", // 1. Destination

		"価格帯", // 2. Any Price

		"キーワード", // 3. Type Name

		"検索", // 4. Search

		"はちのへの地域", //5. The Hachinohe Area

		"モデルコース", //6. Plan Your Trip

		"体験・アクティビティ", //7. What to do

		"宿泊予約 楽天", //8. Find a Hotel

		"はちのへ圏域を知る", //9. access

		"事業者の皆様へ", //10. contact us

		"お気に入りリスト", //11. Itinerary

		"在庫状況を見る", //12. Check Availability

		"English", //13. English

		"お気に入りに追加", // 14

		"プレビュー", // 15

		"さらに読み込む", // 16

		"から", // 17

		"削除", // 18

		"お気に入りから削除", // 19

		"場所", // 20

		"ストーリー", // 21

		"経験", // 22

		"場所", // 23

		"ニュース/イベント", // 24

		"ニュース", // 25

		"今後のイベント", // 26

		"旅行のアイデアと旅程", // 27

		"三陸復興国立公園", // 28

		"八戸アフターダーク：バーホッピング", // 29

		"五感の八戸エリア", // 30

		"山から海へ.", // 31

		"八戸の料理の歴史を旅する", // 32

		"初心者のための八戸エリア", // 33

		"旅行情報", // 34

		"八戸エリアとは/ダウンロード可能な写真", // 35

		"ダウンロード可能な観光パンフレット", // 36

		"ビジターインフォメーションセンター＆リソース", // 37

		"ローカルガイド", // 38

		"アクセスと交通情報", // 39

		"八戸エリアとは", // 40

		"企業サイト", // 41

		"地場産品", // 42

		"アクセス", // 43

		"お問い合わせ", // 44

		"八戸市", //45

		"三戸町", //46

		"五戸町", //47

		"田子町", //48

		"南部町", //49

		"階上町", //50

		"新郷村", //51

		"おいらせ町", //52

		"検索キーワード", //53

		"頻出", // 54

		"おすすめ", // 55

		"種差海岸", // 56

		"Pagi", // 57

		"マリエント", // 58

		"八戸三社大祭", // 59

		"えんぶり", // 60

		"馬", // 61

		"ハッチ", // 62

		"むつ", // 63

		"横丁", // 64

		"たてはな", // 65

		"八戸三社大祭", // // 66

		"えんぶり", // 67

		"朝市", // 68

		"むつみなと駅前の朝市", // 69

		"縄文是川美術館", // 70

		"種差海岸", // 71

		"館花桟橋朝市", // 72

		"かぶしま", // 73

		"マリエント", // 74

		"横丁", // 75

		"表示方法 :", //76

		"料金", //77

		"地図", //78

		"八戸周辺の宿泊施設を探す", //79

		"八戸周辺のアクティビティを探す", //80

		"八戸市", // 81

		"三戸町", // 82

		"五戸町", // 83

		"田子町", // 84

		"南部町", // 85

		"階上町", // 86

		"新郷村", // 87

		"おいらせ町", // 88

		"おいらせ町", //89

		"どこでも", //90

		"予約/購入", //91

		"続行するには、旅程に商品を追加してください", //92

		"閉じる", //93

		"レストラン", // 94

		"どこで食べるか", // 95

		"地域産品", // 96

		"地域産品", // 97

		"すべて", // 98

		"八戸とその周辺でレストランを探す", // 99

		"八戸圏域、フルーツ、地酒に伝統工芸品など。様々な地域産品を八戸からお届けします！", // 100

		"候補リスト", // 101

		"候補リストに追加", // 102

		"候補リストから削除", // 103

		"プロデュースを見る", //104

		"カテゴリー", //105

		"完全な八戸体験", //106

		"八戸とその周辺の宿泊施設、アクティビティ、レストラン、地元の食材を探す", //107

		"カテゴリー", // 108

		"宿泊施設", // 109

		"アクティビティ", // 110

		"レストラン", // 111

		"地元の農産物", // 112

		"気になる体験メニュー全てを「行程に追加」し、空き状況を次のページで一気に確認できます。", //113

		"人", //114

		"人", //115

		"お気に入りリスト", //116

		"お気に入りに追加", //117

		"お気に入りから削除", //118

		"在庫状況を見る", //119
	];
}

//chinese

function zh_lang() {
	return [
		"呆在哪里", // 0

		"目的地,", // 1

		"任何价格", // 2

		"类型名,称", // 3

		"搜索", // 4

		"八,户地,区", // 5

		"计划行程", // 6

		",做,什么", //, 7

		"寻找酒店", // ,,8

		"访问", // 9

		"与我们联系", // 10

		"行程", // 11

		"检查可用性", // 12

		"日语", // 13

		"添加到行程", // 14

		"预览", // 15

		"加载更多", // 16

		"从", // 17

		"删除", // 18

		"已添加", // 19

		"位置", // 20

		"故事", // 21

		"经验", // 22

		"地方", // 23

		"即将发生的事件和新闻", // 24

		"新闻", // 25

		"即将发生的事件", // 26

		"旅行的想法和行程", // 27

		"三陆福甲国家公园", // 28

		"天黑后八户：跳栏", // 29

		"八感八户地区", // 30

		"从山上到大海", // 31

		"穿越八户的烹饪史", // 32

		"八户初学者专区", // 33

		"旅行信息", // 34

		"八户地区/可下载的图片是什么", // 35

		" /可下载的观光手册", // 36

		"游客信息中心和资源", // 37

		" /本地向导", // 38

		"访问和运输信息", // 39

		"八户地区是什么", // 40

		"公司站点", // 41

		"把八户带回家", // 42

		"访问", // 43

		"联系我们", // 44

		"八户", // 45

		"三诺河", // 46

		"五河", // 47

		"卓子", // 48

		"南布", // 49

		"桥上", // 50

		"慎吾", // 51

		"奥入濑", // 52

		"搜索关键字", // 53

		"受欢迎", // 54

		"推荐", // 55

		"种桥", // 56

		"早晨", // 57

		"玛丽恩", // 58

		"三沙", // 59

		"恩布里", // 60

		"马", // 61

		"哈奇", // 62

		"武津", // 63

		"横町", // 64

		"塔特哈纳", // 65

		"八户三沙泰赛", // 66

		"第一回合", // 67

		"早晨市场", // 68

		"陆续港区站前的早晨市场", // 69

		"Korekawa绳文博物馆", // 70

		"淡江海岸", // 71

		"第一回合码头早市", // 72

		"鹿岛", // 73

		"玛丽恩", // 74

		"横手", // 75

		"見る者 :", //76

		"料金", //77

		"地図", //78

		"在八户及周边地区寻找住宿", //79

		"查找八户及周边地区的活动", //80

		"八戸市", // 81

		"三戸町", // 82

		"五戸町", // 83

		"田子町", // 84

		"南部町", // 85

		"階上町", // 86

		"新郷村", // 87

		"おいらせ町", // 88

		"おいらせ町", //89

		"どこでも", //90

		"預訂/購買", // 91

		"請在行程中添加產品以繼續", //92

		"關", //93

		"餐館", // 94

		"在哪裡吃飯", // 95

		"生產", // 96

		"當地產品", //97

		"全部", // 98

		"在八戶及周邊地區尋找餐廳", // 99

		"在八戶及周邊地區找到當地特產", // 100

		"購物清單", // 101

		"添加到購物清單", // 102

		"從購物清單中刪除", // 103

		"查看產品", //104

		"類別", // 105

		"八戶完整體驗", //106

		"查找八戶及周邊地區的住宿，活動，餐廳和當地美食", //107

		"全部", // 108

		"住宿", // 109

		"活動", // 110

		"餐廳", // 111

		"本地產品", // 112

		"將您關心的所有體驗菜單添加到該過程中，並立即檢查下一頁的可用性。 ", // 113

		"人", //114

		"人", //115

		"行程", // 116

		"添加到候選人列表", //117

		"從候選人名單中刪除", //118

		"查看候选人名单", //119
	];
}

//french

function fr_lang() {
	return [
		"Où loger", // 0

		"Destination", // 1

		"Tout prix", // 2

		"Nom du type", // 3

		"Rechercher", // 4

		"La région de Hachinohe", // 5

		"Planifiez votre voyage", // 6

		"Que faire", // 7

		"Trouver un hôtel", // 8

		"Accès", // 9

		"Contactez-nous", // 10

		"Itinéraire", // 11

		"Vérifier la disponibilité", // 12

		"Japonais", // 13

		"Ajouter à l'itinéraire'", // 14

		"Aperçu", // 15

		"Charger plus", // 16

		"De", // 17

		"Supprimer", // 18

		"Ajouté", // 19

		"Emplacement", // 20

		"Histoires", // 21

		"Expériences", // 22

		"Lieux", // 23

		"Prochains événements et actualités", // 24

		"Actualités", // 25

		"Événements à venir", // 26

		"Idées de voyages et itinéraires", // 27

		"Le parc national de Sanriku Fukko", // 28

		"Hachinohe After Dark: Bar Hopping", // 29

		"La région de Hachinohe à travers les cinq sens", // 30

		"Des montagnes à la mer", // 31

		"Voyage à travers l’histoire culinaire de Hachinohe", // 32

		"La zone Hachinohe pour les débutants", // 33

		"Informations de voyage", // 34

		"Qu'est-ce que la région de Hachinohe / Images téléchargeables", // 35

		"Brochures touristiques téléchargeables", // 36

		"Centres d'information et ressources pour les visiteurs", // 37

		"Guides locaux", // 38

		"Informations sur l'accès et le transport", // 39

		"Qu'est-ce que la région de Hachinohe", // 40

		"Site de l'entreprise'", // 41

		"Ramener Hachinohe à la maison", // 42

		"Accès", // 43

		"Contactez-nous", // 44

		"Hachinohe", // 45

		"Sannohe", // 46

		"Gonohe", // 47

		"Takko", // 48

		"Nanbu", // 49

		"Hashikami", // 50

		"Shingo", // 51

		"Oirase", // 52

		"Rechercher un mot-clé", // 53

		"Populaire", // 54

		"Recommandé", // 55

		"Tanesashi", // 56

		"Matin", // 57

		"Marient", // 58

		"Sansha", // 59

		"Enburi", // 60

		"cheval", // 61

		"hacchi", // 62

		"mutsu", // 63

		"yokocho", // 64

		"tatehana", // 65

		"Hachinohe Sansha Taisai", // 66

		"Enburi", // 67

		"Marché du matin", // 68

		"Marché du matin devant la gare de Mutsu-Minato", // 69

		"Musée Korekawa Jomon", // 70

		"Côte de Tanesashi", // 71

		"Marché matinal de Tatehana Wharf", // 72

		"Kabushima", // 73

		"Marient", // 74

		"Yokocho", // 75

		"Vu Par :", //76

		"Les Taux", //77

		"Carte", //78

		"Trouvez un logement à Hachinohe et ses environs", //79

		"Trouvez des activités dans la Hachinohe et ses environs", //80

		"Hachinohe", //81

		"Sannohe", //82

		"Gonohe", //83

		"Takko", //84

		"Nambu", //85

		"Hashikami", //86

		"Shingo", //87

		"Aomori", //88

		"Oirase", //89

		"quelque part", //90

		"Livre / Achat", // 91

		"Veuillez ajouter un produit à l'itinéraire pour continuer", //92

		"Fermer", //93

		"Restaurants", // 94

		"Où manger", // 95

		"Produire", // 96

		"Produits locaux", // 97

		"Tous", // 98

		"Trouver un restaurant dans la Hachinohe et ses environs", // 99

		"Trouver des produits locaux dans la Hachinohe et ses environs", // 100

		"liste de courses", // 101

		"Ajouter à la liste de courses", // 102

		"Retirer de la liste d'achats", // 103

		"Voir le produit", // 104

		"Catégorie", // 105

		"L'expérience complète Hachinohe", // 106

		"Trouvez des hébergements, des activités, des restaurants et des produits locaux à Hachinohe et ses environs", // 107

		"Tous", // 108

		"Hébergement", // 109

		"Activités", // 110

		"Restaurants", // 111

		"Produits locaux", // 112

		"Ajoutez tous les menus d'expérience qui " +
			"vous intéressent au processus et vérifiez immédiatement la disponibilité sur la page suivante. ", // 113

		"Personne", // 114

		"Personnes", // 115

		"Itinéraire", // 116

		"ajouter à la liste", //117

		"retirer de la liste", //118

		"Vérifier la disponibilité", // 119
	];
}
