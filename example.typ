#set page(width: auto, height: auto, margin: 1cm)
#set text(font: "Linux Libertine")

= Hello, Typst!

This is a simple *Typst* document rendered to canvas.

== Math Example
$ e^{i\pi} + 1 = 0 $

== Styling
#let highlight = text.with(fill: blue)
This is #highlight[highlighted text].

#block(
  fill: luma(230),
  inset: 8pt,
  radius: 4pt,
  [
    This is a styled block with some #text(fill: red)[colored] content.
  ]
)