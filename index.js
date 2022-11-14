#!/usr/bin/env node

const fetch = require('node-fetch')
const { readFileSync, statSync } = require('fs')
const { resolve } = require('path')
const toMd = require('to-markdown')
const ww = require('wordwrap')

const checkForFile = (filePath) => {
  try {
    statSync(resolve(filePath))
    return true
  } catch {
    return false
  }
}

const url = process.argv[2] || 'https://example.com'
const { rows } = process.stdout
const len = rows < 80 ? 120 : rows
const wrapper = ww(len)
const converters = [
  {
    filter: ['style', 'script'],
    replacement: (_) => ''
  }
]
const opts = { gfm: true, converters }
const conv = (a) => toMd(a, opts)
const wrap = (a) => wrapper(a)
const log = console.log
const removeTags = (s = '') => s.replace(/(<([^>]+)>)/gi, '')
const collapseNewlines = (s = '') => s.replace(/\n\s*\n/g, '\n\n')
const strip = (a = '') => collapseNewlines(removeTags(a))
const handleEnds = (a = '') => a.trim() + '\n'

const doTheThing = (s = '') => log(handleEnds(wrap(strip(conv(s)))))

const runIfUrl = (a) =>
  fetch(a.includes('://') ? a : `http://${a}`)
    .then((res) => res.text())
    .then(doTheThing)
    .catch((err) => {
      console.error(err)
    })

const runIfFile = (a) => doTheThing(readFileSync(resolve(a)).toString())

const getTheString = (a) =>
  checkForFile(a) ? runIfFile(a) : runIfUrl(a)

const main = (a) => getTheString(a)

main(url)
