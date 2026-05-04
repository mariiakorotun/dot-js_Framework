import { dot } from '../framework/dot.js';

// 1. Unified State
const state = dot.initState({
  tasks: ['Build a framework', 'Drink coffee'],
  inputValue: '',
  remoteData: [],
  hugeList: Array.from({ length: 10000 }, (_, i) => `Performance Item #${i + 1}`),
  loading: false
});

// 2. Reusable Components
const Nav = () => dot.el('nav', { class: 'nav' },
  dot.el('button', { onclick: () => dot.navigate('/') }, 'Tasks'),
  dot.el('button', { onclick: () => dot.navigate('/data') }, 'HTTP & Perf'),
  dot.el('button', { onclick: () => dot.navigate('/about') }, 'About')
);

const TaskItem = (text, index) => 
  dot.el('li', { style: 'display: flex; justify-content: space-between; margin: 5px 0;' },
    text,
    dot.el('button', { onclick: () => state.tasks = state.tasks.filter((_, i) => i !== index) }, 'Done')
  );

// 3. Views
const TaskView = () => dot.el('div', { class: 'card' },
  Nav(),
  dot.el('h2', {}, 'Task Queue'),
  dot.el('input', { 
    value: state.inputValue,
    oninput: (e) => state.inputValue = e.target.value 
  }),
  dot.el('button', { 
    onclick: () => {
      if(state.inputValue) {
        state.tasks = [...state.tasks, state.inputValue];
        state.inputValue = '';
      }
    }
  }, 'Add Task'),
  dot.el('ul', {}, ...state.tasks.map((t, i) => TaskItem(t, i)))
);

const DataView = () => dot.el('div', { class: 'card' },
  Nav(),
  dot.el('h2', {}, 'Remote Data & Lazy Load'),
  dot.el('button', { 
    onclick: async () => {
      state.loading = true;
      const data = await dot.fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      state.remoteData = data || [];
      state.loading = false;
    }
  }, state.loading ? 'Loading...' : 'Fetch Posts'),
  dot.el('ul', {}, ...state.remoteData.map(post => dot.el('li', {}, post.title))),
  dot.el('hr'),
  dot.el('h3', {}, '10k Item Lazy List'),
  dot.el('div', { style: 'height: 200px; overflow-y: auto; background: #f9f9f9;' },
    dot.lazy(state.hugeList, (item) => dot.el('div', { style: 'padding: 5px; border-bottom: 1px solid #eee' }, item))
  )
);

const AboutView = () => dot.el('div', { class: 'card' },
  Nav(),
  dot.el('h2', {}, 'About dot-js'),
  dot.el('p', {}, 'A lightweight, zero-dependency framework featuring:'),
  dot.el('ul', {},
    dot.el('li', {}, 'Proxy-based reactivity'),
    dot.el('li', {}, 'Intersection Observer lazy rendering'),
    dot.el('li', {}, 'Push-state routing')
  )
);

// 4. Initialization
dot.route('/', TaskView);
dot.route('/data', DataView);
dot.route('/about', AboutView);

dot.mount('#app', TaskView);