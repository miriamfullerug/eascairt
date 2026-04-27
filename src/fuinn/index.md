---
layout: layouts/base.njk
title: "Fúinn"
permalink: "fuinn/index.html"
---

<p class="kicker">
  <a href="{{ '/' | url(site.pathPrefix) }}">← Ar ais</a>
</p>

<section class="paperPanel">
  <h2 style="text-align: center;">Scríḃneoirí &amp; Ealaíontóirí</h2>
  <ul class="list" aria-label="Liosta scríḃneoirí agus ealaíontóirí">
    {% for p in collections.people %}
      <li class="listItem">
        <p class="listTitle" style="margin:0;">
          <a href="{{ ('/fuinn/daoine/' + p.slug + '/') | url(site.pathPrefix) }}">{{ p.name }}</a>
        </p>
      </li>
    {% endfor %}
  </ul>
</section>

