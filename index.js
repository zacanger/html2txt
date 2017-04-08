#!/usr/bin/env node

const { readFileSync } = require('fs')
const { resolve } = require('path')
const request = require('request')
const pkg = require('./package.json')
const url = process.argv[2] || pkg.homepage
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
const {
  checkForFile,
  removeTags,
  collapseNewlines
} = require('zeelib')
const strip = (a) => (removeTags(collapseNewlines(a)))

const doTheThing = (a) =>
  log(wrap(strip(conv(a))))

const runIfUrl = (a) => {
  const uri = a.includes('://') ? a : `http://${a}`
  const followAllRedirects = true
  return request({
    uri
  , followAllRedirects
  }, (err, res, body) => {
    if (err) {
      return console.warn(err)
    }
    return doTheThing(body)
  })
}

const runIfFile = (a) =>
  doTheThing(readFileSync(resolve(a)).toString())

const getTheString = (a) =>
  checkForFile(a)
    ? runIfFile(a)
    : runIfUrl(a)

const main = (a) =>
  getTheString(a)

if (!module.parent) main(url)
