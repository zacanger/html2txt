#!/usr/bin/env node

const
  url      = process.argv[2] || 'zacanger.com'
, { get }  = require('http')
, { rows } = process.stdout
, len      = (rows < 80 ? 80 : rows)
, toMd     = require('to-markdown')
, ww       = require('wordwrap')
, wrapper  = ww(len)
, opts     = { gfm: true }
, conv     = a => toMd(a, opts)
, wrap     = a => wrapper(a)
, log      = a => console.log(a)
, src      = url.includes('http://')
  ? url
  : url.includes('https://')
    ? url.replace(/https/, 'http')
    : `http://${url}`

const main = a => get(a, res => {
  let b = ''
  res.on('data', d => {b += d.toString()})
  res.on('end', () => log(wrap(conv(b))))
})

if (!module.parent) main(src)
