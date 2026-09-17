---
title: "Live coding music"
date: 2026-02-03
description: "I'm poking at live coding: type, sound comes out, change the code, the track moves. Ableton in the mix. I want to release something."
permalink: /live-coding-music/
categories:
  - Other
tags:
  - Music
  - Live coding
  - Sonic Pi
  - Tidal Cycles
  - Strudel
  - Ableton
toc: true
---

I am not writing a guide. I don't know enough, and I don't want to pretend I do.

I am exploring live coding. You write code, music comes out while you type. You change a loop, the loop changes. There is no separate "press play" in the usual sense. The edit *is* the performance. That still feels slightly illegal, in a good way.

I have Ableton on the machine already. I play around. The hope, if I keep at it, is to actually put a track out. Not a tutorial. A thing you can listen to.

## This is cooler than it looks on paper

If you have never seen it, don't start with a syntax page. Start with someone playing.

[DJ_Dave](https://www.youtube.com/@dj_dave____) does this in [Strudel](https://strudel.cc/), which is Tidal Cycles living in the browser. You watch patterns get rewritten in real time and the dance floor (or the bedroom) follows. This clip is the one that made it click for me:

{% include video id="ZCcpWzhekEY" provider="youtube" %}

And this is more of the process, how a file is laid out so you can throw a live set around: kicks, sidechain, sliders, stems you can bring in and out.

{% include video id="W24pteoigXk" provider="youtube" %}

That is the pitch. Not "learn Haskell." Watch someone mutate a groove by editing text, then decide if you want to try.

## How it works, roughly

There is a clock. There are patterns. A pattern is "this drum every beat," or "this bass on the offbeats," or "this sample, but only sometimes." You stack them. You transform them: faster, slower, reversed, every third hit, Euclidean rhythms if you are feeling fancy.

The tools I keep bumping into:

- **Sonic Pi.** Ruby. Friendly. Good for hearing something in thirty seconds.
- **Tidal Cycles.** Haskell, SuperCollider underneath. Patterns are the whole language. This is the serious one.
- **Strudel.** Tidal in the browser. No install fight. This is what DJ_Dave is using, and why I can send someone a link instead of a setup guide.

I bounce between them. I have a [strudel playground](https://github.com/pmagnomuller/strudel-playground) sitting around for that reason. Nothing there is a release yet.

You don't compose a whole song as a timeline, not at first. You grow a loop until it has a shape, then you add a second loop, then you duck the bass under the kick. Arrangement happens by commenting things in and out, or by recording the output and dealing with it later.

## Ableton

I don't want to throw Ableton away. I like it. Live coding is another instrument in the same room.

The useful integrations, as far as I have gotten:

- **Ableton Link** so the live-coding clock and the Live set agree on tempo. No drifting.
- **MIDI out** from Sonic Pi or Tidal into MIDI tracks in Ableton. Code writes the notes, Ableton holds the instruments, effects, and the mix.
- **Audio in.** Record the live-coding output as stems, then clip, automate, and finish the track like anything else.

That last one is probably how a release happens, if it happens. Jam in Strudel or Tidal until it feels like a track. Bounce it. Arrange in Ableton. Don't live-code the mastering.

I am still clumsy at the MIDI bridge. Link is the part that already feels obvious: one tempo, two apps, stop fighting.

## What I want from this

A small release. One track, maybe a handful. Live coding as the writing tool, Ableton as the studio. If it is bad, it is still better than another unfinished Ableton session folder.

If you want a rabbit hole, DJ_Dave's channel is a better door than I am. I will write again if something actually comes out.
