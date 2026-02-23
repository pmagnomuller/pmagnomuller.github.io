---
title: "Notes"
permalink: /notes/
layout: archive
collection: ddia
author_profile: true
classes: wide
---

<ul>
{% assign notes = site.ddia | sort: 'chapter' %}
{% for note in notes %}
  <li><a href="{{ note.url | relative_url }}">{{ note.title }}</a></li>
{% endfor %}
</ul>

