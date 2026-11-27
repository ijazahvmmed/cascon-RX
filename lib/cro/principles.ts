import type { Category, Effort, Principle, Priority } from './model';

type Auto = [id: string, title: string, why: string, change: string, priority: Priority, effort: Effort];
type Expert = [title: string, why: string, change: string, effort: Effort];

const automated: Record<Category, Auto[]> = {
  home: [
    ['home-title','Give the homepage a descriptive title','A title gives visitors context in tabs, history and shared results.','Name the store and its main product range in the page title.','Medium','Small'],
    ['home-heading','Give the homepage a primary heading','A clear heading helps shoppers identify the main page content.','Add a visible primary heading that names what the store sells.','Medium','Small'],
    ['home-catalogue','Expose a route into the catalogue','A direct category or product link gives visitors a way to start browsing.','Link to core ranges from the homepage.','High','Moderate'],
    ['home-description','Summarize the store in its page metadata','A description gives the page a useful fallback summary for sharing and discovery.','Add a plain-language description of the products and audience.','Low','Small'],
  ],
  collections: [
    ['collection-title','Name the collection in its page title','Distinct collection names help users orient themselves across open tabs.','Use the category name in the collection title.','Medium','Small'],
    ['collection-heading','Identify the collection with a heading','A heading confirms the group a shopper opened.','Show the collection name as its primary heading.','Medium','Small'],
    ['collection-products','Link product cards to their product pages','Product links give shoppers a stable destination to inspect an item.','Give each visible product card a direct product link.','High','Moderate'],
    ['collection-sort','Expose a sorting option where useful','Sorting can help narrow a broad catalogue.','Evaluate sorting for larger collections with varied products.','Low','Moderate'],
  ],
  product: [
    ['product-heading','Make the product name a primary heading','The product name anchors the detail page and accessible navigation.','Render the product name as the page’s visible primary heading.','High','Small'],
    ['product-image','Show product imagery','Shoppers need a visual reference for what they are buying.','Provide a product image that clearly shows the item.','High','Moderate'],
    ['product-image-alt','Describe the primary product image','An informative product image needs a text alternative for shoppers who cannot see it.','Describe the product in the main image’s alt text. Give decorative duplicates empty alt text.','Medium','Small'],
    ['product-action','Label the purchase control','A control needs a clear label so shoppers can identify its action.','Use visible text or an accessible label on the add-to-cart control.','High','Small'],
  ],
  navigation: [
    ['nav-landmark','Identify navigation as a landmark','Landmarks let assistive-technology users skip between major areas.','Use a nav element or navigation role for the main menu.','Medium','Small'],
    ['nav-search','Expose the catalogue search entry','Search provides an alternative route for visitors with a product in mind.','Consider a clear search entry for a sizeable catalogue.','Low','Moderate'],
    ['nav-breadcrumb','Show a route back to a broader range','Breadcrumbs can help visitors recover their place after entering on a detail page.','Consider linking from the product page to its parent range.','Low','Moderate'],
    ['nav-main','Identify the main content region','A main landmark separates the shopping content from shared navigation.','Wrap the page’s primary content in a single main landmark.','Medium','Small'],
  ],
  trust: [
    ['trust-contact','Make customer support discoverable','Accessible support details tell shoppers where to ask pre-purchase questions.','Link to a current support or contact page.','Medium','Small'],
    ['trust-about','Make merchant information discoverable','Merchant details help visitors understand who operates the store.','Give shoppers a route to accurate merchant information.','Medium','Small'],
    ['trust-privacy','Expose the privacy notice','Shoppers can use the notice to understand how their information is handled.','Link to the current privacy notice from a consistent location.','Medium','Small'],
    ['trust-https','Serve the shopping entry page over HTTPS','An HTTP page allows the initial page content to be altered in transit.','Configure a valid HTTPS site and redirect HTTP visitors to it.','High','Moderate'],
  ],
  pricing: [
    ['price-present','Make the price available in product HTML','A readable price gives shoppers a starting point for the purchase decision.','Expose the product price near the product name and buy control.','High','Moderate'],
    ['price-currency','Identify the currency of structured offers','Explicit currency reduces ambiguity for shoppers and systems interpreting the offer.','Set a valid ISO 4217 currency on every relevant structured offer.','Medium','Small'],
    ['price-value','Correct malformed structured prices','Consumers of product markup need a numeric price to interpret the offer.','Generate a decimal price value without a symbol or thousands separator.','Medium','Small'],
    ['price-discount','Check explicit comparison prices','Showing a lower comparison price beside a higher current price can confuse shoppers.','Correct the same-variant comparison price or remove the comparison.','Medium','Small'],
  ],
  shipping: [
    ['shipping-link','Make shipping terms discoverable','Shoppers may need delivery destinations and cost terms before buying.','Link to current delivery terms near the buy decision.','Medium','Small'],
    ['shipping-product','Surface shipping details on the product page','An early delivery cue reduces the need to hunt for policy information.','Link from the product page to terms relevant to the item.','Medium','Small'],
    ['shipping-amount','Use a non-negative structured shipping amount','A negative shipping rate is ambiguous in the offer feed.','Correct the shipping rate in the offer markup.','Medium','Small'],
    ['shipping-range','Put delivery time limits in the correct order','A maximum below the minimum cannot describe a valid delivery range.','Publish the correct minimum and maximum for the same delivery stage.','High','Small'],
  ],
  returns: [
    ['returns-link','Make return terms discoverable','Shoppers may need to understand eligibility before committing.','Link to current returns terms in a stable location.','Medium','Small'],
    ['returns-product','Surface the return policy near the decision','A product-level link lets shoppers find applicable terms when evaluating the item.','Link from product details to the relevant returns terms.','Medium','Small'],
    ['returns-window','Provide the structured finite return window','A finite return policy needs a valid number of days to be interpreted.','Set merchantReturnDays to the applicable whole number of days.','Medium','Small'],
    ['returns-category','Identify the structured return policy type','A policy type lets systems distinguish a finite window from other policies.','Declare the return-policy category that reflects the merchant’s actual policy.','Medium','Small'],
  ],
  cart: [
    ['cart-link','Make the cart reachable','A cart entry helps shoppers review selections before checkout.','Include a named cart link or control in shared navigation.','High','Moderate'],
    ['cart-label','Give a cart link a descriptive name','A named link communicates the destination to shoppers using assistive technology.','Label the cart link with visible text or a suitable accessible name.','Medium','Small'],
    ['cart-submit','Keep the product form action on an approved secure destination','An HTTP submission target can expose submitted data in transit.','Replace explicit HTTP cart form actions with a secure target.','High','Moderate'],
    ['cart-quantity','Label the quantity control','A quantity label distinguishes the field from other options.','Provide a visible label or accessible name for the quantity field.','Medium','Small'],
  ],
  checkout: [
    ['checkout-entry','Label a public checkout entry','A correctly named link helps users decide whether to proceed.','Give an existing checkout link a descriptive name.','Medium','Small'],
    ['checkout-https','Keep explicit checkout links secure','An HTTP checkout link sends shoppers to an insecure first step.','Link directly to the supported HTTPS checkout URL.','High','Small'],
    ['checkout-methods','Surface checkout payment information before purchase','Payment information can help shoppers decide whether a supported method fits.','Provide accurate pre-purchase payment information where useful.','Low','Moderate'],
    ['checkout-fast','Distinguish express checkout controls','An express payment affordance can be offered alongside the store’s normal flow.','Use the provider’s identified controls and review the flow with a real browser.','Low','Moderate'],
  ],
  mobile: [
    ['mobile-viewport','Provide a device-width viewport','Without viewport configuration mobile browsers can display a scaled desktop layout.','Set viewport width=device-width and keep user zoom available.','High','Small'],
    ['mobile-zoom','Allow shoppers to zoom','Restricting zoom can make content harder to read on a small screen.','Remove user-scalable=no and restrictive maximum-scale values.','High','Small'],
    ['mobile-lang','Declare the page language','Assistive software uses the language to pronounce text appropriately.','Set the html lang attribute to the page’s language.','Medium','Small'],
    ['mobile-image-size','Reserve space for the primary product image','Image dimensions or an aspect ratio can help the browser reserve layout space.','Set matching dimensions or reserve space through the image container.','Low','Small'],
  ],
  seasonal: [
    ['season-offer-validity','Use a valid date for an advertised price period','An invalid date in offer data makes the stated validity period ambiguous.','Correct the explicit priceValidUntil date or remove it when it does not apply.','Low','Small'],
    ['season-window','Order optional offer dates correctly','An ending date before the starting date creates a contradictory schedule.','Correct the explicit validity interval for the same offer.','Medium','Small'],
    ['season-time','Check machine-readable campaign dates','A readable timestamp helps systems interpret dates already published for a campaign.','Correct the explicit datetime value on the campaign date element.','Low','Small'],
    ['season-promo-target','Use a secure campaign destination','An insecure destination interrupts a secure shopping journey.','Point the campaign link to its HTTPS destination.','Medium','Small'],
  ],
};

