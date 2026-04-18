#set page(
  paper: "a4",
  margin: (top: 3cm, bottom: 3cm, left: 2.5cm, right: 2.5cm),
  fill: rgb("#faf8f3"),
)
#set text(
  font: "Georgia",
  size: 11pt,
  fill: rgb("#1a1810"),
)
#set par(justify: true, leading: 0.75em)
#set heading(numbering: none)

// Cover page
#page[
  #v(6cm)
  #align(center)[
    #text(size: 9pt, tracking: 0.3em, fill: rgb("#8a7442"))[LUCK LAB]

    #v(2cm)

    #text(size: 28pt, weight: 400)[The Luck Convergence Index]

    #v(0.5cm)

    #text(size: 14pt, style: "italic", fill: rgb("#6b6560"))[Twelve Wisdom Traditions, One Trainable Disposition]

    #v(2cm)

    #text(size: 10pt, fill: rgb("#8a7442"))[v1.0 · April 2026]

    #v(1cm)

    #text(size: 9pt, fill: rgb("#a09890"))[~55 minute read · 36 citations]
  ]
]

// Read the markdown content and render it
// Note: Typst can't directly import markdown, so we use the raw text
#include "convergence-index-body.typ"
