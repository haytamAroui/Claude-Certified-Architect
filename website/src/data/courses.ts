export interface Course {
  id: string
  title: string
  domain: string
  weight: string
  description: string
  modules: string[]
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Agentic Architecture & Orchestration',
    domain: 'Domain 1',
    weight: '27%',
    description: 'The heaviest exam domain. Master the agentic loop, multi-agent patterns, hooks, and session management.',
    modules: [
      'The Agentic Loop & stop_reason',
      'Multi-Agent Systems (Coordinator-Subagent)',
      'Subagent Context Isolation',
      'Enforcement & Handoff Patterns',
      'Agent SDK Hooks',
      'Task Decomposition Strategies',
      'Session Management',
    ],
  },
  {
    id: '2',
    title: 'Tool Design & MCP Integration',
    domain: 'Domain 2',
    weight: '20%',
    description: 'Tool descriptions, MCP error patterns, tool distribution, and built-in tool mastery.',
    modules: [
      'Tool Descriptions & Selection',
      'Structured Error Responses (isError)',
      'Tool Distribution & Scoping',
      'MCP Server Configuration',
      'Built-in Tools Reference',
    ],
  },
  {
    id: '3',
    title: 'Claude Code Configuration & Workflows',
    domain: 'Domain 3',
    weight: '20%',
    description: 'CLAUDE.md hierarchy, custom commands, skills, plan mode, and CI/CD integration.',
    modules: [
      'CLAUDE.md Configuration Hierarchy',
      'Custom Commands and Skills',
      'Rules & Path Scoping',
      'Plan Mode & Iterative Refinement',
      'CI/CD Integration',
    ],
  },
  {
    id: '4',
    title: 'Prompt Engineering & Structured Output',
    domain: 'Domain 4',
    weight: '18%',
    description: 'System prompts, tool_use for structured output, few-shot patterns, and batch API.',
    modules: [
      'System Prompt Design',
      'Structured Output with tool_use',
      'Few-Shot Prompting',
      'Extraction & Validation',
      'Batch API',
    ],
  },
  {
    id: '5',
    title: 'Context Management & Reliability',
    domain: 'Domain 5',
    weight: '15%',
    description: 'Context preservation, escalation rules, error propagation, caching, and human review.',
    modules: [
      'Preserving Critical Information',
      'Escalation & Ambiguity Resolution',
      'Error Propagation in Multi-Agent Systems',
      'Large Codebase Exploration',
      'Prompt Caching (cache_control)',
      'Human Review & Confidence Calibration',
      'Information Provenance',
    ],
  },
  {
    id: '6',
    title: 'Exam Edge Cases & Traps',
    domain: 'Bonus',
    weight: 'N/A',
    description: 'The 6 most common exam traps and 8 most dangerous distractors.',
    modules: [
      'Trap 1: Policy Silent vs Denies',
      'Trap 2: Cumulative Hooks',
      'Trap 3: Stateless API Confusion',
      'Trap 4: Empty Results vs Tool Errors',
      'Trap 5: tool_choice Workflow',
      'Trap 6: Edit Tool Fallback Chain',
    ],
  },
]
