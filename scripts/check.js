/*
 * FR : Ces vérifications couvrent la configuration, le moteur pur et le serveur statique.
 * EN: These checks cover configuration, the pure engine, and the static server.
 */

import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  QUESTION_TYPES,
  normalizeAnswer,
  validateAnswer,
} from './questionTypes.js'
import { createFingerprintValues, hashAnswer } from './signalChart.js'
import { SURVEY_CONFIG } from './surveyConfig.js'
import { createStaticServer } from '../server.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checks = []

function check(name, callback) {
  checks.push({ name, callback })
}

check('configuration cohérente / coherent configuration', () => {
  const ids = SURVEY_CONFIG.questions.map((question) => question.id)
  const supportedTypes = new Set(Object.values(QUESTION_TYPES))
  assert.ok(SURVEY_CONFIG.id)
  assert.ok(Number.isInteger(SURVEY_CONFIG.version))
  assert.equal(
    new Set(ids).size,
    ids.length,
    'Question identifiers must be unique.',
  )
  SURVEY_CONFIG.questions.forEach((question) => {
    assert.ok(
      supportedTypes.has(question.type),
      `Unsupported type: ${question.type}`,
    )
    assert.ok(question.textKey && question.descriptionKey && question.shortKey)
  })
})

check('validation de chaque type / validation for every type', () => {
  SURVEY_CONFIG.questions.forEach((question) => {
    const validAnswer = createValidAnswer(question)
    const invalidAnswer = createInvalidAnswer(question)
    assert.equal(
      validateAnswer(question, validAnswer).valid,
      true,
      `${question.id} should accept its sample.`,
    )
    assert.equal(
      validateAnswer(question, invalidAnswer).valid,
      false,
      `${question.id} should reject its sample.`,
    )
  })
})

check('normalisation défensive / defensive normalization', () => {
  const checkbox = SURVEY_CONFIG.questions.find(
    (question) => question.type === QUESTION_TYPES.CHECKBOX,
  )
  const text = SURVEY_CONFIG.questions.find(
    (question) => question.type === QUESTION_TYPES.TEXT,
  )
  const firstValue = checkbox.options[0].value
  const normalizedCheckbox = normalizeAnswer(checkbox, [
    firstValue,
    firstValue,
    'unknown',
  ])
  assert.deepEqual(normalizedCheckbox, [firstValue])
  assert.equal(
    normalizeAnswer(text, 'x'.repeat(text.maximumLength + 20)).length,
    text.maximumLength,
  )
})

check('empreinte stable / stable fingerprint', () => {
  assert.equal(hashAnswer(['b', 'a']), hashAnswer(['a', 'b']))
  const answers = Object.fromEntries(
    SURVEY_CONFIG.questions.map((question) => [
      question.id,
      createValidAnswer(question),
    ]),
  )
  const first = createFingerprintValues(SURVEY_CONFIG.questions, answers)
  const second = createFingerprintValues(SURVEY_CONFIG.questions, answers)
  assert.deepEqual(first, second)
  assert.equal(first.length, SURVEY_CONFIG.questions.length)
  assert.ok(first.every((value) => value >= 0.32 && value <= 0.95))
})

check('ressources locales / local resources', async () => {
  const index = await readFile(resolve(projectRoot, 'index.html'), 'utf8')
  const references = [...index.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)].map(
    (match) => match[1],
  )
  assert.ok(references.length >= 5)
  assert.doesNotMatch(
    index,
    /(?:src|href)="https?:\/\//i,
    'Runtime assets must remain local.',
  )

  await Promise.all(
    references.map(async (reference) => {
      const resource = resolve(projectRoot, reference.slice(2))
      const resourceStats = await stat(resource)
      assert.ok(resourceStats.isFile(), `Missing resource: ${reference}`)
    }),
  )
})

