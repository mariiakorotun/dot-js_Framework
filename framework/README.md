dot-js Framework
dot-js is a minimalist, dependency-free JavaScript framework. It is designed to allow developers to build reactive user interfaces using pure JavaScript, avoiding the overhead of a Virtual DOM or complex build toolchains.

Architecture and Design Principles
The framework is built upon three core concepts:

Reactive State: Utilizes JavaScript Proxy objects to monitor data changes and trigger automatic UI updates.

Functional Components: User interfaces are described as pure functions that return element structures.

Unidirectional Data Flow: State is passed into components, while user interactions trigger state updates that initiate re-rendering.

Installation
To integrate the framework, include the dot.js file in your project directory and import it as a module:
<script type="module">
  import { dot } from './framework/dot.js';
</script>
Core Features
DOM Manipulation and Components
Element creation is handled via the dot.el(tag, props, ...children) method. This allows for dynamic creation and nesting of HTML elements without relying on manual getElementById calls.

State Management
The dot.initState(object) method initializes a reactive state. Any mutation to this state object automatically re-renders the active view. This state is globally accessible across different components and pages.

Routing
The framework provides built-in management for the browser History API:
dot.route('/path', Component): Registers a URL path to a specific component.
dot.navigate('/path'): Programmatically updates the URL and view without a full page refresh.

Event Handling
Events are registered through the properties object using standard naming conventions (e.g., onclick, oninput). The framework supports preventing default browser behavior and event delegation within these listeners.

HTTP and Performance
HTTP Requests: Includes a built-in dot.fetch(url, options) wrapper for retrieving data from remote APIs.

Lazy Rendering: The dot.lazy method implements the Intersection Observer API to render only elements currently in the viewport. This ensures high performance even when handling lists exceeding 10,000 items.

Implementation Example
import { dot } from './framework/dot.js';
const state = dot.initState({ count: 0 });
const Counter = () => 
  dot.el('div', { class: 'container' },
    dot.el('h1', {}, `Count: ${state.count}`),
    dot.el('button', { onclick: () => state.count++ }, 'Increment')
  );
dot.mount('#app', Counter);

Directory Structure
/framework: Contains the core source code and technical documentation.
/example: A demonstration project (Task Queue) utilizing all framework features, including routing and remote data fetching.