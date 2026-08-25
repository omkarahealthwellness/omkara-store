SCAN
  ↓
LAND ON MENU
  ↓
BROWSE
  ↓
CHOOSE PRODUCT
  ↓
CUSTOMIZE
  ↓
ADD TO CART
  ↓
REVIEW
  ↓
Choose payment method
↓
enter address  
↓
ORDER

The customer should experience the simplicity of major food-delivery applications

Primary business goal

The website's primary job is:

> **Help a customer discover OMKARA food and send a structured order through WhatsApp with minimum friction.**

Secondary goals:

* communicate the OMKARA brand
* make the business look premium
* support future growth
* allow the owner to manage almost everything
* make menu changes easy
* support QR-based ordering
* eventually support automated WhatsApp ordering workflows

Current product reality

Currently, only a small number of products are actually available.

The system must support any number of future products.

The admin must be able to add:

Category
   ↓
Products(product tags)
   ↓
Variants / serving sizes
   ↓
Add-ons
   ↓
Availability state

Products must not be hardcoded into the visual interface.

Product availability states

Every product must have an admin-editable state.

At minimum:

### Available

Normal product display.

Customer can:

* open product
* choose size
* choose add-ons
* change quantity
* write optional instructions
* add to cart

The system should be capable of supporting:

* Available
* Freshly Prepared
* Limited
* Low Stock
* Out of Stock
* Coming Soon
* Temporarily Unavailable
* Seasonal

The administrator should be able to control which states are displayed publicly.
The administrator should ideally control:

* image
* mobile image
* desktop image if separately needed
* title
* subtitle
* tags
* CTA
* visibility
* image editablity

Menu is the heart of OMKARA-

The menu must be highly dynamic.

Admin controls:

* categories
* category order
* category visibility
* category colors
* category imagery
* category description
* category status
* products
* product order
* product availability
Category navigation

Category navigation should be fast
The currently visible category should automatically become active as the customer scrolls.

The customer can tap a category to move directly to it.

No page reload.

The active state should be obvious but elegant.
Product grid requirements

This is a very important requirement.

## Desktop / large screens

Products must use a responsive scalable grid.

The number of columns should automatically increase or decrease according to available screen width.

Phone

The product layout must be:
 2 rows and 3-4 columns

Product detail interaction

Clicking/tapping a product should not navigate the customer away from the menu.

## Mobile

Open a product bottom sheet or full-screen sheet.

## Desktop

Open a modal or elegant side panel.

The interaction should contain:

* close button
* large image
* product name
* full description
* ingredients
* serving sizes
* pricing
* quantity
* add-ons
* customer note
* calculated total
* add-to-cart button

The customer should be able to customize the product without losing menu context.

---

# 15. Product configuration

Each product must be capable of supporting configurable options.

## Serving sizes

Examples:

* Small
* Medium
* Large

But the admin must be able to create arbitrary options such as:

* Regular
* Family
* 250 ml
* 500 ml
* 1 Litre
* Single
* Double

Each variant should support:

* label
* price
* optional description
* default selection
* availability

---

## Add-ons

Each product can have zero or more add-ons.

Examples:

* extra fruit
* extra sprouts
* seeds
* protein
* toppings

Each add-on should support:

* name
* price
* optional description
* optional availability
* selection type

Selection types should be capable of:

* single select
* multiple select
* required
* optional
* quantity-based where relevant
## Customer note

Optional.

Example:

> “Please make it less spicy.”

The note must be included in the cart and WhatsApp order.

The admin must be able to:

* enable/disable notes globally
* enable/disable notes per product
* customize note placeholder text
* configure a reasonable maximum length

Quantity controls

Customers must be able to:

```text
−   1   +
```

Quantity changes should immediately update:

* item total
* cart total

No unnecessary page reload.

---

# 17. Cart

The cart is persistent.

The customer should clearly know when products have been added.

Example:

```text
🛒 2 ITEMS · ₹138
```

The cart should remain easily accessible.

When the cart contains items, a prominent action should appear.

The mobile experience should not require hunting for the cart.

---

# 18. Fixed bottom navigation

The customer storefront should have a constant bottom navigation.

Minimum:

```text
HOME | MENU | CART
```

The visual style should be premium and clean.

Cart should show a badge with item count.

When the cart contains items, the interface should prominently communicate:

```text
VIEW CART · ₹XXX
```

