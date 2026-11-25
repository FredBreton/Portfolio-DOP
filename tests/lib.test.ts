import assert from 'node:assert/strict'
import { test } from 'node:test'

import { readMessage, senderKey } from '../src/lib/contact'
import { toInternal, toPublic } from '../src/lib/locale'
import { parseVideo, validateLink } from '../src/lib/video'

test('les adresses font l’aller-retour entre les deux langues', () => {
  assert.equal(toPublic('fr', '/a-propos'), '/a-propos')
  assert.equal(toPublic('en', '/'), '/en')
  assert.equal(toPublic('en', '/a-propos'), '/en/about')
  assert.equal(toPublic('en', '/projets/herby'), '/en/projects/herby')
  assert.equal(toPublic('en', '/#projets'), '/en#projets')
  assert.deepEqual(toInternal('/en/projects/herby'), { locale: 'en', path: '/projets/herby' })
  assert.deepEqual(toInternal('/en'), { locale: 'en', path: '/' })
  assert.deepEqual(toInternal('/endroit'), { locale: 'fr', path: '/endroit' })
})

test('seules les vidéos YouTube et Vimeo sont reconnues', () => {
  assert.match(parseVideo('https://www.youtube.com/watch?v=Iv631_HkWv0')!.src, /youtube-nocookie\.com\/embed\/Iv631_HkWv0/)
  assert.match(parseVideo('https://youtu.be/Iv631_HkWv0?t=3')!.src, /Iv631_HkWv0/)
  assert.match(parseVideo('https://vimeo.com/1147476870')!.src, /video\/1147476870/)
  assert.match(parseVideo('https://vimeo.com/862045443/ab12cd34ef')!.src, /h=ab12cd34ef/)
  const refused = ['', null, 'http://vimeo.com/1', 'https://vimeo.com.evil.test/1', 'javascript:alert(1)', 'https://www.youtube.com/watch?v="><script>']
  for (const bad of refused) assert.equal(parseVideo(bad), null, String(bad))
  assert.notEqual(validateLink('javascript:alert(1)'), true)
  assert.equal(validateLink('https://exemple.test'), true)
})

const form = (values: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}
const valid = { nom: 'Ana', courriel: 'ana@exemple.test', message: 'Bonjour', type: 'video' }
const reason = (changes: Record<string, string>) => {
  const result = readMessage(form({ ...valid, ...changes }))
  return result.ok ? 'ok' : result.reason
}

test('le formulaire accepte un message valide et refuse le reste', () => {
  const ok = readMessage(form(valid))
  assert.ok(ok.ok && ok.data.type === 'video')
  assert.equal(reason({ nom: '  ' }), 'requis')
  assert.equal(reason({ courriel: 'pas-un-courriel' }), 'courriel')
  assert.equal(reason({ message: 'x'.repeat(8001) }), 'long')
  assert.equal(reason({ site_web: 'spam' }), 'piege')
  const injected = readMessage(form({ ...valid, nom: 'Ana\r\nBcc: x@y.z', type: 'autre' }))
  assert.ok(injected.ok && !/[\r\n]/.test(injected.data.nom) && injected.data.type === 'film')
})

test('l’empreinte de l’expéditeur ne révèle pas son adresse', () => {
  assert.equal(senderKey('A@b.c', 's'), senderKey('a@b.c', 's'))
  assert.notEqual(senderKey('a@b.c', 's'), senderKey('a@b.c', 'autre'))
})
