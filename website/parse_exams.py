#!/usr/bin/env python3
"""Parse mock exam markdown files into a TypeScript data file."""
import re
import os

def parse_exam(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into questions section and answer key section
    answer_key_match = re.search(r'^#+ Answer Key', content, re.MULTILINE)
    if not answer_key_match:
        # Try alternative pattern
        answer_key_match = re.search(r'^---\s*\n\s*\n\s*## Scenario 1', content, re.MULTILINE)

    questions_section = content[:answer_key_match.start()] if answer_key_match else content
    answer_section = content[answer_key_match.start():] if answer_key_match else ""

    # Parse answer key - find all table rows with answers
    answer_map = {}
    # Pattern: | Q# | **Answer** | Domain | Explanation |
    for match in re.finditer(r'\|\s*(\d+)\s*\|\s*\*\*([A-D])\*\*\s*\|\s*([^\|]*?)\s*\|\s*(.*?)\s*\|', answer_section):
        qnum = int(match.group(1))
        answer_map[qnum] = {
            'correct': match.group(2),
            'domain': match.group(3).strip(),
            'explanation': match.group(4).strip()
        }

    # Parse scenarios
    scenarios = {}
    scenario_pattern = re.compile(r'^##+ Scenario (\d+)[:\s]*(.*?)(?=\n)', re.MULTILINE)
    scenario_positions = list(scenario_pattern.finditer(questions_section))

    for i, match in enumerate(scenario_positions):
        scenario_num = int(match.group(1))
        scenario_title = match.group(2).strip()
        start = match.end()
        end = scenario_positions[i + 1].start() if i + 1 < len(scenario_positions) else len(questions_section)
        scenario_text = questions_section[start:end]

        # Extract scenario description (text before first question)
        desc_match = re.search(r'\n(.*?)(?=\*\*Question\s+\d+)', scenario_text, re.DOTALL)
        scenario_desc = ""
        if desc_match:
            scenario_desc = desc_match.group(1).strip()
            # Clean up markdown formatting
            scenario_desc = re.sub(r'\n+', ' ', scenario_desc)
            scenario_desc = re.sub(r'\s+', ' ', scenario_desc)

        # Find which questions belong to this scenario
        q_nums = [int(m.group(1)) for m in re.finditer(r'\*\*Question\s+(\d+)\*\*', scenario_text)]
        for qn in q_nums:
            scenarios[qn] = f"{scenario_title}: {scenario_desc}" if scenario_desc else scenario_title

    # Parse questions
    questions = []
    q_pattern = re.compile(r'\*\*Question\s+(\d+)\*\*\s*\n(.*?)(?=\*\*Question\s+\d+|$)', re.DOTALL)

    for match in q_pattern.finditer(questions_section):
        qnum = int(match.group(1))
        q_block = match.group(2).strip()

        # Extract question text (before options)
        text_match = re.search(r'^(.*?)(?=\n\s*[A-D]\))', q_block, re.DOTALL)
        if not text_match:
            continue
        q_text = text_match.group(1).strip()
        # Clean up
        q_text = re.sub(r'\n+', ' ', q_text)
        q_text = re.sub(r'\s+', ' ', q_text)

        # Extract options
        options = []
        opt_pattern = re.compile(r'^([A-D])\)\s*(.*?)(?=\n[A-D]\)|\n---|\Z)', re.MULTILINE | re.DOTALL)
        for opt_match in opt_pattern.finditer(q_block):
            letter = opt_match.group(1)
            opt_text = opt_match.group(2).strip()
            opt_text = re.sub(r'\n+', ' ', opt_text)
            opt_text = re.sub(r'\s+', ' ', opt_text)
            options.append({'letter': letter, 'text': opt_text})

        if len(options) != 4:
            continue

        answer_info = answer_map.get(qnum, {'correct': 'B', 'domain': '', 'explanation': ''})

        questions.append({
            'num': qnum,
            'text': q_text,
            'scenario': scenarios.get(qnum, ''),
            'options': options,
            'correct': answer_info['correct'],
            'domain': answer_info['domain'],
            'explanation': answer_info['explanation'],
        })

    # Sort by question number
    questions.sort(key=lambda q: q['num'])
    return questions


def escape_ts(s):
    """Escape string for TypeScript template literal."""
    s = s.replace('\\', '\\\\')
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s


def generate_ts(exam1, exam2, outpath):
    lines = []
    lines.append('export interface ExamQuestion {')
    lines.append('  text: string')
    lines.append('  scenario?: string')
    lines.append('  options: { letter: string; text: string }[]')
    lines.append('  correct: string')
    lines.append('  explanation: string')
    lines.append('  domain?: string')
    lines.append('}')
    lines.append('')
    lines.append('export const examData: Record<string, ExamQuestion[]> = {')

    for exam_id, questions in [('1', exam1), ('2', exam2)]:
        lines.append(f"  '{exam_id}': [")
        for q in questions:
            lines.append('    {')
            lines.append(f'      text: `{escape_ts(q["text"])}`,')
            if q['scenario']:
                lines.append(f'      scenario: `{escape_ts(q["scenario"])}`,')
            lines.append('      options: [')
            for opt in q['options']:
                lines.append(f'        {{ letter: "{opt["letter"]}", text: `{escape_ts(opt["text"])}` }},')
            lines.append('      ],')
            lines.append(f'      correct: "{q["correct"]}",')
            lines.append(f'      explanation: `{escape_ts(q["explanation"])}`,')
            if q['domain']:
                lines.append(f'      domain: "{escape_ts(q["domain"])}",')
            lines.append('    },')
        lines.append('  ],')

    lines.append('}')
    lines.append('')

    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    docs = os.path.join(base, '..', 'docs', 'exams')

    exam1 = parse_exam(os.path.join(docs, 'mock-exam.md'))
    exam2 = parse_exam(os.path.join(docs, 'mock-exam-2.md'))

    print(f"Parsed {len(exam1)} questions from Mock Exam 1")
    print(f"Parsed {len(exam2)} questions from Mock Exam 2")

    outpath = os.path.join(base, 'src', 'data', 'examData.ts')
    generate_ts(exam1, exam2, outpath)
    print(f"Written to {outpath}")