The bottom navigation must not cover important content.

The design should respect mobile safe areas.

---

# 19. Cart contents

The cart must show:

* product image or thumbnail
* product name
* selected serving size
* quantity
* selected add-ons
* customer note
* price
* edit
* remove

Customer should be able to edit an item without rebuilding the order from scratch.

The cart should show:

* item total
* subtotal
* optional additional charges if introduced later
* total

Do not introduce taxes or fees unless the business explicitly configures them.

---

# 20. WhatsApp ordering

This is one of the central requirements.

The checkout action must create a structured WhatsApp message.

Example:

```text
Hi OMKARA! 🌿

I'd like to place an order:

1. Mixed Sprouts
   Medium × 2
   ₹138

   Add-ons:
   Extra Seeds

   Note:
   Less spicy

2. Mixed Fruit Salad
   Large × 1
   ₹99

TOTAL: ₹237

Please confirm availability.
```

The system must automatically include:

* product
* variant/serving size
* quantity
* price
* add-ons
* customer note
* total

The customer should not manually type the order.

 21. WhatsApp configuration

The administrator must be able to edit:
* business WhatsApp number
The current known business phone number is:

> **8560078208**

But it must not be permanently hardcoded.

It should be editable.

Direct WhatsApp behavior

The desired future customer behavior is:

If a person directly messages OMKARA on WhatsApp, they should eventually receive a helpful response directing them toward the website/menu.

Example:

```text
🌿 Namaste! Welcome to OMKARA.

SEHAT BHI. SWAAD BHI.

Browse our latest menu and place your order here:

[WEBSITE LINK]
```

The website remains the main product-selection interface.

WhatsApp should not become the primary manual menu.

---

# 23. Payment preference flow

Future ordering workflow should support:

```text
ORDER RECEIVED
        ↓
ASK PAYMENT METHOD
        ↓
1. Cash on Delivery
2. UPI
```

If UPI:

* send UPI ID and/or QR
* payment should not automatically be trusted merely because the customer says “paid”
* future verification workflow may be added

If COD:

* acknowledge payment method
* confirm total
* provide appropriate preparation/delivery confirmation

This workflow is future functionality and should not break the basic website checkout experience.
 Order status lifecycle

The desired conceptual order states are:

```text
NEW
↓
RECEIVED
↓
AWAITING PAYMENT METHOD
↓
PAYMENT PENDING / COD
↓
CONFIRMED
↓
PREPARING
↓
READY
↓
OUT FOR DELIVERY
↓
DELIVERED
```

Possible additional states:

* Cancelled
* Rejected
* Payment Verification
* Failed
* On Hold

These should eventually be understandable to kitchen staff and customers.

# 25. Kitchen queue concept

The future OMKARA system should support a kitchen-facing queue.

Kitchen staff should see orders in priority order.

Each order should show:

* order number
* order time
* items
* serving sizes
* quantities
* add-ons
* customer instructions
* payment state
* current preparation state

Kitchen staff should be able to update status quickly.

The interface must be extremely simple.
Admin panel philosophy

The administrator should be able to operate OMKARA without editing source code for ordinary business tasks.

The admin experience should feel like a lightweight professional commerce CMS.

The system must be highly editable.

The coding agent should assume:

> If something is likely to change as the business grows, make it configurable.

But avoid turning every microscopic CSS property into an admin setting.
Admin dashboard

The dashboard should provide a clear overview.

Possible widgets:

* total products
* available products
* out-of-stock products
* coming-soon products
* categories
* recent orders
* order status overview
* quick actions

Quick actions:

```text
ADD PRODUCT
ADD CATEGORY
EDIT MENU
CHANGE AVAILABILITY
VIEW ORDERS
```

---

# 30. Product management requirements

Admin must be able to:

### Create

* product

### Edit

* name
* serial order
* category
* image
* description
* ingredients
* price
* serving sizes
* availability
* tags
* add-ons
* customer-note support
* product visibility

### Manage

* reorder products
* duplicate products
* delete products
* hide products
* temporarily disable products
* change status quickly

The best UX for ordering is drag-and-drop if reliable.

Otherwise provide explicit order controls.

---

# 31. Category management requirements

Admin must be able to:

* create category
* edit category
* delete category
* hide/show category
* reorder categories
* change category colors
* change category imagery
* configure description
* configure display status

