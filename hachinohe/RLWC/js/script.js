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

		//tickets
		var DisplayServiceTickets = function DisplayServiceTickets(settings) {
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
				const addButtonText = isExistInCart(service.Id) ? "LT-117" : "LT-118";
				var htmlFromPrice = "<span class='currency LT-17'>From </span>";
				if (service.Availability.Calendar.LowestRate) {
					htmlFromPrice =
						'<span class="currency LT-17">From </span><span class="amount"> £' +
						Math.round(
							service.Availability.Calendar.LowestRate
						).toLocaleString() +
						"</span>";
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
					let Line1 = service.PhysicalAddress.Line1;
					Line1 += Line1 ? ", " : "";

					let Line2 = service.PhysicalAddress.Line2;
					Line2 += Line2 ? ", " : "";

					let City = service.PhysicalAddress.City;
					City += City ? ", " : "";

					let PostCode = service.PhysicalAddress.PostCode;
					// PostCode += PostCode ? ', ' : '';

					this.Attributes.add("data-add1", `${Line1} ${Line2}`);
					this.Attributes.add("data-add2", `${City} ${PostCode}`);
				}

				var desc = service.ShortDescription;
				var ticketDate = helper.extractDateFromText(desc);
				var longDesc = service.LongDescription;
				// var shortDesc = service.ShortDescription;
				// var longDesc = service.LongDescription;
				var state = service.PhysicalAddress.State;

				// if (shortDesc == null) {
				//     var desc = service.LongDescription;
				// } else {
				//     var desc = service.ShortDescription;
				// }

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

				const serviceItem =
					`${htmlImage}                     
                  <div class="product-details">
                      <div class="product-details-header">
                          <input type="hidden" class="serviceType" value="ticket">
                          <input type="hidden" class="ticketDate" value="${ticketDate}">
                          <div class="product-title themeColor heading-s">
                            ${service.Name} 
                            </div>` +
					`<div class="product-price">
                            ${htmlFromPrice}
                            </div>
                      </div>
                      <div class="product-description-block">
                          <div class="product-desc product-desc-ticket">                            
                            ${desc}                            
                           </div>
                      </div>
                      <div class="product-description-block" style="display: none">
                          <div class="product-desc product-desc-short">                            
                            ${longDesc}                            
                           </div>
                      </div>                      
                  <div class="product-overlay">
                      <div class="tool-tip">
                      </div>
                      <div class="wrapper">
                          <div class="button-block">
                              <div class="button-container">
                                  <div class="add-btn btn btn-secondary ${addButtonText} btn-${service.Id}" title="
                                        ${service.Name} 
                                    "></div>
                                    <div class="preview-btn btn btn-secondary LT-15" title="
                                        ${service.Name} 
                                    ">View</div>                            
                               </div>
                          </div>
                      </div>
            </div>
            </div>`;

				this.pnlInnerContainer.DOMElement.innerHTML = serviceItem;
			},
			service: V3.Property(null).OnChange(function (value) {
				this.Controls.clear();
				if (value) {
					this._populate(value);
				}
			}),
		});

		var ServiceListingTickets = function ServiceListingTickets(
			container,
			settings
		) {
			this.base(document.getElementById(settings.TicketsContainer));
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

					var ds = new DisplayServiceTickets({
						NoImageUrl: this._settings.NoImageUrl,
						Service: service,
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

				//show empty notice
				const container = $("#" + this._settings.TicketsContainer);
				if (container.find("ul > li").length == 0) {
					container.find(".no-results-notice").css("visibility", "visible");
				}

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
					//window.scrollTo(0, 0);
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
					$(".more-tickets").show().next("img").hide();
					// $(".more-tickets").on('click',loadMoreTickets);
				} else {
					$(".more-tickets").hide().next("img").hide();
				}
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
						//Campaign: this._campaign,
						Paging: {
							PageSize: this._settings.PageSize,
							PageNumber: this._currentPage + 1,
							Token: this._currentPagingToken,
						},
						Output: this._createOutputRequest(),
					}
				);
				this.cssClassAdd("is-adding-page");
				$(".more-tickets").hide().next("img").show();
			},
			_createOutputRequest: function () {
				const commonContent = {
					CommonContent: {
						All: true,
						Name: true,
					},
				};

				const availability = {
					Availability: {
						StartDate:
							this._settings.PriceWindowTickets.Date[
								this._settings.Campaign.AdCampaignCode
							],
						NumberOfDays: Math.round(this._settings.PriceWindowTickets.Size),
						FlagCampaigns: true,
						MergeMethod: AvailabilityMergeMethod.LowestRateForCampaign,
						LowestRateOnly: true,
					},
				};

				return { ...commonContent, ...availability };
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
					MustBeInAdCampaign: true,
					MustBeInDealCampaign: false,
					Type: 3,
					Ids: this._settings.TicketIds,
				};

				var availability = null;
				var output = this._createOutputRequest();

				//if (V3.Is.Specified(criteria.IndustryCategoryGroup)) {
				filter.TagCriteria = {
					IndustryCategoryGroups: [1],
				};
				//}
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
								Language: "en-US",
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
				this.performSearch();
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

		//accommodations
		var DisplayServiceAccommodations = function DisplayServiceAccommodations(
			settings
		) {
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
				const addButtonText = isExistInCart(service.Id) ? "LT-19" : "LT-14";
				var htmlFromPrice = "<span class='currency LT-17'>From </span>";
				if (service.Availability.Calendar.LowestRate) {
					htmlFromPrice =
						'<span class="currency LT-17">From </span><span class="amount"> £' +
						Math.round(
							service.Availability.Calendar.LowestRate
						).toLocaleString() +
						"</span>";
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
				let address = "";
				if (service.PhysicalAddress) {
					let Line1 = service.PhysicalAddress.Line1;
					Line1 += Line1 ? ", " : "";

					let Line2 = service.PhysicalAddress.Line2;
					Line2 += Line2 ? ", " : "";

					let City = service.PhysicalAddress.City;
					City += City ? ", " : "";

					let PostCode = service.PhysicalAddress.PostCode;
					// PostCode += PostCode ? ', ' : '';

					this.Attributes.add("data-add1", `${Line1} ${Line2}`);
					this.Attributes.add("data-add2", `${City} ${PostCode}`);

					address = `${Line1} ${Line2} ${City} ${PostCode}`;
				}

				var desc = service.ShortDescription || service.LongDescription;
				// var shortDesc = service.ShortDescription;
				// var longDesc = service.LongDescription;
				var state = service.PhysicalAddress.State;

				// if (shortDesc == null) {
				//     var desc = service.LongDescription;
				// } else {
				//     var desc = service.ShortDescription;
				// }

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

				const serviceItem =
					`${htmlImage}                     
                  <div class="product-details">
                      <div class="product-details-header">
                          <input type="hidden" class="serviceType" value="accommodation">
                          <input type="hidden" class="ticketDate" value="xxx">
                          <div class="product-title themeColor heading-s">
                            ${service.Name} 
                            </div>` +
					`<div class="product-price">
                            ${htmlFromPrice}
                            </div>
                      </div>
                      <div class="product-description-block">
                          <div class="product-desc product-address">${
														address || "No Address"
													}</div>
                          <div class="product-desc product-desc-short" style="display: none">                            
                            ${desc}                            
                           </div>
                      </div>
                  <div class="product-overlay">
                      <div class="tool-tip">
                      </div>
                      <div class="wrapper">
                          <div class="button-block">
                              <div class="button-container">
                                  <div class="add-btn btn btn-secondary ${addButtonText} btn-${
						service.Id
					}" title="
                                        ${service.Name} 
                                    "></div>
                                    <div class="preview-btn btn btn-secondary LT-15" title="
                                        ${service.Name} 
                                    ">View</div>                            
                               </div>
                          </div>
                      </div>
            </div>
            </div>`;

				this.pnlInnerContainer.DOMElement.innerHTML = serviceItem;
			},
			service: V3.Property(null).OnChange(function (value) {
				this.Controls.clear();
				if (value) {
					this._populate(value);
				}
			}),
		});

		var ServiceListingAccommodations = function ServiceListingAccommodations(
			container,
			settings
		) {
			this.base(document.getElementById(settings.AccommodationContainer));
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
				let numberOfService = 0;

				V3.forEach(entities, this, function (service) {
					//exclude tickets
					if (
						this._settings.TicketProviders.contains(
							service.ParentId.toUpperCase()
						)
					) {
						return;
					}

					numberOfService += 1;

					var doSwap = false;

					var ds = new DisplayServiceAccommodations({
						NoImageUrl: this._settings.NoImageUrl,
						Service: service,
					});

					if (data.Paging.NumberOfResults <= 3) {
						ds.Data.score = 5; /*largest display */
					} else {
						ds.Data.score = this._getScore(service);
					}

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

				//show empty notice
				const container = $("#" + this._settings.AccommodationContainer);
				if (container.find("ul > li").length == 0) {
					container.find(".no-results-notice").css("visibility", "visible");
				}

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
					//window.scrollTo(0, 0);
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
					$(".more-accommodations").show().next("img").hide();
				} else {
					$(".more-accommodations").hide().next("img").hide();
				}
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
						//Campaign: this._campaign,
						Paging: {
							PageSize: this._settings.PageSize,
							PageNumber: this._currentPage + 1,
							Token: this._currentPagingToken,
						},
						Output: this._createOutputRequest(),
					}
				);
				this.cssClassAdd("is-adding-page");
				$(".more-accommodations").hide().next("img").show();
			},
			_createOutputRequest: function () {
				const commonContent = {
					CommonContent: {
						All: true,
						Name: true,
					},
				};

				const availability = {
					Availability: {
						StartDate: this._settings.PriceWindow.Date,
						NumberOfDays: Math.round(this._settings.PriceWindow.Size),
						FlagCampaigns: true,
						MergeMethod: AvailabilityMergeMethod.LowestRateForCampaign,
						LowestRateOnly: true,
					},
				};

				return { ...commonContent, ...availability };
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
					MustBeInAdCampaign: true,
					MustBeInDealCampaign: false,
					Type: 3,
				};

				var availability = null;
				var output = this._createOutputRequest();

				//if (V3.Is.Specified(criteria.IndustryCategoryGroup)) {
				filter.TagCriteria = {
					IndustryCategoryGroups: [0],
				};
				//}
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
								Language: "en-US",
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
				this.performSearch();
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

		//activties

		var DisplayServiceActivities = function DisplayService(settings) {
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
				const addButtonText = isExistInCart(service.Id) ? "LT-19" : "LT-14";
				var htmlFromPrice = "<span class='currency LT-17'>From </span>";
				if (service.Availability.Calendar.LowestRate) {
					htmlFromPrice =
						'<span class="currency LT-17">From </span><span class="amount"> £' +
						Math.round(
							service.Availability.Calendar.LowestRate
						).toLocaleString() +
						"</span>";
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

				let address = "";
				if (service.PhysicalAddress) {
					let Line1 = service.PhysicalAddress.Line1;
					Line1 += Line1 ? ", " : "";

					let Line2 = service.PhysicalAddress.Line2;
					Line2 += Line2 ? ", " : "";

					let City = service.PhysicalAddress.City;
					City += City ? ", " : "";

					let PostCode = service.PhysicalAddress.PostCode;
					// PostCode += PostCode ? ', ' : '';

					this.Attributes.add("data-add1", `${Line1} ${Line2}`);
					this.Attributes.add("data-add2", `${City} ${PostCode}`);

					address = `${Line1} ${Line2} ${City} ${PostCode}`;
				}

				// var desc = service.ShortDescription || service.LongDescription;
				var shortDesc = service.ShortDescription || service.LongDescription;
				var longDesc = service.LongDescription;
				var state = service.PhysicalAddress.State;

				// if (shortDesc == null) {
				//     var desc = service.LongDescription;
				// } else {
				//     var desc = service.ShortDescription;
				// }

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

				const serviceItem =
					`${htmlImage}                     
                  <div class="product-details">
                      <div class="product-details-header">
                          <input type="hidden" class="serviceType" value="activity">
                          <input type="hidden" class="ticketDate" value="xxx">
                          <div class="product-title themeColor heading-s">
                            ${service.Name} 
                            </div>` +
					`<div class="product-price">
                            ${htmlFromPrice}
                            </div>
                      </div>
                      <div class="product-description-block">
                          <div class="product-desc product-address" style="display: none">
                            ${address || "No Address"}
                          </div>
                          <div class="product-desc product-desc-short-2">                            
                            ${shortDesc}                            
                           </div>                          
                          <div class="product-desc product-desc-short" style="display: none">                            
                            ${longDesc}                            
                           </div>
                      </div>
                  <div class="product-overlay">
                      <div class="tool-tip">
                      </div>
                      <div class="wrapper">
                          <div class="button-block">
                              <div class="button-container">
                                  <div class="add-btn btn btn-secondary ${addButtonText} btn-${
						service.Id
					}" title="
                                        ${service.Name} 
                                    "></div>
                                    <div class="preview-btn btn btn-secondary LT-15" title="
                                        ${service.Name} 
                                    ">View</div>                            
                               </div>
                          </div>
                      </div>
            </div>
            </div>`;

				this.pnlInnerContainer.DOMElement.innerHTML = serviceItem;
			},
			service: V3.Property(null).OnChange(function (value) {
				this.Controls.clear();
				if (value) {
					this._populate(value);
				}
			}),
		});

		var ServiceListingActivities = function ServiceListingActivities(
			container,
			settings
		) {
			this.base(document.getElementById(settings.ActivitiesContainer));
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
				let numberOfService = 0;

				V3.forEach(entities, this, function (service) {
					//exclude tickets
					if (
						this._settings.TicketProviders.contains(
							service.ParentId.toUpperCase()
						)
					) {
						return;
					}

					numberOfService += 1;

					var doSwap = false;

					var ds = new DisplayServiceActivities({
						NoImageUrl: this._settings.NoImageUrl,
						Service: service,
					});

					if (data.Paging.NumberOfResults <= 3) {
						ds.Data.score = 5; /*largest display */
					} else {
						ds.Data.score = this._getScore(service);
					}

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

				//show empty notice
				const container = $("#" + this._settings.ActivitiesContainer);
				if (container.find("ul > li").length == 0) {
					container.find(".no-results-notice").css("visibility", "visible");
				}

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
					$(".more-activities").show().next("img").hide();
				} else {
					$(".more-activities").hide().next("img").hide();
				}
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
						//Campaign: this._campaign,
						Paging: {
							PageSize: this._settings.PageSize,
							PageNumber: this._currentPage + 1,
							Token: this._currentPagingToken,
						},
						Output: this._createOutputRequest(),
					}
				);
				this.cssClassAdd("is-adding-page");
				$(".more-activities").hide().next("img").show();
			},
			_createOutputRequest: function () {
				const commonContent = {
					CommonContent: {
						All: true,
						Name: true,
					},
				};

				const availability = {
					Availability: {
						StartDate: this._settings.PriceWindow.Date,
						NumberOfDays: Math.round(this._settings.PriceWindow.Size),
						FlagCampaigns: true,
						MergeMethod: AvailabilityMergeMethod.LowestRateForCampaign,
						LowestRateOnly: true,
					},
				};

				return { ...commonContent, ...availability };
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
					MustBeInAdCampaign: includeCampaignOnlyServices,
					MustBeInDealCampaign: false,
					Type: 3,
				};

				var availability = null;
				var output = this._createOutputRequest();

				//if (V3.Is.Specified(criteria.IndustryCategoryGroup)) {
				filter.TagCriteria = {
					IndustryCategoryGroups: [1],
				};
				//}
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
								Language: "en-US",
								Paging: {
									PageNumber: 1,
									PageSize: this._settings.PageSize,
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
				this.performSearch();
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

			if (settings.Shortname && settings.Campaign.AdCampaignCode) {
				this._settings.CampaignService.GetAdCampaign(
					this._GetCampaign_OnSuccess.bind(this),
					this._GetCampaign_OnFailure.bind(this),
					{
						Shortname: settings.Shortname,
						Code: settings.Campaign.AdCampaignCode,
					}
				);
			}

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
				V3.Utils.OnLoad.addEventHandler(
					function () {
						//If Campaign then use Campaign booking commencement date as the availabilty start date
						//else use today.
						if (rs) {
							this._campaignSlogan = rs.Slogan;
							this._pnlCampaignBanner.campaign(rs);
							if (rs.AssociatedDeal) {
								//DEAL CAMPAIGN LINKED TO AD
								//this._pnlCampaignBanner.campaign(rs.AssociatedDeal);
								var deal = rs.AssociatedDeal;
								deal.AllowedBookingCommencementPeriod.From = new V3Date(
									deal.AllowedBookingCommencementPeriod.From
								);
								deal.AllowedBookingCommencementPeriod.To = new V3Date(
									deal.AllowedBookingCommencementPeriod.To
								);
								if (!deal.IsActive) {
									//Expired
									this._pnlServiceListing.showError(
										"This campaign is not currently active."
									);
									this._settings.Campaign = {}; //clear campaign details

									this._pnlCampaignBanner.visible(false);
									var nav = document.getElementById("navigation");
									if (nav) {
										nav.style.display = "none";
									}
									return;
								} else {
									var date = V3Date.max(
										new Date(),
										deal.AllowedBookingCommencementPeriod.From.asV3Date()
									).asV3Date();
									var size = Math.max(
										1,
										deal.AllowedBookingCommencementPeriod.To.asV3Date().getDaysBetween(
											date
										)
									);
									this._settings.PriceWindow = {
										Date: date,
										Size: size,
									};
								}
							}
						}
						if (!this._settings.PriceWindow) {
							this._settings.PriceWindow = {
								Date: new V3Date(),
								Size: 14,
							};
						}
						this._pnlServiceListingTickets.performSearch();
						this._pnlServiceListingAccommodations.performSearch();
						this._pnlServiceListingActivities.performSearch();
					}.bind(this)
				);
			},
			_GetCampaign_OnFailure: function (error) {
				V3.Utils.OnLoad.addEventHandler(
					function () {
						this._pnlServiceListing.showError(
							"Uh oh, there was an unexpected error, please try again later. " +
								error.message
						);
						this._pnlServiceListing.Insert(
							document.createComment(JSON.stringify(error))
						);
					}.bind(this)
				);
			},

			_pnlServiceListing_OnServiceAdded: function (sender, ds) {
				var service = ds.service();
				if (
					this._campaignSlogan &&
					(service.IsInAdCampaign || service.IsInDealCampaign)
				) {
					var div = document.createElement("div");
					div.className = "special-label";
					// div.innerHTML = htmlEncode(this._campaignSlogan);
					// ds.pnlInnerContainer.DOMElement.insertBefore(div, ds.pnlInnerContainer.DOMElement.firstChild);
				}

				// Clicking the "Preview" buttons
				setTimeout(function () {
					var $me = $(ds.DOMElement);

					// Set the height of the product images
					// setItemHeight($me.find(".product-image"), productImageRatio);

					$me.find(".preview-btn").on("click", showPreviewModal);

					// Clicking the "Add to Itinerary" buttons on product list
					$me.find(".add-btn").on("click", addToCart);
				}, 50);
			},

			_btnPerformNewSearch_Click: function () {
				var criteria = {};
				// criteria.IndustryCategoryGroup = document.getElementById('productType').value;
				criteria.LocationId =
					document.getElementById("searchDestination").value;
				criteria.Name = document.getElementById("Keyword").value;
				var pRange = document.getElementById("priceRange").value.split("-");
				if (pRange.length == 2) {
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

				if (criteria.IndustryCategoryGroup == "0") {
					criteria.IndustryCategoryGroup =
						V3.CABS.IndustryCategoryGroupEnum.Accommodation;
				} else if (criteria.IndustryCategoryGroup == "1") {
					criteria.IndustryCategoryGroup =
						V3.CABS.IndustryCategoryGroupEnum.Activity;
				} else {
					criteria.IndustryCategoryGroup = null;
				}

				if (
					criteria.IndustryCategoryGroup ||
					criteria.LocationId ||
					criteria.Name ||
					criteria.Price
				) {
					//Show all matching results for given criteria
					this._pnlServiceListing.filterByCampaignRelevant(false);
					this._pnlServiceListing.filterCriteria(criteria);
				} else {
					//Only show campaign results (no custom criteria has been applied)
					this._pnlServiceListing.filterByCampaignRelevant(true);
					this._pnlServiceListing.filterCriteria(null);
				}
				this._pnlServiceListing.performSearch();

				return false; //don't allow the buttons default behaviour
			},

			_btnBookNow_Click: function () {
				var serviceIds = [];

				var journeys = Cookies.getJSON()["journeyCart_MG"] || []; // in case the cookie info doesn't exist

				const serviceTypes = journeys.map((journey) => journey.serviceType);

				let valid =
					serviceTypes.includes("accommodation") ||
					serviceTypes.includes("activity");

				//if not valid, abort & show warning warning message
				if (!valid) {
					showWarning();
					return;
				}

				//if valid then carry on
				serviceIds = journeys.map((journey) => journey.id);
				//pluck ticket dates
				const ticketDates = journeys.map((journey) => journey.ticketDate);
				//get the earliest date
				const exl_dte = helper.getTheEarliestDate(ticketDates);

				//Lets go to CABS
				this._settings.InjectionService.searchInjection({
					//Options
					exl_acp: this._settings.Campaign.AdCampaignCode,
					exl_bs: this._settings.BrandingStyle,
					exl_lng: "en-US",
					exl_dte: exl_dte,
					exl_sdte: 0,
					exl_ad: this._settings.NumberOfAdults,
					// exl_mod: this._settings.Mode,

					Favourites: serviceIds,
					ShowNonAdCampaignServices:
						(this._settings.Shortname + "").toLowerCase() === "tourism_nt_web",
					ShowNonDealCampaignServices:
						(this._settings.Shortname + "").toLowerCase() === "tourism_nt_web",
				});

				return false;
			},

			_init: function () {
				var resultsContainer = "test";
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

				this._pnlServiceListingTickets = new ServiceListingTickets(
					resultsContainer,
					this._settings
				).Set({
					OnServiceAdded: this._pnlServiceListing_OnServiceAdded.bind(this),
				});

				this._pnlServiceListingAccommodations =
					new ServiceListingAccommodations(
						resultsContainer,
						this._settings
					).Set({
						OnServiceAdded: this._pnlServiceListing_OnServiceAdded.bind(this),
					});

				this._pnlServiceListingActivities = new ServiceListingActivities(
					resultsContainer,
					this._settings
				).Set({
					OnServiceAdded: this._pnlServiceListing_OnServiceAdded.bind(this),
				});

				if (!settings.Shortname) {
					this._pnlCampaignBanner.visible(false);
					this._pnlServiceListing.showError(
						"Error: Insufficient information provided"
					);
				}
				if (!settings.Campaign.AdCampaignCode) {
					if (settings.Campaign.DealCampaignCode) {
						this._pnlServiceListing.showError(
							"Error: Deal Campaigns not supported on this page."
						);
					} else {
						this._GetCampaign_OnSuccess();
					}
				}

				var loadMoreTickets = function () {
					me._pnlServiceListingTickets.loadNextPage();
					return false; //don't allow the buttons default behaviour
				};

				var loadMoreAccommodations = function () {
					me._pnlServiceListingAccommodations.loadNextPage();
					return false; //don't allow the buttons default behaviour
				};

				var loadMoreActivities = function () {
					me._pnlServiceListingActivities.loadNextPage();
					return false; //don't allow the buttons default behaviour
				};

				$(".more-tickets").on("click", loadMoreTickets);
				$(".more-accommodations").on("click", loadMoreAccommodations);
				$(".more-activities").on("click", loadMoreActivities);

				$(".continue-btn").on("click", this._btnBookNow_Click.bind(this));
				$(".search-btn").on(
					"click",
					this._btnPerformNewSearch_Click.bind(this)
				);

				// productType = document.getElementById('productType').value;
				// this._pnlServiceListing.filterCriteria({IndustryCategoryGroup:productType});
			},
		});
		V3.TNTController = TNTController;
	}
);
