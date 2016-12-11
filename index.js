#!/usr/bin/env node

const
  pkg      = require('./package.json')
, url      = process.argv[2] || pkg.homepage
, http     = require('http')
, https    = require('https')
, { rows } = process.stdout
, len      = (rows < 80 ? 80 : rows)
, toMd     = require('to-markdown')
, ww       = require('wordwrap')
, wrapper  = ww(len)
, opts     = { gfm: true }
, conv     = a => toMd(a, opts)
, wrap     = a => wrapper(a)
, log      = a => console.log(a)
, src      = url.includes('://') ? url : `http://${url}`
, get      = url.includes('https://') ? https.get : http.get

const main = a => get(a, res => {
  let b = ''
  res.on('data', d => {b += d.toString()})
  res.on('end', () => log(wrap(conv(b))))
})

if (!module.parent) main(src)