Media management(github+jsdelivr CDn) (separate from admin and links from cdn will be pasted in admin panel for product)

A product photo uploader is specifically required.

The workflow:

SELECT IMAGE
      ↓
LOCAL PREVIEW
      ↓
CLIENT-SIDE PROCESSING
      ↓
CONVERT / SCALE
      ↓
WEBP OUTPUT
      ↓
UPLOAD
      ↓
ATTACH TO PRODUCT
```

Target product image:

```text
512 × 512
.webp
```

The conversion should preferably happen on the administrator's device before upload.

The original image should not be unnecessarily uploaded if only the optimized version is required.

Admin should ideally be able to:

* preview
* crop
* choose focal area
* replace
* remove
* reuse images
About and company content

Brand information should exist but must not interrupt ordering.

The main ordering experience is food first.

Supporting pages/sections should include:

## About Us

Introduce OMKARA.

## Our Philosophy

Core ideas:

* Fresh
* Simple
* Balanced
* Honest
* Local

## Visit Bikaner

Bikaner as brand origin and cultural home.

## Contact

Editable:

* WhatsApp
* phone
* email
* Instagram
* other social media
* location

## Help & Support

Potential FAQ:

* How to order
* WhatsApp ordering
* serving sizes
* availability
* coming soon
* delivery

## Partner with Us

Potential partner types:

* suppliers
* local businesses
* delivery partners
* events
* corporate
* future expansion
Known contact information

Current information provided:

**Phone / WhatsApp**

> 8560078208

**Email**

> [omkara.health.wellness@gmail.com](mailto:omkara.health.wellness@gmail.com)

**Instagram**

> omkara.health.bkn

**Location**

> Bikaner, Rajasthan

These should be treated as editable content, not permanently hardcoded business logic.
Footer

The footer should communicate the brand without becoming cluttered.

Suggested structure:

```text
OMKARA

SEHAT BHI. SWAAD BHI.

Fresh food & wellness from Bikaner.
```

Then:

```text
COMPANY
About Us
Our Philosophy
Visit Bikaner
Contact Us
```

```text
SUPPORT
Help & Support
WhatsApp Order
Call Us
```


```text
SOCIAL
Instagram
Facebook
YouTube
```

Bottom:

```text
OMKARA · BIKANER, RAJASTHAN

NOURISH • BALANCE • THRIVE
```

---

# 38. Mobile-first requirements

The primary customer device is a phone because customers will often arrive via QR code.

Target experience must be excellent at:

```text
360px
390px
430px
```

Desktop is important, but mobile comes first.

The website should feel natural with:

* thumb-friendly controls
* large enough tap targets
* no tiny text
* no hover-dependent functionality
* no horizontal page overflow
* safe bottom navigation
* fast modal/sheet interactions

---

# 39. Desktop behavior

Desktop should not simply be a stretched mobile website.

It should take advantage of:

* responsive product grids
* scalable columns
* two-row category preview
* modals
* wider content composition
* editorial whitespace

The design must remain visually strong at:

* laptops
* large monitors
* ultrawide screens

Design direction

The intended visual language is:

```text
Premium Minimalism
+
Controlled Indian Maximalism
+
Editorial Food Design
+
Bikaneri Warmth
+
Modern Groove
```

Use:

* strong typography
* sophisticated whitespace
* editorial composition
* asymmetry where useful
* organic shapes
* subtle ornamentation
* tactile textures
* restrained gold
* modern Indian details

Avoid:

* generic rounded-card SaaS design
* glassmorphism
* random gradients everywhere
* visual clutter
* excessive animation
Decorative glyph system

OMKARA should eventually have a decorative food-and-wellness glyph library.

Possible glyphs:

* bowls
* sprouts
* fruits
* vegetables
* smoothies
* juice bottles
* jars
* nuts
* seeds
* oats
* energy bites
* bars
* herbs
* leaves
* drinks

Requirements:

* flat
* minimalist
* monochrome
* premium
* clean
* varied
* non-repetitive

They are a decorative brand element, not the primary navigation.

---

# 45. Accessibility and usability

The website should remain usable even with its premium design.

Requirements:

* sufficient contrast
* readable typography
* clear focus states
* keyboard support where relevant
* reduced-motion support
* proper labels
* clear form errors
* images with appropriate alt text
* touch-friendly controls

The local customer should understand the interface immediately.

Use familiar terms:

* Menu
* Order Now
* Add
* Cart
* Call
* WhatsApp
* Location

Avoid unnecessary corporate terminology.

---

# 46. Hinglish

Strategic Hinglish is desired.

Examples:

```text
Aaj kya khayenge?
```

```text
Cart abhi khaali hai.
```

```text
Kuch fresh aa raha hai.
```

```text
Abhi order karein.
```

The interface should remain understandable even to users who are more comfortable with everyday Hindi/Hinglish than polished English.

---

# 47. QR code requirements

The business card and promotional material will contain a QR code leading directly to OMKARA.

The destination should ideally be stable long-term.

The physical card should remain useful even if the internal website changes.

The QR customer experience is:

```text
SCAN
 ↓
