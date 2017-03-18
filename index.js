#!/usr/bin/env node

const pkg = require('./package.json')
const url = process.argv[2] || pkg.homepage
const http = require('http')
const https = require('https')
const { rows } = process.stdout
const len = rows < 80 ? 120 : rows
const toMd = require('to-markdown')
const ww = require('wordwrap')
const wrapper = ww(len)
const converters = [
  {
    filter: [ 'style', 'script' ]
  , replacement: (_) => ''
  }
]
const opts = { gfm: true, converters }
const conv = (a) => toMd(a, opts)
const wrap = (a) => wrapper(a)
const log = (a) => console.log(a)
const src = url.includes('://') ? url : `http://${url}`
const get = url.includes('https://') ? https.get : http.get
const strip = (a) => a
  .replace(/<([^>]+)>/ig, '\n') // strip leftover tags
  .replace(/\n\s*\n/g, '\n\n')  // collapse multiple newlines

const main = (a) => get(a, (res) => {
  let b = ''
  res.on('data', (d) => { b += d.toString() })
  res.on('end', () => log(wrap(strip(conv(b)))))
})

if (!module.parent) main(src)
