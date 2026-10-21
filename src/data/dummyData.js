export const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'Qwen 3.8 / Llama',
    provider: 'Groq Cloud',
    badgeColor: 'border-zinc-800 bg-zinc-900/80 text-zinc-300',
    avatarBg: 'bg-zinc-800 text-zinc-200 border-zinc-700/80',
    accentColor: 'zinc',
    tagline: 'High-speed reasoning & code generation',
    avgSpeed: '120 tok/s',
    strengths: ['Logic & Code', 'Ultra-fast inference', 'Structured formatting']
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Command R',
    provider: 'Cohere AI',
    badgeColor: 'border-zinc-800 bg-zinc-900/80 text-zinc-300',
    avatarBg: 'bg-zinc-800 text-zinc-200 border-zinc-700/80',
    accentColor: 'zinc',
    tagline: 'Deep enterprise reasoning & prose',
    avgSpeed: '85 tok/s',
    strengths: ['RAG & Reasoning', 'Nuanced prose', 'System design']
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 3.6 Flash',
    provider: 'Google AI',
    badgeColor: 'border-zinc-800 bg-zinc-900/80 text-zinc-300',
    avatarBg: 'bg-zinc-800 text-zinc-200 border-zinc-700/80',
    accentColor: 'zinc',
    tagline: 'Large context & multimodal analysis',
    avgSpeed: '140 tok/s',
    strengths: ['Fast response', 'Broad knowledge', 'Multi-step planning']
  }
];

export const SYNTHESIS_MODEL_INFO = {
  id: 'synthesized',
  name: 'Master Synthesis',
  provider: 'Tri-Model Consensus (Groq + Cohere + Gemini)',
  badgeColor: 'border-zinc-700 bg-zinc-800 text-zinc-100',
  avatarBg: 'bg-zinc-700 text-white border-zinc-600',
  tagline: 'Merged consensus and ultimate best points of all 3 models'
};

export const QUICK_PROMPTS = [
  {
    title: 'React vs Vue in 2026',
    prompt: 'Compare React 19 and Vue 3 in terms of state management, DX, and performance with concise code examples.',
    category: 'Frontend'
  },
  {
    title: 'Design Rate Limiter',
    prompt: 'Design a distributed API rate limiter using Redis and Token Bucket algorithm. Include architecture & edge cases.',
    category: 'Architecture'
  },
  {
    title: 'Explain Quantum Computing',
    prompt: 'Explain Quantum Superposition and Entanglement to a beginner using simple, intuitive analogies.',
    category: 'Science'
  },
  {
    title: 'Debug Memory Leak',
    prompt: 'How do you detect and fix memory leaks in Node.js event listeners and closures?',
    category: 'Debugging'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'chat-react-perf',
    title: 'React Performance Optimization Tips',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg-1-user',
        sender: 'user',
        text: 'What are the top 3 techniques to optimize re-renders in large React applications?',
        timestamp: '2 hours ago'
      },
      {
        id: 'msg-1-ai',
        sender: 'assistant',
        timestamp: '2 hours ago',
        selectedModelId: 'claude-3-5-sonnet',
        models: {
          'gpt-4o': {
            modelId: 'gpt-4o',
            modelName: 'Qwen 3.8 / Llama',
            latency: '0.8s',
            tokens: 384,
            content: `Here are the top 3 techniques to optimize React re-renders:

### 1. Granular State Colocation & Context Splitting
- Move state as close to where it is used as possible instead of hoisting it globally.
- Split monolithic Context into multiple smaller contexts (e.g. \`UserContext\` vs \`ThemeContext\`) to avoid triggering re-renders in unrelated components.

### 2. Component Composition over Props Drilling
Instead of passing props deep down or wrapping every component with \`memo\`, lift JSX up as \`children\`. React will skip re-rendering \`children\` when the parent state changes:
\`\`\`jsx
function FilterWrapper({ children }) {
  const [filter, setFilter] = useState('');
  return (
    <div>
      <SearchInput value={filter} onChange={setFilter} />
      {children}
    </div>
  );
}
\`\`\`

### 3. Selective Memoization (\`React.memo\`, \`useMemo\`, \`useCallback\`)
Wrap expensive subtrees in \`React.memo\` with stable function references created with \`useCallback\`.`
          },
          'claude-3-5-sonnet': {
            modelId: 'claude-3-5-sonnet',
            modelName: 'Command R',
            latency: '1.2s',
            tokens: 412,
            content: `Optimizing re-renders in large React apps comes down to three high-impact strategies:

### 1. State Isolation & Colocation (Architecture First)
Don't put everything in a global store. Isolate high-frequency state changes to the leaf nodes. Keep UI interaction state local; keep server-synced state in React Query / TanStack Query.

### 2. The Children Slot Pattern (Zero-Cost Optimization)
Before reaching for \`useMemo\`, leverage component composition:
\`\`\`jsx
function SlowWrapper({ children }) {
  const [active, setActive] = useState(false);
  return (
    <div className={active ? 'active' : ''}>
      <button onClick={() => setActive(!active)}>Toggle</button>
      {children} 
    </div>
  );
}
\`\`\`

### 3. Granular Selectors with Atomic State (Zustand / Jotai)
Instead of subscribing entire components to large Redux slices, use fine-grained selectors:
\`\`\`jsx
const userName = useUserStore((state) => state.user.name);
\`\`\`

**Rule of thumb**: Measure with React DevTools Profiler before premature memoization.`
          },
          'gemini-1-5-pro': {
            modelId: 'gemini-1-5-pro',
            modelName: 'Gemini 3.6 Flash',
            latency: '0.9s',
            tokens: 390,
            content: `Top 3 proven React performance techniques for modern enterprise apps:

1. **Virtualization for Long Lists**:
   Use \`@tanstack/react-virtual\` or \`react-window\` to render only viewport DOM nodes instead of 5,000 table rows.

2. **Fine-Grained Context Architecture**:
   Never put fast-changing state (timer, mouse position) into React Context without separate dispatch contexts.

3. **React Compiler & Reference Equality**:
   With React 19's compiler or \`useMemo\`/\`useCallback\`, avoid breaking reference equality on array props and event handlers.`
          }
        }
      }
    ]
  }
];