OMKARA MENU
 ↓
BROWSE
 ↓
ORDER
```

No forced account creation.

---

# 48. No customer accounts

The public ordering experience should not require:

* signup
* login
* password
* customer profile

The customer should be able to:

```text
Open
Browse
Customize
Order
```

with minimal friction.

---

# 49. Cart persistence

The cart should ideally survive:

* navigating between sections
* closing a product sheet
* minor refreshes where reasonable

The customer should not accidentally lose their selected food during ordinary browsing.

---

# 50. Product cards and animation

Animations should be subtle.

Desired:

* smooth entrance
* scroll awareness
* elegant sheet/modal transitions
* satisfying add-to-cart feedback

Avoid:

* excessive animation
* slow animations
* animation that blocks interaction
* moving content unpredictably

Product detail interactions should have a clear close button at the top.

---

# 51. Performance expectations

The design should look expensive but load fast.

The site must not sacrifice speed for unnecessary visual effects.

Prioritize:

* optimized images
* lazy loading where appropriate
* responsive media
* minimal unnecessary JavaScript
* fast interaction
* stable layout
* no major layout shifts

The premium feeling should come from:

> composition, typography, photography and interaction quality

not from heavy visual effects.
Social and advertising direction

OMKARA advertising should feel:

* cinematic
* dynamic
* editorial
* youthful
* visually rhythmic

Possible techniques:

* rapid scene changes
* collage transitions
* paper-tear transitions
* graphic transitions
* dynamic typography
* food close-ups
* top shots
* changing hands
* Bikaneri environments

No dialogue or voiceover is required.

The preferred direction is:

> visual storytelling driven by music, rhythm and food imagery.
Business card vision

The OMKARA business card must remain relevant even after the business expands.

It should not be narrowly designed around sprouts.

The card should communicate:

```text
Premium
Minimal
Modern Indian
Slightly groovy
Luxury
```

The QR menu is a major functional component.

---

# 55. SEO and discoverability requirements

The coding agent should not neglect basic discoverability.

Requirements include:

* meaningful page titles
* descriptions
* semantic structure
* crawlable public content
* clean URLs where pages exist
* appropriate structured data
* sitemap capability
* robots configuration
* social sharing metadata

However, SEO must not compromise the QR-first menu experience.
 Things that must remain highly editable

At minimum, admin-editable:

### Brand
Hero

* images
Categories
* creation/editablity and deletion
* name
* order
* colors
* description
* image
* visibility
Products
* creation/editablity and deletion
* name
* order
* image
* description
* ingredients
* tags
* category
* availability

Variants

* size
* price
* availability

### Add-ons

* name
* price
* availability
* required/optional

### Ordering

* WhatsApp number
### Contact

* phone
* email
* social links
* location

### Footer

* content
* links

### Global content

* announcements
* notices

Important editing behavior

Editing must support
* preview
* publish

The owner should be able to make multiple changes without accidentally exposing incomplete work publicly.

Changes should not require redeploying the entire design manually for ordinary content updates.

The customer should never see:

* broken half-edited products
* incomplete descriptions
* empty product states
* accidental draft content
# 58. Empty states

The coding agent must carefully design empty states.

Examples:

## Empty cart

```text
Cart abhi khaali hai.
```

With an easy:

```text
EXPLORE MENU
```
 Error handling

The customer should never see raw technical errors.

Examples:

Instead of:

```text
TypeError: Cannot read properties of undefined
```

Show:

```text
Something went wrong.
Please try again.
```

The admin should have clearer diagnostic information.

---

# 60. Data validation requirements

Admin input should prevent:

* negative prices
* empty product names
* invalid availability combinations
* invalid ordering
* broken image references
* duplicate/conflicting internal identifiers where relevant

Before publishing, the system should validate:

```text
Required content exists
Images exist
Prices are valid
Availability is valid
Categories are valid
Ordering configuration is valid

