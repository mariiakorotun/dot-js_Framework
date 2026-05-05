class Dot {
  constructor() {
    this.state = {};
    this.components = {};
    this.routes = {};
    this.template = '';
  }

  // Реєстрація компонентів для пошуку в шаблоні
  component(name, func) {
    this.components[name.toUpperCase()] = func;
  }

  // Ініціалізація стану з Proxy
  initState(initial) {
    this.state = new Proxy(initial, {
      set: (target, key, value) => {
        target[key] = value;
        this.updateUI();
        return true;
      }
    });
    return this.state;
  }

  // Завантаження HTML-файлу як шаблону
  async loadTemplate(url) {
    const response = await fetch(url);
    this.template = await response.text();
  }

  // Основна функція парсингу
  compile(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Шукаємо кастомні компоненти (наприклад, <my-todo-list>)
    Object.keys(this.components).forEach(tagName => {
      const elements = doc.querySelectorAll(tagName);
      elements.forEach(el => {
        const componentHTML = this.components[tagName](this.state);
        el.outerHTML = componentHTML;
      });
    });

    return doc.body.innerHTML;
  }

  updateUI() {
    const appContainer = document.querySelector('#app');
    // Визначаємо, який шаблон рендерити (Routing)
    const currentPath = window.location.pathname;
    const view = this.routes[currentPath] || this.template;
    
    appContainer.innerHTML = this.compile(view);
    this.bindEvents();
  }

  // Прив'язка подій після оновлення innerHTML
  bindEvents() {
    document.querySelectorAll('[on-click]').forEach(el => {
      const action = el.getAttribute('on-click');
      el.onclick = () => new Function('state', action)(this.state);
    });
  }

  route(path, template) {
    this.routes[path] = template;
  }

  mount(selector) {
    window.addEventListener('popstate', () => this.updateUI());
    this.updateUI();
  }
}

export const dot = new Dot();