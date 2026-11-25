// Vérifie les accès et le formulaire dans une vraie base, distincte de celle du site (fred_test).
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import type { Payload } from 'payload'

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://fred:local@127.0.0.1:54329/fred_test'
process.env.PAYLOAD_SECRET = 'secret-de-test'
for (const key of ['S3_BUCKET', 'SMTP_HOST']) delete process.env[key]

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const { saveMessage } = await import('../src/lib/save-message')

let payload: Payload
const publicAccess = { overrideAccess: false } as const
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
let seq = 0
const message = () => ({ nom: 'Ana', courriel: `ana${Date.now()}-${seq++}@exemple.test`, type: 'film' as const, message: 'Bonjour <b>toi</b>' })

before(async () => {
  payload = await getPayload({ config })
  await payload.db.migrate()
  for (const collection of ['messages', 'projects', 'pages', 'media', 'categories'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  await payload.updateGlobal({ slug: 'reglages', data: { nom: 'Test', metier: 'Test', courriel: 'recoit@exemple.test', courrielMessages: 'prive@exemple.test' } })
})
after(async () => {
  await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  await payload.destroy()
  setTimeout(() => process.exit(), 200).unref()
})

test('un brouillon est invisible au public, même en le demandant', async () => {
  const page = await payload.create({ collection: 'pages', data: { titre: 'Secret', _status: 'draft' } })
  assert.equal((await payload.find({ collection: 'pages', ...publicAccess })).totalDocs, 0)
  assert.equal((await payload.find({ collection: 'pages', draft: true, ...publicAccess })).totalDocs, 0)
  await payload.update({ collection: 'pages', id: page.id, data: { _status: 'published' } })
  await payload.update({ collection: 'pages', id: page.id, draft: true, data: { titre: 'Changement pas publié' } })
  for (const draft of [false, true]) {
    const { docs } = await payload.find({ collection: 'pages', draft, ...publicAccess })
    assert.ok(docs.every((d) => d.titre === 'Secret'), `draft=${draft}`)
    if (!draft) assert.equal(docs.length, 1)
  }
})

test('l’accueil en brouillon est invisible au public', async () => {
  await payload.updateGlobal({ slug: 'accueil', data: { demo: 'https://vimeo.com/1', _status: 'published' } })
  await payload.updateGlobal({ slug: 'accueil', draft: true, data: { demo: 'https://vimeo.com/2', _status: 'draft' } })
  for (const draft of [false, true]) {
    const { demo } = await payload.findGlobal({ slug: 'accueil', draft, ...publicAccess })
    assert.notEqual(demo, 'https://vimeo.com/2', `draft=${draft}`)
    if (!draft) assert.equal(demo, 'https://vimeo.com/1')
  }
})

test('le public ne lit ni les messages ni le courriel privé, et ne modifie rien', async () => {
  await assert.rejects(payload.find({ collection: 'messages', ...publicAccess }))
  await assert.rejects(payload.find({ collection: 'users', ...publicAccess }))
  await assert.rejects(payload.create({ collection: 'messages', data: { ...message() }, ...publicAccess }))
  await assert.rejects(payload.create({ collection: 'pages', data: { titre: 'Intrus', _status: 'published' }, ...publicAccess }))
  await assert.rejects(payload.create({ collection: 'users', data: { email: 'x@y.test', password: 'motdepasse' }, ...publicAccess }))
  await assert.rejects(payload.findVersions({ collection: 'pages', ...publicAccess }))
  const settings = await payload.findGlobal({ slug: 'reglages', ...publicAccess })
  assert.equal(settings.courriel, 'recoit@exemple.test')
  assert.equal(settings.courrielMessages, undefined)
})

test('un texte non traduit s’affiche en français et l’adresse ne change pas', async () => {
  const categorie = (await payload.create({ collection: 'categories', data: { titre: 'Fiction' } })).id
  const couverture = (await payload.create({ collection: 'media', data: { alt: 'x' }, file: { data: pixel, name: 'p.png', mimetype: 'image/png', size: pixel.length } })).id
  const project = await payload.create({ collection: 'projects', data: { titre: 'Gro$ lot', categorie, couverture, _status: 'published' } })
  assert.equal(project.slug, 'gros-lot')
  assert.equal((await payload.findByID({ collection: 'projects', id: project.id, locale: 'en', ...publicAccess })).titre, 'Gro$ lot')
  const english = await payload.update({ collection: 'projects', id: project.id, locale: 'en', data: { titre: 'Jackpot', _status: 'published' } })
  assert.equal(english.slug, 'gros-lot')
  assert.equal((await payload.findByID({ collection: 'projects', id: project.id, locale: 'fr' })).titre, 'Gro$ lot')
})

test('les adresses réservées et les mauvais fichiers sont refusés', async () => {
  await assert.rejects(payload.create({ collection: 'pages', data: { titre: 'Contact', _status: 'published' } }))
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>')
  await assert.rejects(payload.create({ collection: 'media', data: { alt: 'x' }, file: { data: svg, name: 'x.svg', mimetype: 'image/svg+xml', size: svg.length } }))
})

test('le message est gardé, que le courriel parte, échoue ou soit absent', async () => {
  const last = async () => (await payload.find({ collection: 'messages', limit: 1, sort: '-createdAt' })).docs[0]
  const original = payload.sendEmail
  try {
    let sent: any
    payload.sendEmail = (async (mail: any) => { sent = mail }) as typeof payload.sendEmail
    const first = message()
    assert.equal(await saveMessage(payload, first, first.courriel, true), 'ok')
    assert.equal((await last()).notification, 'envoye')
    assert.equal(sent.to, 'prive@exemple.test')
    assert.equal(sent.replyTo, first.courriel)
    assert.ok(!sent.html.includes('<b>toi'))

    payload.sendEmail = (async () => { throw new Error('serveur en panne') }) as typeof payload.sendEmail
    const second = message()
    assert.equal(await saveMessage(payload, second, second.courriel, true), 'ok')
    const failed = await last()
    assert.equal(failed.courriel, second.courriel)
    assert.equal(failed.notification, 'echec')
    assert.match(failed.erreur!, /serveur en panne/)

    const third = message()
    assert.equal(await saveMessage(payload, third, third.courriel, false), 'ok')
    assert.equal((await last()).notification, 'desactive')
  } finally {
    payload.sendEmail = original
  }
})

test('le quatrième message en dix minutes est refusé', async () => {
  const m = message()
  for (let i = 0; i < 3; i++) assert.equal(await saveMessage(payload, m, m.courriel, false), 'ok')
  assert.equal(await saveMessage(payload, m, m.courriel, false), 'limite')
  const other = message()
  assert.equal(await saveMessage(payload, other, other.courriel, false), 'ok')
})