OMKARA design standard

The goal is not merely:

> “A website that works.”

The goal is:

> **A premium, highly capable digital food storefront that could stand visually beside modern food-commerce platforms while remaining uniquely OMKARA.**

It should feel:

```text
Beautiful like an editorial food brand
Easy like a delivery app
Editable like a CMS
Fast like a modern static storefront
Local enough for Bikaner
Broad enough for India
```

---

# 62. Absolute “do not compromise” requirements

The coding agent must not accidentally remove these:

1. **QR-first experience**
2. **Homepage is effectively the menu**
3. **WhatsApp ordering**
4. **No customer account requirement**
5. **Mobile-first**
6. **Two-column × two-row initial mobile category display**
7. **Desktop responsive/scalable columns with only two initial rows**
8. **Per-category Show More**
9. **Highly editable categories**
10. **Highly editable products**
11. **Serving sizes**
12. **Per-size pricing**
13. **Add-ons**
14. **Customer notes**
15. **Product availability states**
16. **Coming-soon visual treatment**
17. **Out-of-stock treatment**
18. **Persistent cart**
19. **Premium product detail sheets/modals**
20. **Admin-controlled product order**
21. **Admin-controlled category order**
22. **Admin-controlled WhatsApp details**
23. **Client-side product image conversion to optimized 512×512 WebP**
24. **Draft/preview/publish workflow**
25. **Future kitchen queue compatibility**
26. **Future automated WhatsApp order workflow compatibility**
27. **Premium OMKARA visual identity**
28. **No generic restaurant template**
29. **No unnecessary customer login**
30. **Do not sacrifice reliability for architectural complexity**

---

# 63. Final product brief in one paragraph

> **Build OMKARA as a premium, mobile-first, QR-first healthy-food storefront for a Bikaner-born brand. The homepage is the food-discovery experience. Customers should be able to scan a QR code, immediately browse a visually beautiful menu, search food, explore dynamic categories, configure products with serving sizes, add-ons and notes, add items to a persistent cart, and send a fully structured order through WhatsApp without creating an account. The admin must be able to manage almost all business-facing content—including categories, products, images, pricing, variants, availability, visual themes, ordering details and brand content—without editing source code. The design should combine global editorial food branding, subtle Indian/Bikaneri warmth, premium minimalism and controlled visual richness. It must look significantly more polished and capable than a typical local restaurant website while remaining extremely easy for an ordinary customer in Bikaner to understand and use.**

Final instruction for the next coding agent

**Do not start by choosing an architecture.**

First create:

1. a complete requirements checklist
2. information architecture
3. user flows
4. admin flows
5. component inventory
6. editable-content inventory
7. state/edge-case inventory
8. responsive behavior specification
9. acceptance criteria for every major feature

Then implement in stable phases.

The product requirements above are the source of truth. **Technical choices may change; OMKARA's customer experience and business requirements should not be casually lost during those changes.**

Cloudflare Free Account

There are currently three separate websites/projects.

### Project 1 — Public Storefront

Purpose:

```text
Customer-facing OMKARA website
```

Responsibilities:

* public menu
* product browsing
* category browsing
* search
* cart
* WhatsApp checkout
* brand pages
* contact information

---

### Project 2 — Admin Panel

Purpose:

```text
Private OMKARA management dashboard
```

Responsibilities:

* manage categories
* manage products
* edit prices
* edit variants
* edit add-ons
* edit availability
* edit homepage content
* edit navigation
* edit footer
* edit WhatsApp settings
* manage image URLs
* publish/store data

The admin panel must be heavily editable.

The developer/coding agent must not hardcode things that are intended to be managed through the admin panel.

---

### Project 3 — CDN / Media Management Site

Purpose:

```text
Internal image upload and media preparation system
```

This site is connected to its own GitHub repository.

Current workflow:

```text
Admin selects image
      ↓
Image is processed on client/admin machine
      ↓
Image is uploaded into GitHub repository
      ↓
GitHub repository stores image
      ↓
JSDelivr CDN URL is generated
      ↓
Admin copies CDN URL
      ↓
URL is saved in product/category data
      ↓
Storefront displays image
```