check('rendu DOM sûr / safe DOM rendering', async () => {
  const scriptFiles = [
    'scripts/survey.js',
    'scripts/questionTypes.js',
    'scripts/ui.js',
  ]
  const sources = await Promise.all(
    scriptFiles.map((file) => readFile(resolve(projectRoot, file), 'utf8')),
  )
  sources.forEach((source) => {
    assert.doesNotMatch(
      source,
      /\.innerHTML\s*=/,
      'Use DOM nodes instead of HTML injection.',
    )
    assert.doesNotMatch(
      source,
      /from\s+['"](?!\.|node:)/,
      'Browser imports must be relative.',
    )
  })
})

check(
  'traductions de la configuration / configuration translations',
  async () => {
    const configSource = await readFile(
      resolve(projectRoot, 'scripts/surveyConfig.js'),
      'utf8',
    )
    const translationSource = await readFile(
      resolve(projectRoot, 'scripts/translations.js'),
      'utf8',
    )
    const keys = [...configSource.matchAll(/\b(?:\w+Key):\s*'([^']+)'/g)].map(
      (match) => match[1],
    )

    ;[...new Set(keys)].forEach((key) => {
      const occurrences =
        translationSource.match(new RegExp(`\\b${key}:`, 'g')) ?? []
      assert.equal(
        occurrences.length,
        2,
        `Translation key ${key} must exist in French and English.`,
      )
    })
  },
)

check('commentaires bilingues / bilingual comments', async () => {
  const documentedFiles = [
    'index.html',
    'server.js',
    'scripts/bootstrap.js',
    'scripts/translations.js',
    'scripts/questionTypes.js',
    'scripts/signalChart.js',
    'scripts/storage.js',
    'scripts/survey.js',
    'scripts/surveyConfig.js',
    'scripts/ui.js',
    'styles/main.css',
    'styles/survey.css',
    'styles/effects.css',
  ]

  await Promise.all(
    documentedFiles.map(async (file) => {
      const source = await readFile(resolve(projectRoot, file), 'utf8')
      assert.match(source, /FR\s*:/, `${file} needs a French comment.`)
      assert.match(source, /EN\s*:/, `${file} needs an English comment.`)
    }),
  )
})

check('documentation bilingue / bilingual documentation', async () => {
  const readme = await readFile(resolve(projectRoot, 'README.md'), 'utf8')
  assert.match(readme, /^## Français$/m)
  assert.match(readme, /^## English$/m)
  assert.match(readme, /npm run check/)
  assert.match(readme, /scripts\/surveyConfig\.js|scripts\/surveyConfig\.js/)
})

check('serveur et en-têtes / server and headers', async () => {
  const server = createStaticServer(projectRoot)
  await new Promise((resolveListening) =>
    server.listen(0, '127.0.0.1', resolveListening),
  )

  try {
    const address = server.address()
    const baseUrl = `http://127.0.0.1:${address.port}`
    const response = await fetch(baseUrl)
    const source = await response.text()
    const missingResponse = await fetch(`${baseUrl}/missing-file.txt`)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type') ?? '', /text\/html/)
    assert.match(
      response.headers.get('content-security-policy') ?? '',
      /default-src 'self'/,
    )
    assert.match(source, /id="main-content"/)
    assert.equal(missingResponse.status, 404)
  } finally {
    await new Promise((resolveClose, rejectClose) => {
      server.close((error) => (error ? rejectClose(error) : resolveClose()))
    })
  }
})

for (const { name, callback } of checks) {
  await callback()
  console.log(`PASS  ${name}`)
}

console.log(
  `\n${checks.length} checks passed / ${checks.length} vérifications réussies.`,
)

function createValidAnswer(question) {
  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    return question.options[0].value
  }

  if (question.type === QUESTION_TYPES.CHECKBOX) {
    return question.options
      .slice(0, question.minimum)
      .map((option) => option.value)
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return 'A clear idea'
  }

  return question.minimum
}

function createInvalidAnswer(question) {
  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    return '__invalid__'
  }

  if (question.type === QUESTION_TYPES.CHECKBOX) {
    return []
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return ''
  }

  return question.maximum + 1
}
