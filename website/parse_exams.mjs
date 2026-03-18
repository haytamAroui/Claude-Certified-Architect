import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseExam(filepath) {
  const content = readFileSync(filepath, 'utf-8')

  // Split at answer key
  const akIdx = content.search(/^#+ Answer Key/m)
  const questionsSection = akIdx >= 0 ? content.slice(0, akIdx) : content
  const answerSection = akIdx >= 0 ? content.slice(akIdx) : ''

  // Parse answer key
  const answerMap = {}
  const akRe = /\|\s*(\d+)\s*\|\s*\*\*([A-D])\*\*\s*\|\s*([^|]*?)\s*\|\s*(.*?)\s*\|/g
  let m
  while ((m = akRe.exec(answerSection))) {
    answerMap[parseInt(m[1])] = {
      correct: m[2],
      domain: m[3].trim(),
      explanation: m[4].trim(),
    }
  }

  // Parse scenarios
  const scenarios = {}
  const scenRe = /^##+ Scenario (\d+)[:\s]*(.*?)$/gm
  const scenMatches = [...questionsSection.matchAll(scenRe)]
  for (let i = 0; i < scenMatches.length; i++) {
    const sm = scenMatches[i]
    const scenNum = parseInt(sm[1])
    const scenTitle = sm[2].trim()
    const start = sm.index + sm[0].length
    const end = i + 1 < scenMatches.length ? scenMatches[i + 1].index : questionsSection.length
    const scenText = questionsSection.slice(start, end)

    // Get scenario description
    const descMatch = scenText.match(/\n([\s\S]*?)(?=\*\*Question\s+\d+)/)
    let desc = ''
    if (descMatch) {
      desc = descMatch[1].trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ')
    }

    // Find question numbers in this scenario
    const qNums = [...scenText.matchAll(/\*\*Question\s+(\d+)\*\*/g)].map(x => parseInt(x[1]))
    for (const qn of qNums) {
      scenarios[qn] = desc ? `${scenTitle}: ${desc}` : scenTitle
    }
  }

  // Parse questions
  const questions = []
  const qRe = /\*\*Question\s+(\d+)\*\*\s*\n([\s\S]*?)(?=\*\*Question\s+\d+|$)/g
  while ((m = qRe.exec(questionsSection))) {
    const qnum = parseInt(m[1])
    const block = m[2].trim()

    // Extract question text before options
    const textMatch = block.match(/^([\s\S]*?)(?=\n\s*[A-D]\))/)
    if (!textMatch) continue
    let qText = textMatch[1].trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ')

    // Extract options
    const options = []
    const optRe = /^([A-D])\)\s*([\s\S]*?)(?=\n[A-D]\)|\n---|\s*$)/gm
    let om
    while ((om = optRe.exec(block))) {
      options.push({
        letter: om[1],
        text: om[2].trim().replace(/\n+/g, ' ').replace(/\s+/g, ' '),
      })
    }

    if (options.length !== 4) continue

    const info = answerMap[qnum] || { correct: 'B', domain: '', explanation: '' }
    questions.push({
      num: qnum,
      text: qText,
      scenario: scenarios[qnum] || '',
      options,
      correct: info.correct,
      domain: info.domain,
      explanation: info.explanation,
    })
  }

  questions.sort((a, b) => a.num - b.num)
  return questions
}

function escapeTS(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function generateTS(exam1, exam2, outpath) {
  let lines = []
  lines.push('export interface ExamQuestion {')
  lines.push('  text: string')
  lines.push('  scenario?: string')
  lines.push('  options: { letter: string; text: string }[]')
  lines.push('  correct: string')
  lines.push('  explanation: string')
  lines.push('  domain?: string')
  lines.push('}')
  lines.push('')
  lines.push('export const examData: Record<string, ExamQuestion[]> = {')

  for (const [examId, questions] of [['1', exam1], ['2', exam2]]) {
    lines.push(`  '${examId}': [`)
    for (const q of questions) {
      lines.push('    {')
      lines.push(`      text: \`${escapeTS(q.text)}\`,`)
      if (q.scenario) {
        lines.push(`      scenario: \`${escapeTS(q.scenario)}\`,`)
      }
      lines.push('      options: [')
      for (const opt of q.options) {
        lines.push(`        { letter: "${opt.letter}", text: \`${escapeTS(opt.text)}\` },`)
      }
      lines.push('      ],')
      lines.push(`      correct: "${q.correct}",`)
      lines.push(`      explanation: \`${escapeTS(q.explanation)}\`,`)
      if (q.domain) {
        lines.push(`      domain: "${escapeTS(q.domain)}",`)
      }
      lines.push('    },')
    }
    lines.push('  ],')
  }

  lines.push('}')
  lines.push('')

  writeFileSync(outpath, lines.join('\n'), 'utf-8')
}

// Main
const docsDir = join(__dirname, '..', 'docs', 'exams')
const exam1 = parseExam(join(docsDir, 'mock-exam.md'))
const exam2 = parseExam(join(docsDir, 'mock-exam-2.md'))

console.log(`Parsed ${exam1.length} questions from Mock Exam 1`)
console.log(`Parsed ${exam2.length} questions from Mock Exam 2`)

const outpath = join(__dirname, 'src', 'data', 'examData.ts')
generateTS(exam1, exam2, outpath)
console.log(`Written to ${outpath}`)
