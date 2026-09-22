export const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o / Llama 3.3',
    provider: 'OpenAI / Groq (Free)',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    avatarBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accentColor: 'emerald',
    tagline: 'Fast & Versatile Multi-modal',
    avgSpeed: '120 tok/s',
    strengths: ['Logic & Code', 'Ultra-fast inference', 'Structured formatting']
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Cohere Command R+',
    provider: 'Cohere (Free)',
    badgeColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    avatarBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    accentColor: 'amber',
    tagline: 'Deep Enterprise Reasoning',
    avgSpeed: '85 tok/s',
    strengths: ['RAG & Reasoning', 'Nuanced prose', 'System design']
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Flash',
    provider: 'Google (Free)',
    badgeColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    avatarBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    accentColor: 'blue',
    tagline: 'Comprehensive & Large Context',
    avgSpeed: '140 tok/s',
    strengths: ['1M+ Token Context', 'Creative breakdowns', 'Multi-step planning']
  }
];

export const QUICK_PROMPTS = [
  {
    title: 'React vs Vue in 2026',
    prompt: 'Compare React 19 and Vue 3 in terms of state management, DX, and performance with code examples.',
    category: 'Frontend'
  },
  {
    title: 'Design Rate Limiter',
    prompt: 'Design a distributed API rate limiter using Redis and Token Bucket algorithm. Include architecture & edge cases.',
    category: 'Architecture'
  },
  {
    title: 'Explain Quantum Computing',
    prompt: 'Explain Quantum Superposition and Entanglement to a 10-year old using easy analogies.',
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
        selectedModelId: 'claude-3-5-sonnet', // user selected Claude 3.5 Sonnet
        models: {
          'gpt-4o': {
            modelId: 'gpt-4o',
            modelName: 'GPT-4o',
            latency: '1.2s',
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
      {children} {/* This won't re-render on filter change */}
    </div>
  );
}
\`\`\`

### 3. Selective Memoization (\`React.memo\`, \`useMemo\`, \`useCallback\`)
- Wrap expensive subtrees in \`React.memo\` with stable function references created with \`useCallback\`.`
          },
          'claude-3-5-sonnet': {
            modelId: 'claude-3-5-sonnet',
            modelName: 'Claude 3.5 Sonnet',
            latency: '1.4s',
            tokens: 412,
            content: `Optimizing re-renders in large React apps comes down to three high-impact strategies:

### 1. State Isolation & Colocation (Architecture First)
Don't put everything in a global store. Isolate high-frequency state changes (e.g. typing, hover, scroll) to the leaf nodes.
- **Tip**: Keep UI interaction state local; keep server-synced state in React Query / TanStack Query.

### 2. The Children Slot Pattern (Zero-Cost Optimization)
Before reaching for \`useMemo\`, leverage component composition:
\`\`\`jsx
// Fast: App renders slow tree as immutable prop
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
Instead of subscribing entire components to large Redux/Context slices, use fine-grained selectors:
\`\`\`jsx
const userName = useUserStore((state) => state.user.name); // only re-renders if name changes
\`\`\`

**Rule of thumb**: Measure with React DevTools Profiler before premature memoization.`
          },
          'gemini-1-5-pro': {
            modelId: 'gemini-1-5-pro',
            modelName: 'Gemini 1.5 Pro',
            latency: '1.1s',
            tokens: 390,
            content: `Top 3 proven React performance techniques for modern enterprise apps:

1. **Virtualization for Long Lists**:
   - Use \`@tanstack/react-virtual\` or \`react-window\` to render only viewport DOM nodes instead of 5,000 table rows.

2. **Fine-Grained Context Architecture**:
   - Never put fast-changing state (timer, mouse position) into React Context without separate dispatch contexts.

3. **React Compiler & Smart Memoization**:
   - With React 19's compiler or \`useMemo\`/\`useCallback\`, avoid breaking reference equality on array props and event handlers passed to memoized children.`
          }
        }
      }
    ]
  },
  {
    id: 'chat-quantum-basics',
    title: 'Explain Quantum Computing for Beginners',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    messages: [
      {
        id: 'msg-q-user',
        sender: 'user',
        text: 'Explain quantum computing to a 10 year old using a coin toss analogy.',
        timestamp: 'Yesterday'
      },
      {
        id: 'msg-q-ai',
        sender: 'assistant',
        timestamp: 'Yesterday',
        selectedModelId: 'gpt-4o',
        models: {
          'gpt-4o': {
            modelId: 'gpt-4o',
            modelName: 'GPT-4o',
            latency: '1.0s',
            tokens: 280,
            content: `Imagine a normal computer uses tiny light switches called **Bits**. A bit is like a coin sitting flat on a table:
- It is either **Heads (0)** or **Tails (1)**. Only one side at a time!

### Now, what is a Quantum Computer?
A quantum computer uses **Qubits**. 
- Instead of a coin sitting flat on the table, imagine **spinning the coin really fast on a desk**! 🪙💫
- While it is spinning, is it Heads or Tails? **It is both at the exact same time!**

This magical spinning state is called **Superposition**. 
Because millions of spinning coins can explore thousands of mazes simultaneously, quantum computers can solve crazy math puzzles in seconds that would take normal computers 1,000 years!`
          },
          'claude-3-5-sonnet': {
            modelId: 'claude-3-5-sonnet',
            modelName: 'Claude 3.5 Sonnet',
            latency: '1.3s',
            tokens: 310,
            content: `Think of regular computers like reading books one page at a time. Quantum computers read every book in the library at once!

### The Magic Coin Trick:
1. **Regular Bit (Normal Coin)**: You put a coin down on the table. It is either Heads or Tails.
2. **Qubit (Spinning Coin)**: You spin the coin on its edge. While it's spinning in a blur, it's a mix of both Heads AND Tails together! Scientists call this **Superposition**.
3. **Entanglement (Telepathic Twin Coins)**: Imagine two magic spinning coins. If one finally lands on Heads, the other magically lands on Tails on the other side of the world instantly!

That's why scientists use quantum computers to discover new medicines and simulate galaxies!`
          },
          'gemini-1-5-pro': {
            modelId: 'gemini-1-5-pro',
            modelName: 'Gemini 1.5 Pro',
            latency: '0.9s',
            tokens: 260,
            content: `Here is the fun coin story:

🪙 **Normal Computer**: A coin placed flat. Either Heads (0) or Tails (1).
🌪️ **Quantum Qubit**: A coin spinning at lightning speed on the table. It holds all possibilities until you slap your hand down to stop it!

Because it works with all combinations at once, quantum computers are like having super-detectives checking 10,000 clues simultaneously instead of one by one!`
          }
        }
      }
    ]
  }
];

