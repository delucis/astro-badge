---
layout: ../layouts/Layout.astro
setup: import { Code } from 'astro/components';
---

# Astro Badge

Add badges to your [Astro](https://astro.build) projects and show off your Astro pride!

## Built with Astro

[![Built with Astro](/v1/built-with-astro.svg)](https://astro.build)

### Markdown

<Code code={`[![Built with Astro](${Astro.site}v1/built-with-astro.svg)](https://astro.build)`} lang="md" />

### HTML

<Code code={`<a href="https://astro.build">\n <img src="${Astro.site}v1/built-with-astro.svg" alt="Built with Astro">\n</a>`} lang="html" />

## Sizes

### Small

<code>{Astro.site}v1/built-with-astro/small.svg</code>

![Built with Astro](/v1/built-with-astro/small.svg)

### Medium

<code>{Astro.site}v1/built-with-astro/medium.svg</code>

![Built with Astro](/v1/built-with-astro/medium.svg)

### Large

<code>{Astro.site}v1/built-with-astro/large.svg</code>

![Built with Astro](/v1/built-with-astro/large.svg)
