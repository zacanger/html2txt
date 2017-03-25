#!/usr/bin/env node

const { statSync, readFileSync } = require('fs')
const { resolve } = require('path')
const pkg = require('./package.json')
const url = process.argv[2] || pkg.homepage
const http = require('http')
const https = require('https')
const { rows } = process.stdout
const len = rows < 80 ? 120 : rows
const toMd = require('to-markdown')
const ww = require('wordwrap')
const wrapper = ww(len)
const converters = [{
  filter: [ 'style', 'script' ]
, replacement: (_) => ''
}]
const opts = { gfm: true, converters }
const conv = (a) => toMd(a, opts)
const wrap = (a) => wrapper(a)
const log = (a) => console.log(a)
const strip = (a) => a
  .replace(/<([^>]+)>/ig, '\n') // strip leftover tags
  .replace(/\n\s*\n/g, '\n\n')  // collapse multiple newlines

const checkIsFile = (a) => {
  try {
    statSync(resolve(a))
    return true
  } catch (_) {
    return false
  }
}

const doTheThing = (a) =>
  log(wrap(strip(conv(a))))

const runIfUrl = (a) => {
  const u = a.includes('://') ? a : `http://${a}`
  const get = u.startsWith('https://') ? https.get : http.get
  return get(u, (res) => {
    let b = ''
    res.on('data', (d) => { b += d.toString() })
    res.on('end', () => doTheThing(b))
  })
}

const runIfFile = (a) =>
  doTheThing(readFileSync(resolve(a)).toString())

const getTheString = (a) =>
  checkIsFile(a)
    ? runIfFile(a)
    : runIfUrl(a)

const main = (a) =>
  getTheString(a)

if (!module.parent) main(url)
