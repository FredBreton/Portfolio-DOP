'use client'

import Script from 'next/script'
import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { startTransition } from 'react'

import { sendMessage, type ContactState } from '@/app/(frontend)/[locale]/contact/actions'
import { copy, type Locale } from '@/lib/locale'

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
type Turnstile = { render: (el: HTMLElement, options: object) => string; reset: (id: string) => void }

export function ContactForm({ locale, type }: { locale: Locale; type: 'film' | 'video' }) {
  const t = copy[locale]
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: 'vide' })
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const status = useRef<HTMLParagraphElement>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    const api = (window as { turnstile?: Turnstile }).turnstile
    if (scriptReady && api && box.current && !widget.current) {
      widget.current = api.render(box.current, { sitekey: siteKey, theme: 'dark', language: locale })
    }
  }, [scriptReady, locale])
  useEffect(() => {
    if (state.status === 'vide') return
    status.current?.focus()
    // Un jeton Turnstile ne sert qu'une fois.
    const api = (window as { turnstile?: Turnstile }).turnstile
    if (state.status === 'erreur' && api && widget.current) api.reset(widget.current)
  }, [state])

  // onSubmit plutôt que action : React viderait les champs même après une erreur.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(() => action(data))
  }

  if (state.status === 'ok') return <p className="lead" role="status" tabIndex={-1} ref={status}>{t.sent}</p>
  return (
    <form className="message" onSubmit={submit}>
      <label>{t.name}<input name="nom" autoComplete="name" required maxLength={120} /></label>
      <label>{t.email}<input name="courriel" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>
        {t.kind}
        <select name="type" defaultValue={type}>
          <option value="film">{t.kindFilm}</option>
          <option value="video">{t.kindVideo}</option>
        </select>
      </label>
      <label>{t.message}<textarea name="message" required maxLength={8000} /></label>
      <div className="trap" aria-hidden="true"><label>Site web<input name="site_web" tabIndex={-1} autoComplete="off" /></label></div>
      {siteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setScriptReady(true)} />
          <div ref={box} />
        </>
      )}
      {state.status === 'erreur' && <p className="error" role="alert" tabIndex={-1} ref={status}>{t.errors[state.error]}</p>}
      <button className="button arrow" disabled={pending}>{pending ? t.sending : t.send}</button>
    </form>
  )
}