const expert: Record<Category, Expert[]> = {
  home: [
    ['Can shoppers tell what the store sells?','Shoppers need to understand the category quickly.','Test whether new visitors can describe what the store sells.','Moderate'],
    ['Does the homepage deliver what the ad promised?','Traffic sources create different expectations.','Compare campaign promises with the landing headline.','Moderate'],
    ['Is it clear where to start shopping?','Competing actions can make the next step unclear.','Review the primary action on representative devices.','Moderate'],
    ['Can returning shoppers get back to what they need?','Repeat buyers often arrive with a task.','Check paths to reordering and recently relevant ranges.','Moderate'],
    ['Do photos show the product in use?','Context can explain size or use.','Compare the hero image with the actual products and use cases.','Moderate'],
    ['Can people shop without announcements getting in the way?','Announcement placement competes with navigation.','Assess whether a banner leaves room for the main message.','Small'],
  ],
  collections: [
    ['Are similar items grouped the way people shop?','Shoppers may think in tasks or occasions.','Test category names and groupings with representative shoppers.','Larger'],
    ['Can shoppers narrow the choice by what matters to them?','Useful attributes differ by category.','Identify the attributes people actually use to narrow choices.','Moderate'],
    ['If nothing matches, is there a helpful next step?','A filter can lead to zero results.','Offer clear ways to remove filters or change the search.','Moderate'],
    ['Can people compare items at a glance?','Consistent fields help distinguish similar items.','Decide which decision attributes belong on every card.','Moderate'],
    ['Can shoppers tell which items are available?','Unavailable items change the available choices.','Check how stock and discontinued products are presented.','Moderate'],
    ['Can they return to the same place in the list?','Returning from a product can break the browsing task.','Test back navigation, pagination and restored filters.','Moderate'],
  ],
  product: [
    ['Does the description answer questions about this kind of item?','Purchase questions differ by product.','Review the detail page against real pre-purchase questions.','Moderate'],
    ['Can shoppers judge its size or fit?','Dimensions or fit can be hard to infer.','Use relevant measurements, fit guidance or context images.','Moderate'],
    ['Can they tell similar options apart?','A variant can change price, image and supply.','Test how selected options change the displayed product state.','Moderate'],
    ['Is it clear which options are sold out?','A missing variant creates uncertainty.','Check sold-out labels and signals in option selection.','Moderate'],
    ['Are customer reviews genuine?','Specific experiences can resolve doubts.','Show independently sourced reviews where available and relevant.','Moderate'],
    ['Are the important details easy to find?','Critical facts can be lost in long copy.','Group specifications, usage and contents under meaningful headings.','Small'],
  ],
  navigation: [
    ['Do shoppers understand the menu names?','Internal names may differ from shopper vocabulary.','Run a short category-finding exercise with shoppers.','Moderate'],
    ['Can they open and close the menu easily?','A static link cannot show menu behavior.','Try opening, closing and traversing menus with touch and keyboard.','Moderate'],
    ['Does searching lead to the right products?','A search input does not establish relevance.','Try common queries, misspellings and zero-result journeys.','Moderate'],
    ['Can people tell where they are in the store?','Categories and filters can change context.','Review current-page states and back paths.','Small'],
    ['Are the usual shopping links in familiar places?','Moving purchase and help routes adds effort.','Compare link placement across templates.','Small'],
    ['Can shoppers switch their country or language easily?','Region changes can alter product choices.','Check language, currency and page continuity.','Larger'],
  ],
  trust: [
    ['Are the contact details up to date?','Incorrect support details frustrate shoppers.','Verify contact links, response expectations and coverage.','Small'],
    ['Can shoppers tell who runs the business?','Specific details help people identify the business.','Review identity and business disclosures for accuracy.','Small'],
    ['Can the store back up its product claims?','Unsupported claims make decisions harder.','Verify product, certification and sustainability claims.','Moderate'],
    ['Is it clear where customer reviews come from?','Rating markup cannot verify its source.','Check review provenance, sample size and disclosure.','Moderate'],
    ['Are awards and certifications accurate?','A badge should represent real eligibility.','Confirm badges and payment marks correspond to current services.','Small'],
    ['Does the store explain how it uses customer details?','Shoppers may need to understand consent choices.','Review notices and consent behavior in the relevant markets.','Larger'],
  ],
  pricing: [
    ['Can shoppers see what they will actually pay?','Extra charges can change the decision.','Compare displayed prices with taxes, fees and final totals.','Moderate'],
    ['Are prices clear in each country where the store sells?','Currency or tax rules may vary by market.','Test market selection and the displayed checkout totals.','Larger'],
    ['Is it clear when choosing an option changes the price?','Variant selection can materially change the price.','Check that the displayed total follows each option combination.','Moderate'],
    ['Are repeat charges explained before purchase?','One-time and recurring prices carry different commitments.','Review subscription frequency, renewal and cancellation terms.','Moderate'],
    ['Do advertised savings use a fair comparison?','Reference prices are easy to misinterpret.','Confirm price comparisons have a valid basis and label.','Moderate'],
    ['Can people compare the price per item or pack?','Comparable units help shoppers evaluate packs.','Show unit equivalents when they make the comparison easier.','Small'],
  ],
  shipping: [
    ['Can buyers tell whether the store ships to them?','Delivery availability depends on location.','Check coverage information and postcode behavior where supported.','Moderate'],
    ['Are arrival estimates realistic?','Lead times vary by item and destination.','Verify delivery ranges against actual fulfilment terms.','Moderate'],
    ['Can shoppers find delivery costs before checkout?','Unexpected fees can change the purchase decision.','Check where a shopper can learn the applicable fee.','Moderate'],
    ['Is the difference between dispatch and arrival clear?','These timeframes represent different stages.','Clarify the timing that applies to each stage.','Small'],
    ['If pickup is offered, are the instructions clear?','Pickup workflows depend on store availability.','Verify location, readiness and collection instructions.','Moderate'],
    ['Are special delivery limits explained for the right items?','Some products have unusual shipping requirements.','Check special-case delivery wording and selection behavior.','Moderate'],
  ],
  returns: [
    ['Can shoppers tell which items they may return?','Eligibility may differ by item.','Show the policy and product-specific exceptions.','Small'],
    ['Is it clear how to start a return?','The process matters as much as the window.','Describe who to contact and the steps to follow.','Small'],
    ['Can buyers find out who pays for return postage?','Charges can affect the purchase decision.','Explain who covers shipping and any applicable fees.','Small'],
    ['Does the store say when to expect a refund?','Shoppers may need to know what happens after arrival.','Give accurate processing time and payment details.','Small'],
    ['Are exchanges explained where available?','Replacement workflows can differ from refunds.','Explain exchange and damaged item procedures.','Moderate'],
    ['Do the product page and return policy agree?','Conflicting terms create uncertainty.','Compare the policy with product and checkout wording.','Moderate'],
  ],
  cart: [
    ['Can shoppers see which item they just added?','A shopper needs feedback after an action.','Test item selection and add confirmation in a browser.','Moderate'],
    ['Can they change their mind or correct a mistake?','Removing an item can be accidental.','Check quantity changes, removal and recovery behavior.','Moderate'],
    ['Are the chosen size and colour easy to recognize?','Variants can look similar in the cart.','Check names, options, imagery and quantities together.','Moderate'],
    ['Are extra fees explained where they appear?','Cart totals may omit destination-dependent costs.','Review the explanations accompanying the estimate.','Moderate'],
    ['What happens if stock changes before payment?','Stock may change after adding an item.','Test how the cart reports unavailable quantities.','Larger'],
    ['Can people continue without accepting extra offers?','Cross-sells can interfere with reviewing an order.','Check whether optional offers obscure the checkout action.','Small'],
  ],
  checkout: [
    ['Can people buy without creating an account?','An account requirement changes the steps needed to buy.','Review guest and returning-customer entry paths.','Moderate'],
    ['If a detail is entered incorrectly, can they fix it easily?','Errors can be hard to recover from on mobile.','Test validation, focus and field-value preservation.','Larger'],
    ['Do the available payment and delivery choices make sense?','Available methods can vary by market and cart.','Verify eligibility in an approved test checkout.','Larger'],
    ['Can someone complete checkout without using a mouse?','Custom and third-party flows need interaction testing.','Test keyboard, screen-reader and mobile behavior.','Larger'],
    ['Does the order total explain every charge?','The final commitment should be clear.','Review taxes, shipping and payment total at confirmation.','Moderate'],
    ['Can customers tell that their order went through?','A click cannot establish that an order completed.','Verify the actual success signal in a sandbox.','Larger'],
  ],
  mobile: [
    ['Does the page fit comfortably on a phone?','Markup cannot prove a page fits on a phone.','Check real viewport layouts and horizontal scrolling.','Moderate'],
    ['Is there room to tap the right button?','Crowded targets can cause accidental taps.','Measure rendered targets in representative device sizes.','Moderate'],
    ['Can shoppers dismiss messages that cover the item?','Fixed elements can cover important controls.','Try scrolling and interacting with consent and shopping controls.','Moderate'],
    ['Can shoppers start using the page promptly?','HTML alone cannot measure loading or responsiveness.','Use field data and lab diagnostics to understand load behavior.','Larger'],
    ['Is the text easy to read against its background?','Visual presentation determines practical legibility.','Measure contrast and reading size on actual screens.','Moderate'],
    ['Can someone who listens to the page use it?','Static attributes cannot verify the full interaction.','Try essential journeys with keyboard and screen reader.','Larger'],
  ],
  seasonal: [
    ['Does the offer match the message that brought shoppers here?','Channel expectations can differ from the landing page.','Review campaign copy against the final destination.','Small'],
    ['Is the advertised item still available?','A campaign may point to sold-out items.','Check availability and suitable alternatives before publication.','Moderate'],
    ['Are any gifts or extra offers clearly optional?','Conditional terms can confuse shoppers.','Review eligibility, dates and exclusions for offers already in use.','Small'],
    ['Can the store handle a busy sales day?','High-demand periods can create unpredictable load.','Review capacity and escalation with the store operator.','Larger'],
    ['Have expired offers been removed?','Expired messages can reach customers through old links.','Choose a useful destination or archive state after a campaign.','Moderate'],
    ['Are holiday delivery promises still achievable?','Peak fulfilment can have different cutoffs.','Verify seasonal dates with the delivery team.','Moderate'],
  ],
};

export const principles: Principle[] = (Object.keys(automated) as Category[]).flatMap(category => [
  ...automated[category].map(([id,title,why,change,priority,effort]) => ({ id, category, title, why, change, priority, effort, mode: 'automated' as const })),
  ...expert[category].map(([title,why,change,effort],index) => ({ id: category + '-expert-' + (index + 1), category, title, why, change, priority: 'Medium' as const, effort, mode: 'expert' as const })),
]);
