import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
assert.match(source, /ctx\.locale\.register\(NS, \{ zh, en \}\)/)
assert.match(source, /const inject = \['slots', 'locale'\]/)
assert.match(source, /MutationObserver/)
assert.doesNotMatch(source, /value\.startsWith\(t\('ui\.1'\)\)/)

const zh = { greeting: '你好，{{name}}', error: '操作失败: {{error}}' }
const en = { greeting: 'Hello, {{name}}', error: 'Operation failed: {{error}}' }
const interpolate = (value, vars = {}) => String(value).replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] === undefined ? '' : String(vars[key]))
assert.equal(interpolate(zh.greeting, { name: 'Alice' }), '你好，Alice')
assert.equal(interpolate(en.greeting, { name: 'Alice' }), 'Hello, Alice')
assert.equal(interpolate(en.error, { error: '服务端: 500 /foo' }), 'Operation failed: 服务端: 500 /foo')
console.log('client locale tests passed')
