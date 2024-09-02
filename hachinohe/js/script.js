V3.RegisterFile(
	"Uno.js",
	1.0,
	["V3.Utils", "V3.UI", "V3.API.EntityService", "V3.CABS.UI.Common"],
	function () {
		var AvailabilityMergeMethod = V3.CABS.AvailabilityMergeMethod;

		var htmlEncode = function (text) {
			if (!text) {
				return "";
			}
			return document
				.createElement("a")
				.appendChild(document.createTextNode(text)).parentNode.innerHTML;
		};
		var htmlDecode = function (html) {
			if (!html) {
				return "";
			}
			var a = document.createElement("a");
			a.innerHTML = html;
			return a.textContent;
		};

		var DisplayService = function DisplayService(settings) {
			this.base("li", "product-id");

			this._noImageUrl = settings.NoImageUrl;
			this.service(settings.Service);

			this.Insert(this.pnlInnerContainer);
		}.InheritsFrom(V3.UI.WebControlBasic, {
			_static: {
				expandedService: null,
			},

			pnlInnerContainer: V3.UI.Panel("product-item"),

			_hasImage: false,
			hasImage: V3.Property(function get() {
				return this._hasImage;
			}),
			expanded: V3.Property(false).OnChange(function (expanded) {
				if (expanded) {
					this.cssClassAdd("expand");
				} else {
					this.cssClassRem("expand");
				}
			}),

			_populate: function (service) {
				const addButtonText = isExistInCart(service.Id)
					? getRemoveClass()
					: getAddClass();
				var htmlFromPrice = "<span class='currency LT-17'>From </span>";

				if (service.Availability.Calendar.LowestRate) {
					htmlFromPrice =
						'<span class="from LT-17">From </span><span class="amount"> ¥' +
						Math.round(
							service.Availability.Calendar.LowestRate
						).toLocaleString() +
						` </span><span class="from ja-price LT-17">From </span>`;
				}

				this.Attributes.add("data-status", "false");
				this.Attributes.add("data-id", service.Id);
				this.Attributes.add("data-subtitle", service.PhysicalAddress.State);
				if (service.MainPhone) {
					this.Attributes.add(
						"data-phone",
						service.MainPhone.FullPhoneNumberLocalised ||
							(
								service.MainPhone.CountryCode +
								" " +
								service.MainPhone.AreaCode +
								" " +
								service.MainPhone.Number
							).trim()
					);
				}
				this.Attributes.add("data-email", service.PublicEmail);
				if (service.Website && service.Website.indexOf("http") == -1) {
					service.Website = "http://" + service.Website;
				}
				this.Attributes.add("data-website", service.Website);
				if (service.PhysicalAddress) {
					this.Attributes.add(
						"data-add1",
						(
							service.PhysicalAddress.Line1 +
							" " +
							service.PhysicalAddress.Line2
						).trim()
					);
					this.Attributes.add(
						"data-add2",
						service.PhysicalAddress.City +
							", " +
							service.PhysicalAddress.PostCode
					);
				}

				var address = `${service.PhysicalAddress.Line1} ${service.PhysicalAddress.Line2}, 
                ${service.PhysicalAddress.City}, ${service.PhysicalAddress.PostCode}`;

				var desc = service.ShortDescription || service.LongDescription;
				desc = cutText(desc) + " <strong>...</strong>";

				var longDesc = service.LongDescription;

				var state = service.PhysicalAddress.State;

				var htmlImage = "";
				var imgUrls = [];
				if (service.Images && service.Images.length > 0) {
					service.Images.forEach(function (img) {
						imgUrls.add(
							(
								img.Sizes.find(function (i) {
									return i.Size == 1024;
								}) || img
							).Url
						);
					});
				} else if (this._noImageUrl) {
					imgUrls.add(this._noImageUrl);
				}
				if (imgUrls.length) {
					this.Attributes.add(
						"data-image",
						'[{ "t":"i", "l":"' + imgUrls.join('" }, { "t":"i", "l":"') + '" }]'
					);
				}

				if (imgUrls.length) {
					htmlImage = `<div class="product-image preview-btn" style="background-image: url('${imgUrls[0]}');">                            
                        </div>`;
					// htmlImage = htmlImage.replace('book','devbook');
				} else {
					htmlImage = `<div class="product-image preview-btn" style="background-image: none;">                            
                        </div>`;
				}

				service.Name = htmlEncode(service.Name);

				this.pnlInnerContainer.DOMElement.innerHTML = `${htmlImage}                     
                  <div class="product-details">
                      <div class="product-details-header">
                          <div class="product-title heading-s">
                            ${service.Name} 
                            </div>                                
                                <div class="area-info"><i class="material-icons">place</i>
                                 ${address} 
                                </div>                                                                 
                          <div class="product-price">
                            ${htmlFromPrice}
                            </div>
                      </div>
                      <div class="product-description-block">                           
                          <p class="product-desc product-desc-short">                            
                            ${desc}                            
                          </p>
                          <div class="product-desc product-desc-long" style="display: none">                            
                            ${longDesc}                            
                          </div>
                      </div>
                  <div class="product-overlay">
                      <div class="tool-tip">
                      </div>
                      <div class="wrapper" style="overflow: hidden">
                          <div class="button-block" style="overflow: hidden">
                              <div class="button-container">
                                  <button class="add-btn btn btn-yellow ${addButtonText} btn-${service.Id}" title="
                                        ${service.Name} 
                                    ">Itinerary</button>
                                    <button class="preview-btn btn btn-yellow LT-15" title="
                                        ${service.Name} 
                                    ">Preview</button>                            
                               </div>
                          </div>
                      </div>
            </div>
            </div>`;
			},
			service: V3.Property(null).OnChange(function (value) {
				this.Controls.clear();
				if (value) {
					this._populate(value);
				}
			}),
		});

		var ServiceListing = function ServiceListing(container, settings) {
			this.base(container);

			this._campaign = settings.Campaign;
			this._settings = settings;
			this._ws = settings.EntityService;

			this.Insert(
				this.lblError,
				this.lblNoResults,
				this.pnlResults,
				this.lblAddingPage
			);
			this._reset();
		}.InheritsFrom(V3.UI.Panel, {
			OnServiceAdded: V3.EventPrototype("sender, e"),

			_getScore: function (service) {
				var ret = 0;

				if (service.IsInAdCampaign || service.IsInDealCampaign) {
					ret = ret + 1;
				}
				//if (this._campaign.DealCampaignCode && !service.IsInDealCampaign) {
				//    //If we're looking at deal campaigns and this service isn't in it then it loses a point
				//    ret = ret - 0.5;
				//}
				//if (service.IsInDealCampaign) {
				//    ret = ret + 0.5;
				//}

				if (service.Availability.Calendar.LowestRate) {
					ret = ret + 1;
				}

				if (service.Images && service.Images.length > 0) {
					ret = ret + 1.5;
					if (service.Images.length > 1) {
						ret = ret + 0.5;
					}
				}
				var desc = service.ShortDescription || service.LongDescription;
				if (desc && desc.length > 10) {
					ret = ret + 1 + desc.length / 4000; //add a very little for each character in the description to help prioritise items with longer descriptions (as we need more space for the text)
				}

				return ret;
			},

			lblNoResults: V3.UI.Label("No results found").Defaults({
				cssClass: "no-results-notice",
				visible: false,
			}),

			lblError: V3.UI.Label().Defaults({
				cssClass: "error",
				visible: false,
			}),

			pnlResults: V3.UI.WebControlBasic(
				"ul",
				"product-list small-block-grid-1 medium-block-grid-2 xlarge-block-grid-3"
			).Defaults({ Attributes: [{ name: "data-equalizer", value: "" }] }),

			_displayResults: function (data) {
				var entities = data.Entities;
				var previous = this._DisplayResults_Previous;
				var rowItemCount = this._DisplayResults_rowItemCount;
				var sw = new V3.Utils.StopWatch(true);
				//this.pnlResults.beginBulkLoad();
				V3.forEach(entities, this, function (service) {
					var doSwap = false;

					var ds = new DisplayService({
						NoImageUrl: this._settings.NoImageUrl,
						Service: service,
						ResultsContainerMapId: this._settings.ResultsContainerMapId,
					});

					if (data.Paging.NumberOfResults <= 3) {
						ds.Data.score = 5; /*largest display */
					} else {
						ds.Data.score = this._getScore(service);
					}

					//ds.Data.score = ds.Data.score - 3; //Test code
					//ds.Data.score = ds.Data.score - 2; //Test code
					//ds.Data.score = ds.Data.score - 1; //Test code
					//ds.Data.score = ds.Data.score + 0; //Test code
					//ds.Data.score = ds.Data.score + 1; //Test code
					//ds.Data.score = ds.Data.score + 2; //Test code
					//ds.Data.score = ds.Data.score + 3; //Test code

					var hasLongDescWithoutImage =
						(!service.Images || !service.Images.length) &&
						(service.ShortDescription || service.LongDescription || "").length >
							390; //390 chars is max length for width of 1 boxes
					var hasLongNameWithImage =
						service.Images && service.Images.length && service.Name.length > 24;
					if (
						ds.Data.score > 3 ||
						hasLongDescWithoutImage ||
						hasLongNameWithImage
					) {
						ds.Data.width = 2;
						ds.Data.idealWidth = 2;
					} else {
						ds.Data.width = 1;
						ds.Data.idealWidth = 1;
					}

					//Don't modify!!
					//Yes it's a mess, didn't get time to write a proper formula to scale based on score.
					if (ds.Data.score > 4) {
						ds.Data.idealWidth = 3;

						ds.cssClassAdd("should-be-featured");

						var featured = false;
						if (previous == null || rowItemCount + 3 <= 5) {
							featured = true;
						} else {
							//Don't swap if the previous was already featured
							if (previous.Data.width != 3) {
								if (rowItemCount - previous.Data.width + 3 == 5) {
									doSwap = true;
									featured = true;
									rowItemCount = previous.Data.width - 3;
									if (V3.debugMode) {
										ds.Style({ "box-shadow": "0 0 0 5px green" });
									}
								} else if (rowItemCount - previous.Data.width + 2 == 5) {
									doSwap = true;
									rowItemCount = previous.Data.width - 2;
									if (V3.debugMode) {
										ds.Style({ "box-shadow": "0 0 0 5px #080" });
									}
								}
							}
						}
						if (featured) {
							ds.Data.width = 3;
						} else {
							if (rowItemCount + ds.Data.width > 5) {
								if (previous.Data.width == 3) {
									previous.Data.width = 2;
									previous.cssClassRem("featured");
									previous.cssClassAdd("highlight");
									rowItemCount--;
									if (V3.debugMode) {
										previous.Style({ "box-shadow": "0 0 0 5px red" });
									}
								}
							} else {
								if (V3.debugMode) {
									ds.Style({ "box-shadow": "0 0 0 5px #800" });
								}
							}
						}
					} else {
						if (rowItemCount + ds.Data.width > 5) {
							//about to cause premature wrapping..
							if (
								previous.Data.width != ds.Data.width &&
								//don't swap if there's no size difference!
								rowItemCount - previous.Data.width + 2 == 5
							) {
								if (V3.debugMode) {
									ds.Style({ "box-shadow": "0 0 0 5px yellow" });
								}
								doSwap = true;
								rowItemCount = previous.Data.width - 2;
							} else if (rowItemCount + 1 == 5) {
								//We could make a perfect fit if we downgrade something

								var sacrifice = null;
								if (
									previous.Data.width - 1 == ds.Data.width || //can't shrink previous but we can shrink current
									(previous.Data.width == ds.Data.width &&
										ds.Data.score < previous.Data.score) //both previous and current could be shrunk, therefore only shrink the current one if it has a lower score than the previous
								) {
									ds.Data.width = 1; //Shink the current item
									if (V3.debugMode) {
										ds.Style({ "box-shadow": "0 0 0 5px purple" });
									}
								} else if (previous.Data.width == 2) {
									//Shrink the previous item
									previous.cssClassRem("highlight");
									rowItemCount--; //Update row count
									if (V3.debugMode) {
										previous.Style({ "box-shadow": "0 0 0 5px pink" });
									}
								}
							}
						}
					}

					if (ds.Data.width == 2) {
						ds.cssClassAdd("highlight");
					} else if (ds.Data.width == 3) {
						ds.cssClassAdd("featured");
					}
					if (V3.debugMode) {
						ds.cssClassAdd("row-count-" + rowItemCount);
						ds.Insert(ds.Data.score + "");
					}

					rowItemCount = rowItemCount + ds.Data.width;
					if (rowItemCount >= 5) {
						if (V3.debugMode && rowItemCount > 5) {
							Break();
						}
						rowItemCount = 0;
					}

					if (!doSwap) {
						this.pnlResults.Controls.add(ds);
					} else {
						this.pnlResults.Controls.addAt(
							this.pnlResults.Controls.count() - 1,
							ds
						);
					}
					this.OnServiceAdded.fire(this, ds);

					previous = ds;
				});
				//this.pnlResults.endBulkLoad();
				sw.stop();
				V3.Log.Info(
					"Time to render " +
						entities.length +
						" services: " +
						sw.getDuration() +
						"ms"
				);

				this._DisplayResults_Previous = previous;
				this._DisplayResults_rowItemCount = rowItemCount;
			},
			_checkPending: function () {
				//if (this._pendingRender.length == 0) {
				//    return;
				//}

				var ready;
				while (
					(ready = V3.find(
						this._pendingRender,
						function (i) {
							return i.Paging.PageNumber == this._renderedPage + 1;
						}.bind(this)
					))
				) {
					this._pendingRender.remove(ready);
					this._currentPage = ready.Paging.PageNumber;
					this._displayResults(ready);
					this._renderedPage = ready.Paging.PageNumber;
				}
			},
			_reset: function () {
				$(".more-btn").hide().next("img").hide();
				$(".result-count").text("");
				this.pnlResults.Controls.clear();
				this._currentPagingToken = null;
				this._currentPage = null;
				this._totalPages = null;
				this._renderedPage = null;
				this._isLoadingNextPage = false;
				this._inErrorLoadingPage = false;
				this.cssClassRem("is-adding-page");
				this.cssClassRem("is-updating");
				this.cssClassRem("no-results");
				this.cssClassRem("load-completed");

				this._DisplayResults_Previous = null;
				this._DisplayResults_rowItemCount = 0;
			},
			_ws_Success: function (isPage, data) {
				if (isPage) {
					this._isLoadingNextPage = false;
					this.cssClassRem("is-adding-page");
				} else {
					this._reset();

					this._currentPagingToken = data.Paging.Token;
					this._totalPages = data.Paging.NumberOfPages;
					this._renderedPage = 0;

					$(".result-count").text(
						data.Paging.NumberOfResults.toString() +
							" Result" +
							(data.Paging.NumberOfResults > 1 ? "s" : "")
					);

					this.cssClassRem("is-updating");

					if (data.Entities.length == 0) {
						this.cssClassAdd("no-results");
						this.lblNoResults.visible(true);
						this._afterWebCall();
						return;
					} else {
						this.cssClassRem("no-results");
						this.lblNoResults.visible(false);
					}
					// window.scrollTo(0, 0);
				}
				this._currentPage = data.Paging.PageNumber;

				V3.Log.Info("Received page: " + data.Paging.PageNumber);

				this._pendingRender.add(data);
				this._checkPending();

				if (data.Paging.PageNumber == data.Paging.NumberOfPages) {
					this.cssClassAdd("load-completed");
				}

				this._afterWebCall();
			},
			_ws_Failure: function (isPage, error) {
				this.cssClassRem("is-updating");
				this.cssClassRem("is-adding-page");

				if (isPage) {
					this._isLoadingNextPage = false;
					this._inErrorLoadingPage = true;
				} else {
					this.pnlResults.Controls.clear();
				}

				this.pnlResults.Insert(
					document.createComment(JSON.stringify(error.response))
				);

				this.pnlResults.Insert(
					document.createComment(JSON.stringify(error.response)),
					new V3.UI.Label(
						"Uh oh, there was an unexpected error, please try again later."
					)
						.Insert(document.createElement("br"), error.message)
						.Set({ cssClass: "error" })
				);

				this._afterWebCall();

				if (error.response && error.response.Message === "Invalid token") {
					//Token expired, start again.
					this.performSearch();
				}
			},

			_afterWebCall: function () {
				if (this._renderedPage < this._totalPages) {
					$(".more-btn").show().next("img").hide();
				} else {
					$(".more-btn").hide().next("img").hide();
				}

				//Translate page
				translatePage();
			},

			_currentSearch: null,
			_currentSearchDelayTimerId: null,

			_renderedPage: null,
			_currentPage: null,
			_currentPagingToken: null,
			_totalPages: null,
			_pendingRender: null,
			_isLoadingNextPage: false,
			_inErrorLoadingPage: false,

			loadNextPage: function () {
				if (!this._currentPagingToken) {
					return;
				}
				if (this._currentPage >= this._totalPages) {
					return;
				}
				this._isLoadingNextPage = true;
				//this._currentPage = this._currentPage + 1;
				this._currentSearch = this._ws.Search(
					this._ws_Success.bind(this, true),
					this._ws_Failure.bind(this, true),
					{
						Paging: {
							PageSize: this._settings.PageSize,
							PageNumber: this._currentPage + 1,
							Token: this._currentPagingToken,
						},
						Output: this._createOutputRequest(),
					}
				);
				this.cssClassAdd("is-adding-page");
				$(".more-btn").hide().next("img").show();
			},
			_createOutputRequest: function () {
				return {
					CommonContent: {
						All: true,
						Name: true,
					},
					Availability: {
						StartDate: this._settings.PriceWindow.Date,
						NumberOfDays: Math.min(92, this._settings.PriceWindow.Size),
						FlagCampaigns: true,
						MergeMethod: AvailabilityMergeMethod.LowestRateForCampaign,
						LowestRateOnly: true,
					},
				};
			},
			performSearch: function () {
				if (this._currentSearch) {
					this._currentSearch.abort();
				}
				if (this._currentSearchDelayTimerId) {
					V3.Log.Debug(
						"Cancelling _currentSearchDelayTimerId: " +
							this._currentSearchDelayTimerId
					);
					clearTimeout(this._currentSearchDelayTimerId);
					this._currentSearchDelayTimerId = null;
				}

				var includeCampaignOnlyServices = this.filterByCampaignRelevant();
				this._reset();

				var criteria = this.filterCriteria() || {};
				var filter = {
					MustBeInAdCampaign: this._settings.Campaign.AdCampaignCode != null,
					MustBeInDealCampaign: includeCampaignOnlyServices,
					Type: V3.CABS.EntityTypeEnum.Service,
				};

				var availability = null;
				var output = this._createOutputRequest();

				if (
					V3.Is.Specified(criteria.IndustryCategoryGroup) &&
					criteria.IndustryCategoryGroup
				) {
					filter.TagCriteria = {
						IndustryCategoryGroups: [criteria.IndustryCategoryGroup],
					};
				}
				if (V3.Is.Specified(criteria.LocationId)) {
					filter.Geolocation = { LocationIds: [criteria.LocationId] };
				}
				if (V3.Is.Specified(criteria.Name)) {
					filter.Names = ["%" + criteria.Name + "%"];
				}
				if (V3.Is.Specified(criteria.Price)) {
					availability = {
						MergeMethod: includeCampaignOnlyServices
							? AvailabilityMergeMethod.LowestRateForCampaign
							: AvailabilityMergeMethod.LowestRate,
						Window: {
							StartDate: output.Availability.StartDate,
							Size: output.Availability.NumberOfDays,
						},
					};
					filter.Bookability = {
						RateRange: {
							Min: criteria.Price.Min,
							Max: criteria.Price.Max,
						},
					};
				}

				if (V3.Is.Specified(criteria.Guest)) {
					filter.Bookability = Object.assign(
						{ GuestsCapability: criteria.Guest },
						filter.Bookability
					);
				}

				this._currentPagingToken = null;
				this._pendingRender = [];
				this._currentPage = null;
				this._totalPages = null;

				this._currentSearchDelayTimerId = setTimeout(
					function () {
						this._currentSearchDelayTimerId = null;
						this._currentSearch = this._ws.Search(
							this._ws_Success.bind(this, false),
							this._ws_Failure.bind(this, false),
							{
								//REQUEST
								Availability: availability,
								Campaign: this._campaign,
								Filter: filter,
								Language: getLanguage(),
								Paging: {
									PageNumber: 1,
									PageSize: this._settings.PageSize,
									Sorting: [{ By: this._settings.SortOrder || 0 }], //0: Default, 1: Name, 2: Price, 3: Rating
								},
								Output: output,
							}
						);
					}.bind(this),
					100
				);
				this.lblNoResults.visible(false);
				$(".more-btn").hide().next("img").show();
				this.cssClassAdd("is-updating");
			},

			filterByCampaignRelevant: V3.Property(true).OnChange(function (value) {
				// this.performSearch();
			}),
			filterCriteria: V3.Property(null).OnChange(function (value) {
				this.performSearch();
			}),

			showError: function (message) {
				if (!message) {
					this.lblError.visible(false);
				} else {
					this.lblError.visible(true);
					this.lblError.text(message);
				}
			},
			hideError: function () {
				this.lblError.visible(false);
			},
		});

		var ServiceListingOnMap = function ServiceListingOnMap(
			container,
			settings
		) {
			this.base(container);

			this._campaign = settings.Campaign;
			this._settings = settings;
			this._ws = settings.EntityService;

			this.Insert(
				this.lblError,
				this.lblNoResults,
				this.pnlResults,
				this.lblAddingPage
			);
			this._reset();
		}.InheritsFrom(V3.UI.Panel, {
			OnServiceAdded: V3.EventPrototype("sender, e"),

			_getScore: function (service) {
				var ret = 0;

				// if (service.IsInAdCampaign || service.IsInDealCampaign) {
				//     ret = ret + 1;
				// }
				//if (this._campaign.DealCampaignCode && !service.IsInDealCampaign) {
				//    //If we're looking at deal campaigns and this service isn't in it then it loses a point
				//    ret = ret - 0.5;
				//}
				//if (service.IsInDealCampaign) {
				//    ret = ret + 0.5;
				//}

				if (service.Availability.Calendar.LowestRate) {
					ret = ret + 1;
				}

				if (service.Images && service.Images.length > 0) {
					ret = ret + 1.5;
					if (service.Images.length > 1) {
						ret = ret + 0.5;
					}
				}
				var desc = service.ShortDescription || service.LongDescription;
				if (desc && desc.length > 10) {
					ret = ret + 1 + desc.length / 4000; //add a very little for each character in the description to help prioritise items with longer descriptions (as we need more space for the text)
				}

				return ret;
			},

			lblNoResults: V3.UI.Label("No results found").Defaults({
				cssClass: "no-results-notice",
				visible: false,
			}),

			lblError: V3.UI.Label().Defaults({
				cssClass: "error",
				visible: false,
			}),

			pnlResults: V3.UI.WebControlBasic(
				"ul",
				"product-list small-block-grid-1 medium-block-grid-2 xlarge-block-grid-3"
			).Defaults({ Attributes: [{ name: "data-equalizer", value: "" }] }),

			_displayResults: function (data) {
				var entities = data.Entities;
				var previous = this._DisplayResults_Previous;
				var rowItemCount = this._DisplayResults_rowItemCount;
				var sw = new V3.Utils.StopWatch(true);
				//this.pnlResults.beginBulkLoad();
				var entitiesWithGeoCode = [];
				V3.forEach(entities, this, function (service) {
					if (service.HasGeocodes) entitiesWithGeoCode.push(service);
				});
				//this.pnlResults.endBulkLoad();
				this._displayResultsInMap(entitiesWithGeoCode, this.DOMElement);
				sw.stop();
				V3.Log.Info(
					"Time to render on map " +
						entities.length +
						" services: " +
						sw.getDuration() +
						"ms"
				);

				this._DisplayResults_Previous = previous;
				this._DisplayResults_rowItemCount = rowItemCount;
			},
			_displayResultsInMap: function (entitiesWithGeoCode, DOMElement) {
				var map = new google.maps.Map(DOMElement, {
					zoom: this._settings.zoomMap,
					center: this._settings.centerLocation,
				});

				var infowindow = new google.maps.InfoWindow({
					content: "",
				});

				const productNames = [];
				var markers = entitiesWithGeoCode.map(function (service, i) {
					productNames[service.Id] = service.Name;
					var marker = new google.maps.Marker({
						position: {
							lat: service.Geocodes[0].Geocode.Latitude,
							lng: service.Geocodes[0].Geocode.Longitude,
						},
						label: "●",
						service: service,
					});

					google.maps.event.addListener(infowindow, "domready", function () {
						//translate map
						translatePage();
					});

					google.maps.event.addListener(marker, "click", function () {
						const addButtonText = isExistInCart(service.Id)
							? getRemoveClass()
							: getAddClass();
						var htmlFromPrice = "";
						if (service.Availability.Calendar.LowestRate) {
							htmlFromPrice =
								'<span class="currency LT-17">From </span><span class="amount"> ¥' +
								Math.round(
									service.Availability.Calendar.LowestRate
								).toLocaleString() +
								"</span>";
						}
						var imgUrls = [];
						var htmlImage = "";
						if (service.Images && service.Images.length > 0) {
							service.Images.forEach(function (img) {
								imgUrls.add(
									(
										img.Sizes.find(function (i) {
											return i.Size == 1024;
										}) || img
									).Url
								);
							});
						} else if (this._noImageUrl) {
							imgUrls.add(this._noImageUrl);
						}
						if (imgUrls.length) {
							htmlImage =
								`<a href="" class="preview-btn"><div class="product-image-map" style="background-image: url(\'` +
								imgUrls[0] +
								"');\"></div></a>";
						} else {
							htmlImage = `<a href="" class="preview-btn"><div class="product-image-map" style="background-image: url('');"></div></a>`;
						}

						const phone =
							service.MainPhone.FullPhoneNumberLocalised ||
							(
								service.MainPhone.CountryCode +
								" " +
								service.MainPhone.AreaCode +
								" " +
								service.MainPhone.Number
							).trim();

						const Line1 = service.PhysicalAddress.Line1;
						const Line2 = service.PhysicalAddress.Line2;
						const city = service.PhysicalAddress.City;
						const postCode = service.PhysicalAddress.PostCode;

						const address = service.PhysicalAddress
							? `${Line1} ${Line2}, ${city}, ${postCode}`
							: "";

						infowindow.setContent(
							`<div id="mapInfoBox" 
                                data-status="false" 
                                data-id="${service.Id}"
                                data-subtitle="${service.PhysicalAddress.State}"
                                data-email="${service.PublicEmail}"
                                data-website="${service.Website}"
                            ` +
								(service.PhysicalAddress
									? `
                                    data-add1="${service.PhysicalAddress.Line1} ${service.PhysicalAddress.Line2}
                                    data-add2="${service.PhysicalAddress.City}, ${service.PhysicalAddress.PostCode}
                                `
									: "") +
								(service.MainPhone
									? `
                                    data-phone="${phone}"
                                `
									: "") +
								`>` +
								htmlImage +
								'<div style="font-weight: 600">' +
								htmlFromPrice +
								"</div>" +
								"  <p><b class='product-title'>" +
								htmlEncode(service.Name) +
								"</b></p>" +
								`<p><b class='product-address'>${address}</b></p>` +
								"  <p class='.product-desc-short'>" +
								(service.ShortDescription || service.LongDescription) +
								"</p>" +
								`<div class="center-items">
                                <button class="add-btn btn btn-yellow  ${addButtonText} btn-${service.Id}">                                                                        
                                 </button>
                            </div>` +
								"</div>"
						);

						infowindow.open(map, marker);
					});
					return marker;
				});

				populateFromCookie(productNames);

				// Add a marker clusterer to manage the markers.
				var markerCluster = new MarkerClusterer(map, markers, {
					imagePath:
						"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
				});
			},
			_checkPending: function () {
				//if (this._pendingRender.length == 0) {
				//    return;
				//}

				var ready;
				while (
					(ready = V3.find(
						this._pendingRender,
						function (i) {
							return i.Paging.PageNumber == this._renderedPage + 1;
						}.bind(this)
					))
				) {
					this._pendingRender.remove(ready);
					this._currentPage = ready.Paging.PageNumber;
					this._displayResults(ready);

					this._renderedPage = ready.Paging.PageNumber;
				}
			},
			_reset: function () {
				this.pnlResults.Controls.clear();
				this._currentPagingToken = null;
				this._currentPage = null;
				this._totalPages = null;
				this._renderedPage = null;
				this._isLoadingNextPage = false;
				this._inErrorLoadingPage = false;
				this.cssClassRem("is-adding-page");
				this.cssClassRem("is-updating");
				this.cssClassRem("no-results");
				this.cssClassRem("load-completed");

				this._DisplayResults_Previous = null;
				this._DisplayResults_rowItemCount = 0;
			},
			_ws_Success: function (isPage, data) {
				if (isPage) {
					this._isLoadingNextPage = false;
					this.cssClassRem("is-adding-page");
				} else {
					this._reset();

					this._currentPagingToken = data.Paging.Token;
					this._totalPages = data.Paging.NumberOfPages;
					this._renderedPage = 0;

					$(".result-count").text(
						data.Paging.NumberOfResults.toString() +
							" Result" +
							(data.Paging.NumberOfResults > 1 ? "s" : "")
					);

					this.cssClassRem("is-updating");

					if (data.Entities.length == 0) {
						this.cssClassAdd("no-results");
						this.lblNoResults.visible(true);
						this._afterWebCall();
						return;
					} else {
						this.cssClassRem("no-results");
						this.lblNoResults.visible(false);
					}
					// window.scrollTo(0, 0);
				}
				this._currentPage = data.Paging.PageNumber;

				V3.Log.Info("Received page: " + data.Paging.PageNumber);

				this._pendingRender.add(data);
				this._checkPending();

				if (data.Paging.PageNumber == data.Paging.NumberOfPages) {
					this.cssClassAdd("load-completed");
				}

				this._afterWebCall();
			},
			_ws_Failure: function (isPage, error) {
				this.cssClassRem("is-updating");
				this.cssClassRem("is-adding-page");

				if (isPage) {
					this._isLoadingNextPage = false;
					this._inErrorLoadingPage = true;
				} else {
					this.pnlResults.Controls.clear();
				}

				this.pnlResults.Insert(
					document.createComment(JSON.stringify(error.response))
				);

				this.pnlResults.Insert(
					document.createComment(JSON.stringify(error.response)),
					new V3.UI.Label(
						"Uh oh, there was an unexpected error, please try again later."
					)
						.Insert(document.createElement("br"), error.message)
						.Set({ cssClass: "error" })
				);

				this._afterWebCall();

				if (error.response && error.response.Message === "Invalid token") {
					//Token expired, start again.
					this.performSearch();
				}
			},

			_afterWebCall: function () {},

			_currentSearch: null,
			_currentSearchDelayTimerId: null,

			_renderedPage: null,
			_currentPage: null,
			_currentPagingToken: null,
			_totalPages: null,
			_pendingRender: null,
			_isLoadingNextPage: false,
			_inErrorLoadingPage: false,

			loadNextPage: function () {
				if (!this._currentPagingToken) {
					return;
				}
				if (this._currentPage >= this._totalPages) {
					return;
				}
				this._isLoadingNextPage = true;
				//this._currentPage = this._currentPage + 1;
				this._currentSearch = this._ws.Search(
					this._ws_Success.bind(this, true),
					this._ws_Failure.bind(this, true),
					{
						Campaign: this._campaign,
						Paging: {
							PageSize: this._settings.PageSize,
							PageNumber: this._currentPage + 1,
							Token: this._currentPagingToken,
						},
						Output: this._createOutputRequest(),
					}
				);
				this.cssClassAdd("is-adding-page");
				$(".more-btn").hide().next("img").show();
			},
			_createOutputRequest: function () {
				return {
					CommonContent: {
						All: true,
						Name: true,
					},
					Availability: {
						StartDate: this._settings.PriceWindow.Date,
						NumberOfDays: Math.min(92, this._settings.PriceWindow.Size),
						FlagCampaigns: true,
						MergeMethod: AvailabilityMergeMethod.LowestRateForCampaign,
						LowestRateOnly: true,
					},
				};
			},
			performSearch: function () {
				// console.trace("performSearch for map");
				if (this._currentSearch) {
					this._currentSearch.abort();
				}
				if (this._currentSearchDelayTimerId) {
					V3.Log.Debug(
						"Cancelling _currentSearchDelayTimerId: " +
							this._currentSearchDelayTimerId
					);
					clearTimeout(this._currentSearchDelayTimerId);
					this._currentSearchDelayTimerId = null;
				}

				var includeCampaignOnlyServices = this.filterByCampaignRelevant();
				this._reset();

				var criteria = this.filterCriteria() || {};
				var filter = {
					MustBeInAdCampaign: this._settings.Campaign.AdCampaignCode != null,
					MustBeInDealCampaign: false,
					Type: V3.CABS.EntityTypeEnum.Service,
				};

				var availability = null;
				var output = this._createOutputRequest();

				if (V3.Is.Specified(criteria.IndustryCategoryGroup)) {
					filter.TagCriteria = {
						IndustryCategoryGroups: [criteria.IndustryCategoryGroup],
					};
				}
				if (V3.Is.Specified(criteria.LocationId)) {
					filter.Geolocation = { LocationIds: [criteria.LocationId] };
				}
				if (V3.Is.Specified(criteria.Name)) {
					filter.Names = ["%" + criteria.Name + "%"];
				}
				if (V3.Is.Specified(criteria.Price)) {
					availability = {
						MergeMethod: includeCampaignOnlyServices
							? AvailabilityMergeMethod.LowestRateForCampaign
							: AvailabilityMergeMethod.LowestRate,
						Window: {
							StartDate: output.Availability.StartDate,
							Size: output.Availability.NumberOfDays,
						},
					};
					filter.Bookability = {
						RateRange: {
							Min: criteria.Price.Min,
							Max: criteria.Price.Max,
						},
					};
				}

				this._currentPagingToken = null;
				this._pendingRender = [];
				this._currentPage = null;
				this._totalPages = null;

				this._currentSearchDelayTimerId = setTimeout(
					function () {
						this._currentSearchDelayTimerId = null;
						this._currentSearch = this._ws.Search(
							this._ws_Success.bind(this, false),
							this._ws_Failure.bind(this, false),
							{
								//REQUEST
								Availability: availability,
								Campaign: this._campaign,
								Filter: filter,
								Paging: {
									PageNumber: 1,
								},
								Output: output,
								Sorting: {
									Sort: {
										By: 3,
										Direction: 2,
										//PositionOfNull: 0,
									},
								},
							}
						);
					}.bind(this),
					100
				);
				this.lblNoResults.visible(false);
				$(".more-btn").hide().next("img").show();
				this.cssClassAdd("is-updating");
			},

			filterByCampaignRelevant: V3.Property(true).OnChange(function (value) {
				// this.performSearch();
			}),
			filterCriteria: V3.Property(null).OnChange(function (value) {
				this.performSearch();
			}),

			showError: function (message) {
				if (!message) {
					this.lblError.visible(false);
				} else {
					this.lblError.visible(true);
					this.lblError.text(message);
				}
			},
			hideError: function () {
				this.lblError.visible(false);
			},
		});

		var CampaignBanner = function CampaignBanner(settings) {
			this.base(settings.DOMElement);
			this._canBeVisible(false);
		}.InheritsFrom(V3.UI.Panel, {
			campaign: V3.Property(null).OnChange(function (value) {
				this.Controls.clear();
				this._canBeVisible(!!value);
				if (!value) {
					return;
				}
				var $me = $(this.DOMElement);
				if (value.ImageUrl) {
					$me.find(".banner-image").attr("src", value.ImageUrl);
					$me.find(".banner-image").show();
					$me.find(".banner-image").css("visibility", "visible");
					//See NT's "site.js" file for the init code
					$(".banner-slider").slick("reinit");
				} else {
					$me.find(".banner-image").hide();
				}

				$me.find(".title h1 span").text(value.Name || "");
				$me.find(".title p").html(value.Description || "");
			}),
		});

		var TNTController = function TNTController(settings) {
			this.base();

			this._settings = settings;

			// if (settings.Shortname && settings.Campaign.AdCampaignCode) {
			//     this._settings.CampaignService.GetAdCampaign(
			//         this._GetCampaign_OnSuccess.bind(this),
			//         this._GetCampaign_OnFailure.bind(this),
			//         {
			//             Shortname: settings.Shortname,
			//             Code: settings.Campaign.AdCampaignCode
			//         }
			//     );
			// }

			V3.Utils.OnLoad.addEventHandler(this._init.bind(this));
		}.InheritsFrom(V3.Class, {
			_settings: null,
			_adCampaign: null,
			_campaignSlogan: null,

			createAdFlagControl: function (large) {
				if (!this._adCampaign) {
					return null;
				} else {
					return new V3.UI.Label()
						.Set({ cssClass: "ad-mark " + (large ? "largel" : "medium") })
						.Insert(new V3.UI.Label(this._adCampaign.Slogan));
				}
			},

			_GetCampaign_OnSuccess: function (rs) {
				this._adCampaign = rs;
			},
			_GetCampaign_OnFailure: function (error) {},

			_pnlServiceListing_OnServiceAdded: function (sender, ds) {
				var service = ds.service();
				// if (
				//     this._campaignSlogan &&
				//     (service.IsInAdCampaign || service.IsInDealCampaign)
				// ) {
				//     var div = document.createElement("div");
				//     div.className = "special-label";
				//     // div.innerHTML = htmlEncode(this._campaignSlogan);
				//     // ds.pnlInnerContainer.DOMElement.insertBefore(div, ds.pnlInnerContainer.DOMElement.firstChild);
				// }

				// Clicking the "Preview" buttons
				setTimeout(function () {
					var $me = $(ds.DOMElement);

					// Set the height of the product images
					// setItemHeight($me.find(".product-image"), productImageRatio);

					$me.find(".preview-btn").on("click", showPreviewModal);

					// Clicking the "Add to Itinerary" buttons on product list
					$me.find(".add-btn").on("click", addToCart);

					// Clicking the "My Journey" button
					// $me.find(".my-journey-btn").on("click", showCartModal);

					// Click the "More" button
					$me.find(".more-btn").on("click", loadMore);

					removeDragging(); //ALWAYS RESET TO ZERO!
					draggingController();
				}, 50);
			},

			_btnPerformNewSearch_Click: function () {
				var criteria = {};
				criteria.IndustryCategoryGroup =
					document.getElementById("productTypeOption")?.value || null;
				criteria.LocationId =
					document.getElementById("searchDestination").value;

				criteria.Name = document.getElementById("Keyword").value;
				criteria.Guest = document.getElementById("numberOfPax")?.value;

				var pRange = document.getElementById("priceRange")?.value.split("-");

				if (pRange && pRange.length == 2) {
					//We always expect a - in the valid values, hence always an array of length 2
					var min = pRange[0] ? parseInt(pRange[0], 10) : null;
					var max = pRange[1] ? parseInt(pRange[1], 10) : null;
					if (min || max) {
						criteria.Price = { Min: min, Max: max };
					}
				}

				if (!criteria.Name || criteria.Name == "Name") {
					criteria.Name = null;
				} //Ignore the default (placeholder) text.
				if (!criteria.LocationId) {
					criteria.LocationId = null;
				}

				if (
					criteria.IndustryCategoryGroup ||
					criteria.LocationId ||
					criteria.Name ||
					criteria.Price
				) {
					//Show all matching results for given criteria
					// this._pnlServiceListing.filterByCampaignRelevant(false);
					this._pnlServiceListing.filterCriteria(criteria);
				} else {
					//Only show campaign results (no custom criteria has been applied)
					// this._pnlServiceListing.filterByCampaignRelevant(true);
					this._pnlServiceListing.filterCriteria(null);
				}
				this._pnlServiceListing.performSearch();

				return false; //don't allow the buttons default behaviour
			},

			_btnBookNow_Click: function () {
				//Reset favourites controller in preperation for a new list
				var serviceIds = [];

				//Using some NT code, add each cart item into the favourites controller
				var data = JSON.parse(localStorage.getItem("hachinohe_cart") || "[]");
				$(".shopping-cart .journey-name").val(data);
				var journey = data; // in case the cookie info doesn't exist
				for (var i = 0; i < journey.length; i++) {
					serviceIds.add(journey[i].id);
				}

				if (journey.length == 0) {
					showWarning(getLanguageData("92"));
					return;
				}

				//Lets go to CABS
				this._settings.InjectionService.searchInjection({
					//Options
					exl_acp: this._settings.Campaign.AdCampaignCode,
					exl_bs: this._settings.BrandingStyle,
					exl_ad: this._settings.NumberOfAdults,
					exl_sdte: 0,
					// exl_grp: 'act',
					Criteria: {
						IndustryCategoryGroup: getProductType(),
					},

					Favourites: serviceIds,
				});

				//Close the modal before redirection so that when the user clicks 'back' in the browser the modal is closed.
				//$("#modal_bookContinue").foundation("reveal", "close");
				return false;
			},

			_init: function () {
				var resultsContainer = document.getElementById(
					this._settings.ResultsContainerId
				);
				if (!resultsContainer) {
					throw new Error("Results Container not found");
				}

				var bannerContainer = null;
				if (this._settings.BannerContainerId) {
					bannerContainer = document.getElementById(
						this._settings.BannerContainerId
					);
				}
				if (!bannerContainer) {
					bannerContainer = document.createElement("div");
				}
				this._pnlCampaignBanner = new CampaignBanner({
					DOMElement: bannerContainer,
				});

				var me = this;

				this._pnlServiceListing = new ServiceListing(
					resultsContainer,
					this._settings
				).Set({
					OnServiceAdded: this._pnlServiceListing_OnServiceAdded.bind(this),
				});

				this._pnlServiceListingOnMap = new ServiceListingOnMap(
					document.getElementById(this._settings.ResultsContainerMapId),
					this._settings
				);

				if (!settings.Shortname) {
					this._pnlCampaignBanner.visible(false);
					this._pnlServiceListing.showError(
						"Error: Insufficient information provided"
					);
				}
				// if (!settings.Campaign.AdCampaignCode) {
				//     if (settings.Campaign.DealCampaignCode) {
				//         this._pnlServiceListing.showError(
				//             "Error: Deal Campaigns not supported on this page."
				//         );
				//     } else {
				//         this._GetCampaign_OnSuccess();
				//     }
				// }

				var loadMore = function () {
					me._pnlServiceListing.loadNextPage();
					return false; //don't allow the buttons default behaviour
				};

				$(".more-btn").off("click").on("click", loadMore);
				$(".continue-btn").on("click", this._btnBookNow_Click.bind(this));
				$(".search-btn").on(
					"click",
					this._btnPerformNewSearch_Click.bind(this)
				);
				console.log(getProductType());
				this._pnlServiceListing.filterCriteria({
					IndustryCategoryGroup: getProductType(),
				});
				this._pnlServiceListingOnMap.filterCriteria({
					IndustryCategoryGroup: getProductType(),
				});
			},
		});
		V3.TNTController = TNTController;
	}
);
