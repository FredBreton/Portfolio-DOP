import { NextResponse, type NextRequest } from 'next/server'

import { toInternal, toPublic } from '@/lib/locale'

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const { pathname } = url

  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }
  const { locale, path } = toInternal(pathname)
  const canonical = toPublic(locale, path)
  if (canonical !== pathname) {
    url.pathname = canonical
    return NextResponse.redirect(url, 308)
  }
  url.pathname = `/${locale}${path === '/' ? '' : path}`
  return NextResponse.rewrite(url)
}

export const config = { matcher: ['/((?!(?:api|admin|_next|preview)(?:/|$)|.*\\.[^/]+$).*)'] }
