---
title: "Live Coding Music with Sonic Pi and Tidal Cycles"
date: 2026-05-19
description: "Notes from tinkering with live coding — writing music as code, what clicked in Sonic Pi and Tidal Cycles, and why I keep coming back to it."
categories:
  - Other
tags:
  - Live coding
  - Sonic Pi
  - Tidal Cycles
  - Music
toc: false
---

I have always liked the idea that a piece of music could be a program you are still holding. Not a DAW session you bounce and forget, but a loop you can change while it is already playing. Live coding is that: you write in front of the sound, and the sound answers. It sits somewhere between improvisation and composition and I keep drifting back to it when I want to make something that is not software for work.

Two environments ate most of my attention. Sonic Pi is Ruby and it feels like someone handed you a synth and said start. Tidal Cycles is Haskell patterns on top of SuperCollider and it feels like someone handed you a sequencer that thinks in cycles. I bounced between them for a while before I stopped treating that as a decision I had to win.

Sonic Pi clicked first because I could hear a mistake immediately. `play 60`, sleep, play again. Then `live_loop` and suddenly you have drums, a hat, a bass line, all running at once, and you change one of them without stopping the others. That is the whole trick. You are not compiling a song. You are steering something that is already moving.

```ruby
live_loop :drums do
  sample :drum_bass_hard
  sleep 1
end

live_loop :hihat do
  sample :drum_cymbal_closed
  sleep 0.5
end
```

The rest is taste. Reverb around a note, a sample instead of a beep, `rrand` when you want the melody to wander, a function when a phrase is worth repeating. I spent too long organizing "sections" as if I were writing a library. The performances that felt better were messier: a couple of loops, a variable I could poke, and the nerve to change `current_note` while people were listening.

Tidal was the opposite kind of click. I did not fall for the syntax. I fell for the idea that a drum pattern is a string you can speed up, reverse, stack, or turn into a Euclidean rhythm without rewriting it.

```haskell
d1 $ s "bd(3,8) hh(5,8) cp(2,8)"
```

Once that lands, you stop thinking in bars and start thinking in transformations. `fast 2`, `rev`, two patterns at different speeds against each other. It is a different brain from Sonic Pi and I like having both. Ruby when I want to hear a line. Haskell when I want to push a pattern until it is stranger than I would have programmed on purpose.

I am not trying to write the complete guide. Those already exist, and the useful practice is smaller: keep a few loops you can actually perform, learn how your machine's latency behaves, start simpler than you think, and change one thing while it plays. Stop when it sounds like you. The rest is just more sleep values.