// Helper to generate dynamic mock responses based on prompt
export function generateDynamicModelResponses(prompt) {
  const cleanPrompt = prompt.trim();

  return {
    'gpt-4o': {
      modelId: 'gpt-4o',
      modelName: 'Qwen 3.8 / Llama',
      latency: `${(0.7 + Math.random() * 0.4).toFixed(1)}s`,
      tokens: Math.floor(250 + Math.random() * 150),
      content: generateModelAAnswer(cleanPrompt)
    },
    'claude-3-5-sonnet': {
      modelId: 'claude-3-5-sonnet',
      modelName: 'Command R',
      latency: `${(1.0 + Math.random() * 0.5).toFixed(1)}s`,
      tokens: Math.floor(280 + Math.random() * 160),
      content: generateModelBAnswer(cleanPrompt)
    },
    'gemini-1-5-pro': {
      modelId: 'gemini-1-5-pro',
      modelName: 'Gemini 3.6 Flash',
      latency: `${(0.6 + Math.random() * 0.4).toFixed(1)}s`,
      tokens: Math.floor(270 + Math.random() * 180),
      content: generateModelCAnswer(cleanPrompt)
    }
  };
}

function generateModelAAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('code') || p.includes('function') || p.includes('react') || p.includes('javascript') || p.includes('python')) {
    return `### Clean Implementation for "${prompt}"

\`\`\`javascript
async function handleRequest(input, options = {}) {
  try {
    const config = {
      timeout: options.timeout || 5000,
      retries: options.retries || 3,
      ...options
    };
    
    const result = await processInput(input, config);
    return { success: true, data: result, timestamp: Date.now() };
  } catch (error) {
    console.error('[Error]:', error.message);
    return { success: false, error: error.message };
  }
}
\`\`\`

**Key Points**:
- Standard error boundaries and safe fallbacks.
- Modular parameter configuration with smart defaults.`;
  }

  return `### Overview: ${prompt}

1. **Core Concept**:
   Focuses on modular architecture, zero redundant allocations, and clean separation of concerns.

2. **Execution Steps**:
   - Establish strict input/output contracts.
   - Decompose into pure, easily testable functions.
   - Continuously benchmark hot execution paths.

> **Recommendation**: Start simple, measure telemetry, and optimize based on actual bottlenecks.`;
}

function generateModelBAnswer(prompt) {
  return `### Analysis & System Design for "${prompt}"

When addressing this problem, decoupling state management and side effects yields the highest long-term maintainability:

\`\`\`typescript
interface ProcessConfig {
  retries?: number;
  backoffMs?: number;
}

export class TaskProcessor<T> {
  constructor(private readonly config: ProcessConfig = { retries: 3, backoffMs: 300 }) {}

  async execute(task: () => Promise<T>): Promise<T> {
    for (let attempt = 1; attempt <= (this.config.retries ?? 3); attempt++) {
      try {
        return await task();
      } catch (err) {
        if (attempt === this.config.retries) throw err;
        await new Promise(r => setTimeout(r, (this.config.backoffMs ?? 300) * attempt));
      }
    }
    throw new Error('Execution failed');
  }
}
\`\`\`

**Considerations**:
- Exponential backoff avoids cascading failures.
- Generic type parameter maintains end-to-end type safety.`;
}

function generateModelCAnswer(prompt) {
  return `### Comprehensive Breakdown: ${prompt}

Here is a structured assessment of the core dynamics:

#### Architecture Pipeline
\`\`\`
[Input Request] ➔ [Validation] ➔ [Concurrent Execution] ➔ [Aggregated Output]
\`\`\`

#### Key Comparison
| Factor | Traditional Approach | Modern Concurrent Flow |
| :--- | :--- | :--- |
| **Throughput** | Sequential / Blocking | Parallel / Non-blocking |
| **Resilience** | Single point of failure | Redundant fallbacks |
| **Latency** | Cumulative delay | Minimized (fastest resolver) |

**Conclusion**: Parallel evaluation allows verifying consensus and choosing the optimal response with minimal latency overhead.`;
}
