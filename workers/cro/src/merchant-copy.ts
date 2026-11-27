import type { Finding } from '../../../lib/cro/model';

// Describe only the observation the corresponding rule can establish.
const copy: Record<string, [string,string,string,string]> = {
  'home-title': ['Name the homepage','The homepage has no title for its browser tab.','A title helps people return to the right store.','Use your store name and what you sell.'],
  'home-heading': ['Introduce the store','We could not find a main heading on the homepage.','A heading helps people understand where they have landed.','Introduce your main product range in a heading.'],
  'home-description': ['Write a summary for shared links','We found no short page summary for the homepage.','A summary can help someone decide whether to open a shared link.','Write one sentence about what you sell and who it is for.'],
  'collection-title': ['Name the collection','The collection page has no title for its browser tab.','A title helps shoppers tell collections apart.','Name the collection in its page title.'],
  'collection-heading': ['Introduce the collection','We could not find a main heading naming the collection.','Shoppers need to know which range they opened.','Give the collection a clear heading.'],
  'product-image-alt': ['Describe the main product photo','The main product photo has no written description for someone who cannot see it.','Shoppers who listen to the page can miss important product details.','Describe what the photo shows about this item.'],
  'product-action': ['Name the shopping button','We found an add-to-cart button without a name we could read.','A shopper listening to the page needs to know what pressing it does.','Give the button a clear name such as Add to cart.'],
  'nav-landmark': ['Make the shop menu easier to find','We found shopping links but no main menu identified for shoppers who listen to the page.','A named menu gives shoppers a shortcut to browsing.','Ask your site editor to identify the main menu.'],
  'nav-main': ['Help shoppers skip to the main content','The homepage has a heading but no main reading area identified for shoppers who listen to the page.','People can spend extra time passing repeated menus.','Ask your site editor to identify the main reading area.'],
  'trust-https': ['Use a secure store address','The homepage opened over an unsecured connection.','A secure address helps protect people visiting the store.','Ask your site provider to use the secure version of the address.'],
  'price-currency': ['Check the item currency','The shared item information has a missing or unrecognized currency.','A price can mean different amounts in different currencies.','Choose the correct currency in the item listing.'],
  'price-value': ['Correct the listed amount','The price shared for this item is negative or unreadable.','A wrong price can give people a different expectation before they visit.','Check the amount saved for the item.'],
  'price-discount': ['Check the comparison price','The comparison price provided for this item is lower than its current price.','This can make a price comparison confusing.','Correct the two prices or remove the comparison.'],
  'shipping-amount': ['Check the delivery charge','The delivery charge shared for the item is negative or unreadable.','People need a reliable cost before deciding to buy.','Correct the charge in the delivery settings.'],
  'shipping-range': ['Correct the delivery estimate','The delivery estimate includes a negative time or an end earlier than its start.','Conflicting dates make it hard to plan a purchase.','Enter the earliest and latest delivery times in order.'],
  'returns-window': ['Correct the return period','The return policy shared for this item promises a time limit but gives no valid number of days.','Shoppers need to know how long they have.','Enter the actual number of days allowed.'],
  'returns-category': ['Clarify whether returns are accepted','The return information shared for the item does not give a recognized return option.','People need to know whether they can return an item.','Select the option that matches your policy.'],
  'cart-label': ['Name the cart link','We found a cart link without a name we could read.','A shopper listening to the page may not know where it leads.','Give the link the name Cart or Shopping bag.'],
  'cart-submit': ['Secure the add-to-cart step','The item page points to an unsecured address when adding to the cart.','This can put shopping information at risk.','Ask your site provider to secure this step.'],
  'checkout-entry': ['Name the checkout link','We found a checkout link without a name we could read.','A shopper listening to the page needs to recognize the next step.','Give the link the name Checkout.'],
  'checkout-https': ['Secure the checkout link','A checkout link points to an unsecured address.','People should have a protected connection when they move to payment.','Use the secure checkout address supplied by your store provider.'],
  'mobile-viewport': ['Check the page on a phone','The homepage does not ask phones to fit the page to their screen width.','Shoppers may have to enlarge the page to read it.','Check the page on a phone and ask your site editor to fit the layout to the screen.'],
  'mobile-zoom': ['Let shoppers enlarge the page','The homepage asks phones to limit how much shoppers can zoom.','Some shoppers need larger text or a closer look.','Allow shoppers to zoom freely.'],
  'mobile-lang': ['Set the store language','The homepage does not say which language it uses.','Devices that read the page aloud may pronounce words incorrectly.','Choose the correct language for the homepage.'],
  'season-offer-validity': ['Correct the offer end date','The item information gives an unreadable offer end date.','An unclear deadline can confuse shoppers who see the offer elsewhere.','Choose the correct end date or remove it if there is no deadline.'],
  'season-window': ['Put the offer dates in order','The offer ends before its listed start date.','Shoppers need to know when the offer is available.','Correct the start and end dates.'],
  'season-time': ['Correct the campaign date','We found an unreadable date attached to a campaign.','A clear date helps shoppers plan.','Check the campaign date in your store editor.'],
  'season-promo-target': ['Secure the offer link','The offer links to an unsecured store address.','The connection can lose its protection when a shopper opens the offer.','Link to the secure version of the page.'],
};

export function merchantFinding(finding: Finding): Finding {
  const words = copy[finding.id];
  if (!words) return finding;
  const [title,evidence,why,change] = words;
  return { ...finding,title,evidence,why,change };
}
