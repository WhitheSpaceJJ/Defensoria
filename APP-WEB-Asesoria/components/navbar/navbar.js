class Navbar extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  async init() {
    const templateContent = await this.fetchTemplate();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateContent.content.cloneNode(true));
    this.campos();
    this._isInitialized = true; // Mark initialization as complete
    if (this._permisos) {
      this.eliminarPermisos();
    }
  }

  async fetchTemplate() {
    const template = document.createElement('template');
    const html = await (await fetch('./assets/navbar.html')).text();
    template.innerHTML = html;
    return template;
  }

  set permisos(value) {
    this._permisos = value;
    if (this._isInitialized) {
      this.eliminarPermisos();
    }
  }

  async eliminarPermisos() {
    const permisos = this._permisos;
    const elementos = await this.getElementos();
    if (!permisos.includes('ALL_SA')) {
      const elementosAEliminar = elementos.filter(elemento => !permisos.includes(elemento.id));
      elementosAEliminar.forEach(elemento => {
        elemento.remove();
      });

      // Check if there are remaining elements for each category, if not, remove the category link
      this.checkAndRemoveEmptyDropdown('dropdownServicioLink', 'dropdownNavbarServicio');
      this.checkAndRemoveEmptyDropdown('dropdownConsultaLink', 'dropdownNavbarConsulta');
      this.checkAndRemoveEmptyDropdown('dropdownRegistrosLink', 'dropdownNavbarRegistros');
    }
  }

  async getElementos() {
    const shadowRoot = this.shadowRoot;
    const permisos = [
      'AD_EMPLEADOS_SA', 'AD_JUICIOS_SA', 'AD_GENEROS_SA', 'AD_ESTADOSCIVILES_SA', 'AD_MOTIVOS_SA','AD_USUARIOS_SA',
      'AD_CATALOGOREQUISITOS_SA', 'CONSULTA_ASESORIA_SA', 'REGISTRO_ASESORIA_SA', 'TURNAR_ASESORIA_SA'
    ];
    const elementos = [];
    permisos.forEach(permiso => {
      const elemento = shadowRoot.getElementById(permiso);
      if (elemento) {
        elementos.push(elemento);
      }
    });

    return elementos;
  }



  checkAndRemoveEmptyDropdown(dropdownLinkId, dropdownContentId) {
    const shadowRoot = this.shadowRoot;
    const dropdownContent = shadowRoot.getElementById(dropdownContentId);
    if (dropdownContent) {
      const ul = dropdownContent.querySelector('ul');
      if (ul && ul.children.length === 0) {
        const dropdownLink = shadowRoot.getElementById(dropdownLinkId);
        if (dropdownLink) {
          dropdownLink.remove();
        }
        dropdownContent.remove();
      }
    }
  }


  get permisos() {
    return this._permisos;
  }

  campos() {
    const shadowRoot = this.shadowRoot;
    const dropdownServicioLink = shadowRoot.getElementById('dropdownServicioLink');
    const dropdownNavbarServicio = shadowRoot.getElementById('dropdownNavbarServicio');
    const dropdownConsultaLink = shadowRoot.getElementById('dropdownConsultaLink');
    const dropdownNavbarConsulta = shadowRoot.getElementById('dropdownNavbarConsulta');
    const dropdownRegistrosLink = shadowRoot.getElementById('dropdownRegistrosLink');
    const dropdownNavbarRegistros = shadowRoot.getElementById('dropdownNavbarRegistros');
    const mobileMenuToggle = shadowRoot.getElementById('mobile-menu-toggle');
    const navbarDropdown = shadowRoot.getElementById('navbar-dropdown');

    const toggleDropdown = (dropdown, event) => {
      event.stopPropagation();
      dropdown.classList.toggle('hidden');
    };

    const toggleMobileMenu = event => {
      event.stopPropagation();
      navbarDropdown.classList.toggle('hidden');
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    dropdownServicioLink.addEventListener('click', event => {
      toggleDropdown(dropdownNavbarServicio, event);
      dropdownNavbarConsulta.classList.add('hidden');
      dropdownNavbarRegistros.classList.add('hidden');
    });

    dropdownConsultaLink.addEventListener('click', event => {
      toggleDropdown(dropdownNavbarConsulta, event);
      dropdownNavbarServicio.classList.add('hidden');
      dropdownNavbarRegistros.classList.add('hidden');
    });

    dropdownRegistrosLink.addEventListener('click', event => {
      toggleDropdown(dropdownNavbarRegistros, event);
      dropdownNavbarServicio.classList.add('hidden');
      dropdownNavbarConsulta.classList.add('hidden');
    });

    document.addEventListener('click', event => {
      if (!shadowRoot.contains(event.target)) {
        dropdownNavbarServicio.classList.add('hidden');
        dropdownNavbarConsulta.classList.add('hidden');
        dropdownNavbarRegistros.classList.add('hidden');
        navbarDropdown.classList.add('hidden');
      }
    });

    shadowRoot.getElementById('btn-logout').addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = '../login.html';
    });
  }
}

customElements.define('navbar-comp', Navbar);