The CDN panel should support efficient image preparation.

Important image requirements:

```text
Input image
     ↓
Client-side processing
     ↓
Crop/fit intelligently
     ↓
Convert to WebP
     ↓
Resize to optimized dimensions
     ↓
Upload to GitHub
     ↓
Generate CDN URL
```

For normal product images, support a standard optimized format such as:

```text
512 × 512
WebP
```

Do not unnecessarily send large images to a backend for processing.

Image processing should happen primarily on the admin/client machine.

# 3. DATABASE CONSTRAINT

The project uses:

# Firebase Spark Plan

No paid Firebase plan should be assumed.

No billing-dependent architecture should be required.

No payment method should be required for the intended normal operation.

Firebase should remain compatible with the free Spark plan.

The application must use Firebase efficiently.

Public customer traffic must not unnecessarily generate massive database reads.

Do not design the public storefront so that every customer interaction requires multiple Firestore queries.

The system should minimize unnecessary:

* reads
* writes
* listeners
* real-time subscriptions

The coding agent should treat Firebase free limits as a real constraint.

---

# 4. THREE-SITE CONNECTION REQUIREMENT

The three websites must operate as one coherent OMKARA system.

```text
ADMIN PANEL
      │
      │ manages data
      ▼
FIREBASE
      │
      ├──────────────► STOREFRONT
      │
      └──────────────► configuration/content
      

CDN PANEL
      │
      ▼
GITHUB REPOSITORY
      │
      ▼
JSDELIVR CDN
      │
      ▼
IMAGE URL
      │
      ▼
ADMIN PANEL
      │
      ▼
PRODUCT DATA
      │
      ▼
STOREFRONT
```

The systems should be logically connected but loosely coupled enough that failure in one management tool does not unnecessarily break the public website.

MOBILE-FIRST PRIORITY

The primary traffic source is expected to be:

```text
PHYSICAL QR CODE
        ↓
SMARTPHONE
        ↓
STORE WEBSITE
```

Primary widths:

```text
360px
390px
430px
```

Desktop is important, but mobile is the primary design target.

The mobile interface should feel extremely polished and app-like.

---

# 11. STOREFRONT STRUCTURE

The main storefront should approximately follow:

```text
STICKY HEADER
      ↓
SMALL HERO
      ↓
SEARCH
      ↓
CATEGORY NAVIGATION
      ↓
PRODUCT CATEGORIES
   ↓
CONTACT / FOOTER

PRODUCT TAGS

Admin editable.

Examples:

* freshly prepared
* vegetarian
* non-vegetarian
* bestseller
* spicy
* seasonal
* new

The system must not hardcode only these.

Support future tags.
PRODUCT DETAIL EXPERIENCE

On mobile:

```text
Bottom sheet
```

On desktop:

```text
Modal
```

Product detail must include:

* medium size image
* product name
* description
* serving size
* quantity
* price
* dynamic total
* add-ons
* customer note
* availability state
* tags
* Add to Cart

Closing control must be obvious.

The user should not navigate away from the menu to configure a product.

FIXED BOTTOM NAVIGATION

Mobile requires a permanent bottom navigation capsule.

Core:

```text
Home
Menu
Cart
```

Optional additional entries may be supported if they remain useful.

Use beautiful recognizable icons.

The cart should show:

* item count
* total when appropriate

Avoid clutter.

The bottom navigation must not overlap browser safe areas or product controls.
ADMIN PANEL — PRIMARY REQUIREMENT

The admin panel must be highly capable.

It should feel like a professional commerce CMS.

Do not build a tiny simplistic CRUD dashboard.

It should support professional management of the entire storefront.

---

## Admin Dashboard

Include:

* quick overview
* product count
* category count
* available products
* out-of-stock products
* coming-soon products
* recent changes
* quick actions

---

# 25. ADMIN PRODUCT MANAGEMENT

Support:

```text
Create
Edit
Duplicate
Delete
Archive
Restore
Reorder
```

The admin should be able to edit every meaningful product property.

Product editing should ideally use:

* tabs
* sections
* collapsible panels
* clear grouping

Do not create one giant confusing form.

---

# 26. CATEGORY MANAGEMENT

Support:

```text
Create
Edit
Duplicate
Delete
Archive
Restore
Reorder
```

Category order should support drag-and-drop or another reliable ordering method.

Product ordering inside categories should also be manageable.

---

# 27. SITE-WIDE CONTENT MANAGEMENT

Admin should be able to edit:

## Hero

* image
Navigation

* labels
* links
* visibility

## Footer
* text
* company links
* support links
* social links

## Brand Information

* About Us
* Our Philosophy
* Bikaner content
* Contact details

## Social Links

* Instagram
* Facebook
* YouTube
* future platforms

## Contact

* WhatsApp
* phone
* email
* address

---

# 28. ADMIN IMAGE WORKFLOW

The admin panel must integrate smoothly with the separate CDN panel.

The workflow should be easy:

```text
Open CDN Panel
      ↓
