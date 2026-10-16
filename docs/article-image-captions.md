# Article image captions

Captions are small grey capitals directly under the image they describe. No italic
serif, and no single caption paragraph under a pair.

## How

Use `InlineImage` with a `caption` prop (`components/mdx/InlineImage.tsx`). It is
registered in the article MDX components map, so no import is needed.

Full width (landscape, or any image on its own):

```mdx
<InlineImage src="/content/<cat>/<sub>/<slug>/photo.jpg" alt="Descriptive alt text" width="1800" height="1200" caption="Sigourney, Jocelyn, Michelle and Kate" />
```

Two-up (portraits). Each image carries its OWN caption, so the reader can tell
who is who:

```mdx
<div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8" style={{clear:'both'}}>
<InlineImage src="..." alt="..." width="1200" height="1800" caption="Michelle" />
<InlineImage src="..." alt="..." width="1200" height="1800" caption="Shentel playing with her products" />
</div>
```

`width` and `height` are the file's real pixel size (portrait 1200x1800, landscape
1800x1200).

## Style

11px, uppercase, letter-spaced (`tracking-[0.18em]`), grey (`#9a9190`, the same grey as
`Caption`), left aligned to the image, 8px above. Defined once in `InlineImage`.

## Writing them

- Short. No trailing full stop.
- Name people by first name only, and only when Sig (or a source that is not a face)
  has identified them. Never guess. For a group, list left to right.
- Otherwise describe the moment: "Freshly shucked oysters on ice".
- The alt text stays a full description with no guessed names.

The old markdown form (`![alt](src)` followed by an italic paragraph) still renders,
but do not use it for new captions. `Caption` (a paragraph) remains for places that
need a caption without an image component.
