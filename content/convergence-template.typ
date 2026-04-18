// Luck Lab — The Luck Convergence Index
// Premium PDF with cover page

#set document(
  title: "The Luck Convergence Index",
  author: "Luck Lab",
)

#set page(
  paper: "a4",
  margin: (top: 2.8cm, bottom: 2.8cm, left: 2.4cm, right: 2.4cm),
)

#set text(
  font: "Georgia",
  size: 10.5pt,
  fill: rgb("#1a1810"),
)

#set par(justify: true, leading: 0.72em)

// ═══════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════
#page(fill: rgb("#0a0a0d"), margin: 0pt)[
  #align(center + horizon)[
    #block(width: 80%)[
      #v(4cm)

      #text(size: 9pt, tracking: 0.35em, fill: rgb("#c9a961"), weight: 500)[LUCK LAB]

      #v(3cm)

      #text(size: 36pt, fill: rgb("#f0f0f2"), weight: 300, tracking: -0.02em)[
        The Luck\
        Convergence Index
      ]

      #v(0.8cm)

      #line(length: 60pt, stroke: 0.5pt + rgb("#c9a961"))

      #v(0.8cm)

      #text(size: 13pt, fill: rgb("#9a9aa6"), style: "italic")[
        Twelve Wisdom Traditions,\
        One Trainable Disposition
      ]

      #v(3cm)

      #text(size: 9pt, fill: rgb("#5a5a66"), tracking: 0.15em)[
        v1.0 · April 2026\
        ~55 minute read · 36 citations
      ]

      #v(2cm)

      #text(size: 8pt, fill: rgb("#3a3a44"), tracking: 0.2em)[
        LUCKLAB.APP
      ]
    ]
  ]
]

// ═══════════════════════════════════════
// CONTENT PAGES
// ═══════════════════════════════════════

#set page(fill: white)

#set heading(
  numbering: none,
)

#show heading.where(level: 1): it => {
  v(1.5cm)
  text(size: 22pt, weight: 400, tracking: -0.01em)[#it.body]
  v(0.5cm)
}

#show heading.where(level: 2): it => {
  v(1cm)
  text(size: 16pt, weight: 400)[#it.body]
  v(0.3cm)
}

#show heading.where(level: 3): it => {
  v(0.8cm)
  text(size: 13pt, weight: 600)[#it.body]
  v(0.2cm)
}

// Style blockquotes
#show quote: it => {
  block(
    inset: (left: 16pt),
    stroke: (left: 2pt + rgb("#c9a961")),
  )[
    #text(style: "italic")[#it.body]
  ]
}

// Footer
#set page(
  footer: context {
    align(center)[
      #text(size: 8pt, fill: rgb("#999"))[
        Luck Lab · The Luck Convergence Index · #counter(page).display()
      ]
    ]
  }
)

// Include the content (pandoc will handle this)
