/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Lecture directe : avec `css: false`, Vitest vide les imports de fichiers CSS, même en ?raw.
const themeCss = readFileSync(resolve(process.cwd(), 'src/theme.css'), 'utf8')

type Tokens = Record<string, string>

function parseTokens(block: string): Tokens {
  const tokens: Tokens = {}
  for (const [, name, value] of block.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[name] = value
  return tokens
}

const darkStart = themeCss.indexOf('@media (prefers-color-scheme: dark)')
const themes: Record<string, Tokens> = {
  clair: parseTokens(themeCss.slice(0, darkStart)),
  sombre: parseTokens(themeCss.slice(darkStart)),
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const surfaces = ['page', 'surface', 'surface-muted', 'surface-sunken']
const tints = ['success-soft', 'danger-soft', 'warning-soft', 'warning-tint', 'info-soft', 'teacher-soft', 'teacher-tint', 'ta-soft', 'ta-tint']
const modules = [0, 1, 2, 3, 4, 5].map((n) => `module-${n}`)
const tags = ['purple', 'sky', 'emerald', 'orange', 'yellow', 'indigo', 'amber', 'rose']

/** Texte normal : 4,5:1. Paires réellement utilisées dans les composants. */
const textPairs: [string, string][] = [
  ...surfaces.flatMap((bg) => ['ink', 'ink-soft', 'ink-muted'].map((fg): [string, string] => [fg, bg])),
  ['ink-faint', 'surface'],
  ['ink', 'surface-strong'],
  ...['page', 'surface', 'surface-muted', 'info-soft', 'teacher-soft'].map((bg): [string, string] => ['link', bg]),
  ...tints.flatMap((bg) => ['ink', 'ink-soft'].map((fg): [string, string] => [fg, bg])),
  ['ink', 'highlight'],
  ['success-ink', 'surface'],
  ['success-ink', 'success-soft'],
  ['danger-ink', 'surface'],
  ['danger-ink', 'danger-soft'],
  ['warning-ink', 'warning-soft'],
  ['warning-ink', 'warning-tint'],
  ['info-ink', 'info-soft'],
  ['info-ink', 'info-tint'],
  ['teacher-ink', 'teacher-soft'],
  ['teacher-ink', 'teacher-tint'],
  ['ta-ink', 'ta-soft'],
  ['ta-ink', 'ta-tint'],
  ...tags.map((t): [string, string] => [`tag-${t}-ink`, `tag-${t}`]),
  ...['primary', 'primary-hover', 'success', 'success-hover', 'brand', 'brand-end', 'brand-hover', ...modules].map(
    (bg): [string, string] => ['on-solid', bg],
  ),
  ['on-solid-soft', 'brand'],
  ['on-solid-soft', 'brand-end'],
  ['on-solid-muted', 'brand'],
  ['brand', 'on-solid'],
]

/** Éléments d'interface (WCAG 1.4.11) : 3:1. */
const uiPairs: [string, string][] = [
  ['control', 'surface'],
  ['focus', 'page'],
  ['focus', 'surface'],
  ['success-line', 'surface'],
  ['danger-line', 'surface'],
  ['info-line', 'surface'],
  ['warning-line', 'surface'],
  ...['primary', 'success', ...modules].map((fill): [string, string] => [fill, 'track']),
]

describe.each(Object.keys(themes))('thème %s', (name) => {
  const tokens = themes[name]

  it.each(textPairs)('%s sur %s atteint 4,5:1', (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(uiPairs)('%s sur %s atteint 3:1', (fg, bg) => {
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(3)
  })
})

describe('jetons du thème', () => {
  it('définit chaque jeton dans les deux thèmes', () => {
    expect(darkStart).toBeGreaterThan(0)
    expect(Object.keys(themes.clair).length).toBeGreaterThan(50)
    expect(Object.keys(themes.sombre).sort()).toEqual(Object.keys(themes.clair).sort())
  })
})

describe('composants', () => {
  const sources = import.meta.glob(['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}'], {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>
  const paletteClass =
    /(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border(?:-[lrtbxy])?|outline|ring|accent|divide|from|via|to|fill|stroke|shadow)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?![\w-])/g

  it('n’utilisent que les jetons du thème, jamais la palette Tailwind', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(30)
    const offenders = Object.entries(sources).flatMap(([file, source]) =>
      (source.match(paletteClass) ?? []).map((cls) => `${file} : ${cls}`),
    )
    expect(offenders).toEqual([])
  })

  it('n’ont pas besoin de la variante dark:', () => {
    const offenders = Object.keys(sources).filter((file) => /(?<![\w-])dark:[a-z]/.test(sources[file]))
    expect(offenders).toEqual([])
  })
})
