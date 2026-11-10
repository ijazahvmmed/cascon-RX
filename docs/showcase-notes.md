# Navigation and homepage showcase

The existing routes and navigation order are preserved. Services now discloses three groups of existing service pages and anchors, using the shared icon library. On mobile these links live inside the existing menu. Escape, focus leaving the group and pointer leaving close the desktop disclosure.

Projects in focus uses eight existing portfolio entries. Native horizontal scrolling supports touch, trackpad and keyboard; the previous and next buttons wrap through all eight projects. No project results or new client relationships are asserted.

The AI video strip now uses all 27 original videos and JPEG posters from https://cascon-sepia.vercel.app/. Files are copied without re-encoding; their original URLs, byte lengths and SHA-256 hashes are recorded in video-showcase-assets.json (54 assets, 16.69 MB total). The reel uses the reference’s shared cylindrical perspective, continuously recycling cards beyond the viewport at one card per 4.5 seconds. Only onscreen videos load and play, with staggered decoder startup. Movement and playback stop offscreen or when the tab is hidden. Reduced motion or data saving switches to a static, horizontally scrollable list with native video controls. Keyboard focus stops movement; arrow keys browse and Space toggles the reel. The previous seven generated reel excerpts have been replaced.

The tools strip lists platforms used in the workflow. It does not assert certification or partnership. Supply a verified partner listing before adding any Shopify Partner or other partnership badge. The repeated marquee group is hidden from assistive technology and excluded from keyboard focus. Hover/focus pauses the strip; keyboard focus and reduced-motion preferences provide a static, manually scrollable list.

Hanbee retains its original colour and outlines. Clipston retains the original shield and white lettering on a dark backing, using the logo published at https://clipstonelevator.com/images/logo.png. Other client logo treatments are unchanged.

Services navigation motion uses GSAP for the desktop dropdown, service-row hover/focus, mobile overlay and mobile accordion. Desktop/overlay timelines reverse from the current playhead; the accordion retains its current height on interrupted taps. Closing panels remain mounted until their exit finishes and become inert immediately. Reduced-motion preferences skip the transitions. See navigation-motion-validation.json for browser checks.
