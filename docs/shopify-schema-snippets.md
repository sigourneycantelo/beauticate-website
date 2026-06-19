# Beauticate Shop — Schema.org snippets for Shopify

Doug's report: beauticate.shop scores 35/100. The single biggest unlock is structured data.
These snippets close most of the gap. Hand them to Damien (or paste in yourself).

---

## 1. Organisation + WebSite schema — paste into `theme.liquid` inside `<head>`

This tells every AI engine (ChatGPT, Perplexity, Gemini, Google AI Overviews) exactly who
Beauticate Shop is, who founded it, and that it's the same entity as beauticate.com.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://beauticate.shop/#organization",
      "name": "Beauticate",
      "url": "https://beauticate.shop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://beauticate.shop/cdn/shop/files/beauticate-logo.png"
      },
      "foundingDate": "2014",
      "description": "Beauticate Shop is the curated beauty and wellness edit from Beauticate — Australia's most trusted independent beauty publisher, founded by Sigourney Cantelo.",
      "founder": {
        "@type": "Person",
        "name": "Sigourney Cantelo",
        "url": "https://www.beauticate.com/about-beauticate",
        "sameAs": [
          "https://www.instagram.com/sigourney.cantelo/",
          "https://www.linkedin.com/in/sigourneycantelo/"
        ]
      },
      "sameAs": [
        "https://www.beauticate.com",
        "https://www.instagram.com/beauticate/",
        "https://www.facebook.com/beauticate",
        "https://www.linkedin.com/company/beauticate.com",
        "https://www.youtube.com/@beauticate",
        "https://www.pinterest.com.au/beauticate/"
      ],
      "email": "hello@beauticate.com",
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://beauticate.shop/#website",
      "url": "https://beauticate.shop",
      "name": "Beauticate Shop",
      "description": "Curated beauty, wellness and lifestyle products — editor-chosen, reader-trusted.",
      "publisher": { "@id": "https://beauticate.shop/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://beauticate.shop/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
```

---

## 2. Product page schema — add to `product.json` or `product.liquid` template

Shopify generates basic Product schema but it's missing the editorial voice. Add this
**after** Shopify's default schema block. Replace `{{ product.xxx }}` with actual Liquid variables.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title | escape }}",
  "description": "{{ product.description | strip_html | escape | truncate: 300 }}",
  "url": "{{ shop.url }}{{ product.url }}",
  "image": "{{ product.featured_image | img_url: '1200x' }}",
  "brand": {
    "@type": "Brand",
    "name": "{{ product.vendor | escape }}"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "AUD",
    "price": "{{ product.price | money_without_currency }}",
    "availability": "{% if product.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}",
    "url": "{{ shop.url }}{{ product.url }}",
    "seller": {
      "@type": "Organization",
      "name": "Beauticate"
    }
  },
  "curator": {
    "@type": "Person",
    "name": "Sigourney Cantelo",
    "url": "https://www.beauticate.com/about-beauticate"
  }
}
</script>
```

---

## 3. Collection/category page FAQ schema — add to `collection.liquid`

Each collection page should have a visible Q&A section AND this schema.
Add a metafield in Shopify admin for each collection with 3–4 Q&A pairs,
or hardcode for the top 5 collections first.

Example for a "Skincare" collection:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Beauticate choose which skincare products to stock?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every product in the Beauticate Shop skincare edit is tested by our editorial team and reviewed by our founder Sigourney Cantelo — a 25-year beauty journalist and former Vogue Australia Beauty & Health Director. We only stock what we would personally use and recommend."
      }
    },
    {
      "@type": "Question",
      "name": "Are the products on Beauticate Shop available in Australia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Beauticate Shop ships within Australia. All products listed are available for purchase and delivery to Australian addresses."
      }
    },
    {
      "@type": "Question",
      "name": "Does Beauticate Shop sell authentic products?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All products sold through Beauticate Shop are sourced directly from authorised distributors and brand partners. We do not sell grey-market or counterfeit products."
      }
    }
  ]
}
</script>
```

---

## 4. Homepage FAQ section — add visibly on the page + schema in `<head>`

Doug: "Add the questions and answers visibly on the page (not hidden in code)."

Suggested visible FAQ content for the .shop homepage:

**Q: What is Beauticate Shop?**
A: Beauticate Shop is the curated beauty and wellness edit from Beauticate — Australia's most trusted independent beauty publisher. Everything we stock is chosen by our editorial team, not by an algorithm. No noise. No fillers. Just the things genuinely worth your time and money.

**Q: Who curates the products?**
A: Our founder Sigourney Cantelo — a 25-year beauty journalist and former Beauty & Health Director at Vogue Australia — curates the edit alongside Beauticate's editorial team and The Beauticate Collective, our panel of beauty, wellness and lifestyle experts.

**Q: Is Beauticate Shop different from beauticate.com?**
A: Yes, and also no. beauticate.com is our editorial home — eleven years of expert-led beauty, wellness and lifestyle content. beauticate.shop is where you buy the products we write about. Same editorial philosophy, different address.

**Q: Do you ship to all of Australia?**
A: Yes — Beauticate Shop ships Australia-wide.

Add the schema version of the above to `<head>` alongside snippet #1.

---

## 5. About page Person schema — add to `/pages/about` in Shopify

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sigourney Cantelo",
  "jobTitle": "Founder & Editor-in-Chief",
  "worksFor": {
    "@type": "Organization",
    "name": "Beauticate",
    "url": "https://beauticate.shop"
  },
  "description": "Sigourney Cantelo is an Australian beauty journalist and publisher with over 25 years of experience, including her tenure as Beauty & Health Director at Vogue Australia.",
  "url": "https://www.beauticate.com/about-beauticate",
  "sameAs": [
    "https://www.instagram.com/sigourney.cantelo/",
    "https://www.linkedin.com/in/sigourneycantelo/",
    "https://www.beauticate.com"
  ],
  "alumniOf": { "@type": "Organization", "name": "Vogue Australia" },
  "knowsAbout": ["Beauty", "Skincare", "Wellness", "Lifestyle", "Cosmetics"]
}
</script>
```

---

## 6. Cross-linking .com ↔ .shop (Doug's "bridge" recommendation)

### In beauticate.com articles — when a product is mentioned:
Link directly to the .shop product page. This seeds a high-authority editorial backlink
and tells AI engines both sites are the same entity.

Example in MDX:
```markdown
The [Jurlique Rosewater Balancing Mist](https://beauticate.shop/products/jurlique-rosewater-balancing-mist)
is the toner we recommend for sensitive skin.
```

### In .shop product pages — add an "As seen in" editorial link:
Each product description should end with a sentence like:
> "Read Sigourney's full review at [Beauticate](https://www.beauticate.com/beauty-style/skin-care/[article-slug])."

### sameAs on both sites (already done on .com):
Both sites now carry `sameAs` pointing at each other in their Organisation schema.
AI engines use this to understand they're the same brand entity.

---

## How to add in Shopify (for Damien)

1. Go to **Online Store → Themes → Edit code**
2. Open `layout/theme.liquid`
3. Paste snippet #1 (Organisation + WebSite) just before `</head>`
4. Save
5. Validate at **validator.schema.org** — paste `https://beauticate.shop` and confirm Organisation appears
6. Add product schema to `templates/product.json` or `sections/main-product.liquid`
7. Add collection FAQ schema to `templates/collection.json` or `sections/main-collection.liquid`

Doug's target: 35/100 → 47/100 in 30 days. With these snippets plus the Wikidata entry
you've already created, I'd expect 50–55/100 on rescan.
