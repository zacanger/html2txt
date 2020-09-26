import fetch from 'node-fetch'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import toMd from 'to-markdown'
import ww from 'wordwrap'
import checkForFile from 'zeelib/lib/file-exists'

const url = process.argv[2] || 'https://example.com'
const { rows } = process.stdout
const len = rows < 80 ? 120 : rows
const wrapper = ww(len)
const converters = [
  {
    filter: ['style', 'script'],
    replacement: (_: string) => '',
  },
]
const opts = { gfm: true, converters }
const conv = (a: string) => toMd(a, opts)
const wrap = (a: string) => wrapper(a)
const log = console.log
const removeTags = (s: string = '') => s.replace(/(<([^>]+)>)/gi, '')
const collapseNewlines = (s: string = '') => s.replace(/\n\s*\n/g, '\n\n')
const strip = (a: string = '') => collapseNewlines(removeTags(a))
const handleEnds = (a: string = '') => a.trim() + '\n'

const doTheThing = (s: string = '') => log(handleEnds(wrap(strip(conv(s)))))

const runIfUrl = (a: string) =>
  fetch(a.includes('://') ? a : `http://${a}`)
    .then((res) => res.text())
    .then(doTheThing)
    .catch((err) => {
      console.error(err)
    })

const runIfFile = (a: string) => doTheThing(readFileSync(resolve(a)).toString())

const getTheString = (a: string) =>
  checkForFile(a) ? runIfFile(a) : runIfUrl(a)

const main = (a: string) => getTheString(a)

main(url)
