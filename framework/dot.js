class Dot {
  constructor() {
    this.state = {};
    this.routes = {};
    this.rootElement = null;
    this.rootComponent = null;
    window.addEventListener('popstate', () => this.render());
  }

  // --- NEW: HTTP MODULE ---
  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error("Fetch error: ", e);
      return null;
    }
  }

  // --- NEW: PERFORMANCE (LAZY RENDERING) ---
  // Renders only items currently visible in the viewport
  lazy(items, renderItem) {
    const container = this.el('div', { class: 'dot-lazy-container' });
    
    // We use a small internal state to track visibility
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            const content = this.createElement(renderItem(items[index], index));
            entry.target.innerHTML = '';
            entry.target.appendChild(content);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('.dot-lazy-placeholder').forEach(el => observer.observe(el));
    }, 0);

    return this.el('div', { class: 'lazy-list' }, 
      ...items.map((_, i) => this.el('div', { 
        class: 'dot-lazy-placeholder', 
        'data-index': i,
        style: 'min-height: 30px; border-bottom: 1px solid #eee'
      }, 'Loading...'))
    );
  }

  // --- CORE RENDERING ENGINE ---
  el(tag, props = {}, ...children) {
    return { tag, props, children: children.flat() };
  }

  createElement(node) {
    if (typeof node === 'string' || typeof node === 'number') return document.createTextNode(node);
    const element = document.createElement(node.tag);
    Object.entries(node.props || {}).forEach(([name, value]) => {
      if (name.startsWith('on')) {
        element.addEventListener(name.toLowerCase().substring(2), value);
      } else {
        element.setAttribute(name, value);
      }
    });
    node.children.forEach(child => {
      if (child) element.appendChild(this.createElement(child));
    });
    return element;
  }

  initState(initialState) {
    this.state = new Proxy(initialState, {
      set: (target, key, value) => {
        target[key] = value;
        this.render();
        return true;
      }
    });
    return this.state;
  }

  route(path, component) { this.routes[path] = component; }
  navigate(path) { window.history.pushState({}, '', path); this.render(); }

  mount(selector, rootComponent) {
    this.rootElement = document.querySelector(selector);
    this.rootComponent = rootComponent;
    this.render();
  }

  render() {
    const path = window.location.pathname;
    const component = this.routes[path] || this.rootComponent;
    this.rootElement.innerHTML = '';
    this.rootElement.appendChild(this.createElement(component()));
  }
}

export const dot = new Dot();