Upload image
      ↓
Process to WebP
      ↓
Upload to GitHub
      ↓
Copy generated JSDelivr URL
      ↓
Paste/select URL in Admin
      ↓
Preview image
      ↓
Save product
```

The admin should be able to paste a URL and immediately preview the image.

Image URL validation should be implemented.

---

# 29. RESPONSIVE DESIGN REQUIREMENTS

Must work properly on:

```text
360px
390px
430px
768px
1024px
1280px
1440px+
```

Do not design only for a large desktop monitor.

No:

* horizontal overflow
* clipped modals
* inaccessible buttons
* fixed desktop widths
* overlapping bottom navigation
* broken mobile sheets

---

# 30. PERFORMANCE REQUIREMENTS

The website should feel extremely fast.

Prioritize:

* minimal JavaScript
* optimized images
* WebP
* lazy loading
* responsive images
* static rendering where possible
* client-side search
* efficient data access
* route-level code splitting
* minimal unnecessary dependencies

Avoid:

* huge UI libraries
* excessive animation libraries
* unnecessary real-time database listeners
* unnecessary backend requests
* repeated Firebase reads
* loading all admin functionality into the public storefront

Public customers should not download:

* Firebase Admin functionality
* admin panel code
* editing tools
* unnecessary management libraries

---

# 31. ANIMATION REQUIREMENTS

Animations should be:

* smooth
* restrained
* fast
* intentional

Examples:

* subtle scroll reveal
* product card entrance
* bottom-sheet transition
* cart feedback
* category activation

Avoid:

* excessive floating elements
* slow cinematic transitions
* heavy parallax
* animation that delays ordering

Respect:

```text
prefers-reduced-motion
```

---

# 32. ACCESSIBILITY

Implement:

* keyboard navigation
* visible focus states
* sufficient contrast
* image alt text
* accessible buttons
* accessible modal dialogs
* correct modal focus management

The premium appearance must not compromise usability.
QR CODE REQUIREMENT

The physical QR code should point to the public storefront URL.

The QR must remain stable.

Do not require customers to:

* create accounts
* install applications
* log in

The experience must be:

```text
SCAN
↓
OPEN WEBSITE
↓
ORDER
```

---

# 35. BUSINESS INFORMATION

## Brand

OMKARA

## Tagline

SEHAT BHI. SWAAD BHI.

## Phone / WhatsApp

8560078208

## Email

[omkara.health.wellness@gmail.com](mailto:omkara.health.wellness@gmail.com)

## Location

Bikaner, Rajasthan

## Instagram

omkara.health.bkn
 SUPPORTING CONTENT PAGES

The storefront should support:

## About Us

Explain OMKARA.

---

## Our Philosophy

Core values:

* Fresh
* Simple
* Balanced
* Honest
* Local

---

## Visit Bikaner

Bikaner as the brand's origin.

This should not turn the website into a tourism website.

---

## Contact Us

Support:

* WhatsApp
* phone
* email
* social links
* location

---

## Help & Support

Support content:

* how to order
* WhatsApp ordering
* serving sizes
* availability
* coming soon products

---

## Partner With Us

Future potential partners:

* suppliers
* local businesses
* delivery partners
* events
* corporate partnerships

---

# 37. DATA EDITABILITY PRINCIPLE

The following rule is critical:

> If something is likely to change as OMKARA grows, it should not be hardcoded unnecessarily.

Examples:

Do not hardcode:

```text
exactly 4 categories
exactly 3 serving sizes
exactly 5 add-ons
one WhatsApp message format
one color scheme
one navigation structure
```

Instead build configurable systems.

However:

> Do not overengineer the project into an enterprise system.

The goal is:

```text
HIGHLY EDITABLE
BUT
SIMPLE TO OPERATE
```

---

# 38. UI QUALITY STANDARD

The site should be visually comparable in polish to a professionally designed modern food startup.

Target qualities:

* excellent spacing
* consistent design tokens
* clean hierarchy
* strong typography
* premium photography presentation
* polished loading states
* empty states
* error states
* success feedback
* responsive layouts

Every interaction must have a designed state.

Include:

```text
loading
empty
error
success
disabled
coming soon
out of stock
```

Do not leave these states as unstyled default browser experiences.

---

# 39. REQUIRED EDGE CASES

The implementation must handle:

## No products

Show a professional empty state.

---

## Category has fewer than 4 products

Do not show unnecessary Show More.

---

## Category has exactly 4 products

Do not show Show More.

---

## Category has more than 4 products on mobile

Show Show More.

---

## Product has one size only

Do not force an unnecessary size-selection UI.

---

## Product has no add-ons

Do not show an empty add-ons section.

---

## Product becomes unavailable

Prevent new cart additions.

Existing cart entries should gracefully warn the user.

---

## Invalid image URL

Show fallback image without breaking the layout.

---

## Firebase temporarily unavailable

Public storefront should fail gracefully.

Admin should show understandable errors.

---

## Cart is empty

Show:

```text
Cart abhi khaali hai.
```

With a clear action to return to the menu.

---

## Very long product names

Do not break cards.

---

## Very long customer notes

Respect maximum limits.

---

# 40. CODE QUALITY REQUIREMENTS

The coding agent should:

* keep components modular
* avoid giant monolithic files
* use reusable UI primitives
* separate business logic from presentation
* centralize validation
* use strong types where applicable
* avoid duplicate logic
* maintain clean naming
* document complex logic
* keep environment configuration separate

Do not create a fragile codebase that works only for the first four products.
DO NOT BREAK EXISTING INFRASTRUCTURE

This is one of the most important instructions.

The coding agent must work within:

```text
CLOUDFLARE FREE(no R2)
+
FIREBASE SPARK
+
GITHUB IMAGE STORAGE
+
JSDELIVR IMAGE CDN
```

Do not suddenly require:

* paid databases
* paid storage
* Vercel paid features
* AWS billing
* payment card
* always-running paid server
* expensive third-party APIs

unless explicitly requested later.

---

# 42. FINAL SUCCESS CRITERIA

The final system should allow the business owner to:

```text
OPEN ADMIN PANEL
        ↓
