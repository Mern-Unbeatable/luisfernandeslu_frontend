import { useEffect } from 'react'
import { useLocation, useMatches } from 'react-router-dom'
import { appConfig } from '../../../config/appConfig'
import { env } from '../../../config/env'

function upsertMeta(attr, key, content) {
  if (!content) return

  let element = document.head.querySelector(`meta[${attr}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return

  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

/**
 * Applies document title + SEO meta from the deepest route `handle.seo`
 * or from explicit props. Title format: "Page | CONSTRUPRECO"
 */
export default function Seo({
  title,
  description,
  keywords,
  image,
  type = 'website',
  noIndex = false,
  path,
} = {}) {
  const location = useLocation()
  const matches = useMatches()

  const routeSeo = [...matches]
    .reverse()
    .find((match) => match.handle?.seo)?.handle?.seo

  const pageTitle = title ?? routeSeo?.title
  const pageDescription =
    description ?? routeSeo?.description ?? appConfig.defaultDescription
  const pageKeywords =
    keywords ?? routeSeo?.keywords ?? appConfig.defaultKeywords
  const pageImage = image ?? routeSeo?.image
  const pageType = type ?? routeSeo?.type ?? 'website'
  const shouldNoIndex = noIndex || routeSeo?.noIndex
  const pathname = path ?? location.pathname
  const canonicalUrl = `${env.siteUrl}${pathname === '/' ? '' : pathname}`
  const fullTitle = appConfig.titleTemplate(pageTitle)
  const absoluteImage = pageImage
    ? pageImage.startsWith('http')
      ? pageImage
      : `${env.siteUrl}${pageImage}`
    : `${env.siteUrl}/og-default.png`

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('name', 'description', pageDescription)
    upsertMeta('name', 'keywords', pageKeywords)
    upsertMeta(
      'name',
      'robots',
      shouldNoIndex ? 'noindex, nofollow' : 'index, follow',
    )

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', pageDescription)
    upsertMeta('property', 'og:type', pageType)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:site_name', appConfig.name)
    upsertMeta('property', 'og:locale', appConfig.locale)
    upsertMeta('property', 'og:image', absoluteImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', pageDescription)
    upsertMeta('name', 'twitter:image', absoluteImage)
    if (appConfig.twitterHandle) {
      upsertMeta('name', 'twitter:site', appConfig.twitterHandle)
    }

    upsertLink('canonical', canonicalUrl)
  }, [
    fullTitle,
    pageDescription,
    pageKeywords,
    pageType,
    canonicalUrl,
    absoluteImage,
    shouldNoIndex,
  ])

  return null
}
