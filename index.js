#!/usr/bin/env node

const
  pkg      = require('./package.json')
, url      = process.argv[2] || pkg.homepage
, http     = require('http')
, https    = require('https')
, { rows } = process.stdout
, len      = (rows < 80 ? 120 : rows)
, toMd     = require('to-markdown')
, ww       = require('wordwrap')
, wrapper  = ww(len)
, opts     = { gfm: true }
, conv     = a => toMd(a, opts)
, wrap     = a => wrapper(a)
, log      = a => console.log(a)
, src      = url.includes('://') ? url : `http://${url}`
, get      = url.includes('https://') ? https.get : http.get
, strip    = a => a
  .replace(/(<([^>]+)>|&nbsp;)/ig, ' ') // strip leftover tags and nbsp
  .replace(/\n\s*\n/g, '\n\n') // collapse multiple newlines
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '<')
  .replace(/&quot/g, '"')
// TODO: the above, but without the bottle of malbec

const main = a => get(a, res => {
  let b = ''
  res.on('data', d => { b += d.toString() })
  res.on('end', () => log(wrap(strip(conv(b)))))
})

if (!module.parent) main(src)