// Helper to generate dynamic mock responses based on the question
export function generateDynamicModelResponses(prompt) {
  const cleanPrompt = prompt.trim();
  const wordCount = cleanPrompt.split(/\s+/).length;

  return {
    'gpt-4o': {
      modelId: 'gpt-4o',
      modelName: 'GPT-4o',
      latency: `${(0.8 + Math.random() * 0.6).toFixed(1)}s`,
      tokens: Math.floor(250 + Math.random() * 200),
      content: generateModelAAnswer(cleanPrompt)
    },
    'claude-3-5-sonnet': {
      modelId: 'claude-3-5-sonnet',
      modelName: 'Claude 3.5 Sonnet',
      latency: `${(1.1 + Math.random() * 0.7).toFixed(1)}s`,
      tokens: Math.floor(280 + Math.random() * 220),
      content: generateModelBAnswer(cleanPrompt)
    },
    'gemini-1-5-pro': {
      modelId: 'gemini-1-5-pro',
      modelName: 'Gemini 1.5 Pro',
      latency: `${(0.7 + Math.random() * 0.5).toFixed(1)}s`,
      tokens: Math.floor(300 + Math.random() * 250),
      content: generateModelCAnswer(cleanPrompt)
    }
  };
}

function generateModelAAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('code') || p.includes('function') || p.includes('react') || p.includes('javascript') || p.includes('python')) {
    return `Here is a clean, production-ready solution for your request:

### Implementation
\`\`\`javascript
// Structured, highly optimized handler
async function handleRequest(input, options = {}) {
  try {
    const config = {
      timeout: options.timeout || 5000,
      retries: options.retries || 3,
      ...options
    };
    
    // Execute core workflow
    const result = await processInput(input, config);
    return { success: true, data: result, timestamp: Date.now() };
  } catch (error) {
    console.error('[ServiceError]:', error.message);
    return { success: false, error: error.message };
  }
}
\`\`\`

### Key Takeaways:
1. **Error Handling**: Graceful fallback with standard response signature.
2. **Configurability**: Accepts optional overrides with smart defaults.
3. **Type Safety**: Compatible with modern TypeScript definitions.`;
  }

  return `Here is a concise, structured breakdown for **"${prompt}"**:

### 1. Core Summary
This concept focuses on efficiency, modularity, and scalability in modern workflows.

### 2. Key Highlights & Action Steps
- **Primary Objective**: Clarify the core goal and eliminate unnecessary overhead.
- **Workflow Strategy**: Break the process down into discrete, testable phases.
- **Best Practice**: Continuously validate outputs against expected benchmarks.

### 3. Practical Example
Think of it like an assembly line where each station validates quality before handing off to the next stage.

> **Recommendation**: Start with a lean prototype first, measure performance bottlenecks, and iterate iteratively.`;
}

function generateModelBAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('code') || p.includes('function') || p.includes('react') || p.includes('javascript') || p.includes('python')) {
    return `Let's approach this thoughtfully with an emphasis on maintainability, edge cases, and clean architecture.

### Architectural Approach
When implementing this logic, we want to ensure separation of concerns and deterministic behavior:

\`\`\`typescript
interface ProcessConfig {
  retries?: number;
  backoffMs?: number;
  onRetry?: (attempt: number, err: Error) => void;
}

export class RobustProcessor<T> {
  private readonly config: Required<ProcessConfig>;

  constructor(config: ProcessConfig = {}) {
    this.config = {
      retries: 3,
      backoffMs: 300,
      onRetry: () => {},
      ...config,
    };
  }

  async execute(task: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        return await task();
      } catch (err: any) {
        lastError = err;
        this.config.onRetry(attempt, err);
        await new Promise((r) => setTimeout(r, this.config.backoffMs * attempt));
      }
    }
    throw lastError ?? new Error('Task execution failed');
  }
}
\`\`\`

### Why this design works well:
- **Exponential Backoff**: Prevents hammering downstream services during transient spikes.
- **Observability**: Exposes lifecycle hooks for logging and metrics.`;
  }

  return `Here is an in-depth, nuanced perspective on **"${prompt}"**:

### Fundamental Context
To understand this deeply, we must look at both the foundational mechanics and modern real-world applications.

### In-Depth Analysis:
1. **The Conceptual Model**:
   It establishes a clear contract between inputs and expectations, minimizing ambiguity.
2. **Edge Cases to Watch For**:
   - Concurrency & race conditions
   - Scale variations under unexpected load
   - Failure recovery modes
3. **Trade-offs**:
   - *Simplicity vs. Granularity*: A simpler model is easier to maintain, whereas granular control offers peak performance.

### Practical Verdict:
For most production scenarios, prioritize clarity and readability first. Optimize hot paths only after gathering telemetry.`;
}

function generateModelCAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('code') || p.includes('function') || p.includes('react') || p.includes('javascript') || p.includes('python')) {
    return `### High-Performance Solution for "${prompt}"

Here is a modern, ecosystem-friendly approach:

\`\`\`javascript
// Modern ES2024 / Node.js 22 compatible implementation
import { EventEmitter } from 'node:events';

export function createReactivePipeline(sourceStream) {
  const emitter = new EventEmitter();
  
  const pipeline = {
    subscribe: (listener) => emitter.on('data', listener),
    dispatch: (payload) => {
      // Validate schema in transit
      if (!payload) return;
      emitter.emit('data', { ...payload, processedAt: performance.now() });
    },
    destroy: () => emitter.removeAllListeners()
  };

  return pipeline;
}
\`\`\`

### Comparative Advantages:
- **Zero Dependencies**: Uses standard native runtimes.
- **Ultra-low latency**: Direct event loop dispatching.
- **Extensibility**: Plugs directly into WebSockets, SSE, or worker threads.`;
  }

  return `### Comprehensive Overview: ${prompt}

Here is a multidimensional analysis covering architecture, execution, and industry standards:

#### 1. Strategic Architecture
\`\`\`
[Input Request] ➔ [Validation & Parsing] ➔ [Parallel Execution Engine] ➔ [Verified Output]
\`\`\`

#### 2. Key Pillars of Success:
* **Efficiency**: Reduces latency by caching idempotent operations.
* **Resilience**: Self-healing fallbacks ensure 99.99% uptime.
* **Interoperability**: Standardized JSON-based interfaces.

#### 3. Summary Matrix
| Feature | Traditional Approach | Modern 3-Model Approach |
| :--- | :--- | :--- |
| **Speed** | Moderate | Real-time Parallel |
| **Accuracy** | Single-point bias | Consensus / Best Pick |
| **Flexibility**| Static | Dynamic Comparison |`;
}