CREATE CATEGORY
        ↓
CHOOSE CATEGORY COLORS
        ↓
CREATE PRODUCT
        ↓
UPLOAD/PREPARE IMAGE THROUGH CDN PANEL
        ↓
GET JSDELIVR URL
        ↓
ADD PRODUCT INFORMATION
        ↓
ADD SIZES
        ↓
ADD PRICES
        ↓
ADD ADD-ONS
        ↓
SET AVAILABILITY
        ↓
REORDER PRODUCT
        ↓
SAVE
```

Then a customer should:

```text
SCAN QR
       ↓
LAND ON BEAUTIFUL MOBILE WEBSITE
       ↓
SEE OMKARA
       ↓
SEE "AAJ KYA KHAYENGE?"
       ↓
SEARCH OR BROWSE
       ↓
OPEN PRODUCT
       ↓
CHOOSE SIZE
       ↓
CHOOSE ADD-ONS
       ↓
ADD NOTE
       ↓
ADD TO CART
       ↓
EDIT CART
       ↓
ORDER ON WHATSAPP
```

The final experience should be:

> **Extremely simple for the customer, extremely powerful for the business owner, visually premium for the brand, and compatible with the exact free infrastructure constraints already in use.**

---

## FINAL INSTRUCTION TO THE CODING AGENT

**Do not reduce this project into a basic CRUD food menu.**

Treat OMKARA as a small but ambitious commercial food brand.

Build a system that is:

* visually excellent
* professionally structured
* highly editable
* scalable in content and capabilities
* lightweight
* responsive
* accessible
* reliable

But also respect this equally important rule:

> **Do not add complexity merely to look technically sophisticated. Every feature must improve the actual business, customer experience, editability, performance, or reliability.**

The public customer experience must remain simple.

The complexity belongs behind the admin panel—not in the customer's ordering flow.