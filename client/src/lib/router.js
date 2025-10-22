// Classe Router avec paramètres dynamiques, guards et layouts
class Router {
  constructor(id, options = {}) {
    let root = document.getElementById(id);

    if (!root) {
      root = document.createElement('div');
      console.warn(`Element with id "${id}" not found. Creating a new div as root.`);
      document.body.appendChild(root);
    }

    this.root = root;
    this.routes = [];
    this.layouts = {};
    this.currentRoute = null;
    this.isAuthenticated = false;
    this.loginPath = options.loginPath || '/login';
    
    // Écouter les changements d'URL
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercepter les clics sur les liens
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }
  
  // Définir l'état d'authentification
  setAuth(isAuth) {
    this.isAuthenticated = isAuth;
  }
  
  // Enregistrer un layout pour un segment de route
  addLayout(pathPrefix, layoutFn) {
    this.layouts[pathPrefix] = layoutFn;
    return this;
  }
  
  // Trouver le layout correspondant à un chemin
  findLayout(path) {
    // Chercher le segment le plus spécifique (le plus long qui match)
    let matchedLayout = null;
    let longestMatch = 0;
    
    for (const [prefix, layout] of Object.entries(this.layouts)) {
      if (path.startsWith(prefix) && prefix.length > longestMatch) {
        matchedLayout = layout;
        longestMatch = prefix.length;
      }
    }
    
    return matchedLayout;
  }
  
  // Ajouter une route
  addRoute(path, handler, options = {}) {
    const regex = this.pathToRegex(path);
    const keys = this.extractParams(path);
    this.routes.push({ 
      path, 
      regex, 
      keys, 
      handler,
      requireAuth: options.requireAuth || false,
      useLayout: options.useLayout !== false // true par défaut
    });
    return this;
  }
  
  // Convertir un chemin en regex
  pathToRegex(path) {
    if (path === '*') return /.*/;
    
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^\\/]+)')
      .replace(/\*/g, '.*');
    
    return new RegExp('^' + pattern + '$');
  }
  
  // Extraire les noms des paramètres
  extractParams(path) {
    const params = [];
    const matches = path.matchAll(/:(\w+)/g);
    for (const match of matches) {
      params.push(match[1]);
    }
    return params;
  }
  
  // Extraire les valeurs des paramètres
  getParams(route, path) {
    const matches = path.match(route.regex);
    if (!matches) return {};
    
    const params = {};
    route.keys.forEach((key, i) => {
      params[key] = matches[i + 1];
    });
    return params;
  }
  
  // Naviguer vers une route
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }
  
  // Gérer la route actuelle
  handleRoute() {
    const path = window.location.pathname;
    
    // Trouver la route correspondante
    for (const route of this.routes) {
      if (route.regex.test(path)) {
        // Vérifier l'authentification si nécessaire
        if (route.requireAuth && !this.isAuthenticated) {
          sessionStorage.setItem('redirectAfterLogin', path);
          this.navigate(this.loginPath);
          return;
        }
        
        this.currentRoute = path;
        const params = this.getParams(route, path);
        
        // Générer le contenu de la page
        const content = route.handler(params);
        
        if (content instanceof Promise) {
          // Le handler retourne une promesse
          content.then(res => {
            this.renderContent(res, route, path);
          });
        } else {
          // Le handler retourne directement le contenu
          this.renderContent(content, route, path);
        }
        return;
      }
    }
    
    // Route 404 si aucune correspondance
    const notFound = this.routes.find(r => r.path === '*');
    if (notFound) {
      const content = notFound.handler({});
      this.root.innerHTML = content;
    }
  }
  
 // Dans la méthode renderContent
renderContent(content, route, path) {
    if (route.useLayout !== false) {
      const layout = this.findLayout(path);
      if (layout) {
        const layoutContent = layout();
        
        // ✅ Gérer le cas où le layout est asynchrone (retourne une Promise)
        if (layoutContent instanceof Promise) {
          layoutContent.then(layoutDOM => {
            const slot = layoutDOM.querySelector('slot:not([name])');
            if (slot) {
              if (typeof content === 'string') {
                slot.innerHTML = content;
              } else {
                slot.replaceWith(content);
              }
            }
            this.root.innerHTML = '';
            this.root.appendChild(layoutDOM);
            this.attachEventListeners(path);
          });
          return; // ✅ Sortir ici pour éviter l'exécution du code synchrone
        }
        
        // Cas synchrone (code existant)
        const slot = layoutContent.querySelector('slot:not([name])');
        if (slot) {
          if (typeof content === 'string') {
            slot.innerHTML = content;
          } else {
            slot.replaceWith(content);
          }
        }
        this.root.innerHTML = '';
        this.root.appendChild(layoutContent);
        this.attachEventListeners(path);
        return;
      }
    }
    
    // Pas de layout
    this.root.innerHTML = '';
    if (typeof content === 'string') {
      this.root.innerHTML = content;
    } else {
      this.root.appendChild(content);
    }
    this.attachEventListeners(path);
}
  
  // Attacher les event listeners après le rendu
  attachEventListeners(path) {
    // Event listener pour le bouton de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.login();
      });
    }
    
    // Event listener pour le bouton de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }
  
  // Se connecter et rediriger vers la page demandée
  login() {
    this.setAuth(true);
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    this.navigate(redirect || '/dashboard');
  }
  
  // Se déconnecter
  logout() {
    this.setAuth(false);
    this.navigate(this.loginPath);
  }
  
  // Démarrer le routeur
  start() {
    this.handleRoute();
  }
}

export { Router };