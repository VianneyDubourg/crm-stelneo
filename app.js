// CRM Application Logic
class CRMApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.setupCharts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Global search
        document.getElementById('global-search').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Add buttons
        document.getElementById('add-new-btn').addEventListener('click', () => {
            this.showAddModal();
        });

        document.getElementById('add-client-btn').addEventListener('click', () => {
            this.showClientModal();
        });

        document.getElementById('add-lead-btn').addEventListener('click', () => {
            this.showLeadModal();
        });

        document.getElementById('add-order-btn').addEventListener('click', () => {
            this.showOrderModal();
        });

        document.getElementById('add-contact-btn').addEventListener('click', () => {
            this.showContactModal();
        });

        document.getElementById('add-template-btn').addEventListener('click', () => {
            this.showTemplateModal();
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // Filters
        document.getElementById('client-status-filter').addEventListener('change', () => {
            this.loadClients();
        });

        document.getElementById('lead-source-filter').addEventListener('change', () => {
            this.loadLeads();
        });

        document.getElementById('lead-priority-filter').addEventListener('change', () => {
            this.loadLeads();
        });

        document.getElementById('lead-status-filter').addEventListener('change', () => {
            this.loadLeads();
        });

        document.getElementById('contact-type-filter').addEventListener('change', () => {
            this.loadContacts();
        });

        // Import file handler
        document.getElementById('import-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importData(e.target.files[0]);
            }
        });
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Tableau de bord',
            clients: 'Gestion des Clients',
            leads: 'Gestion des Leads',
            orders: 'Gestion des Commandes',
            contacts: 'Historique des Contacts',
            templates: 'Templates d\'Emails',
            analytics: 'Analytics et Statistiques',
            settings: 'Paramètres et Outils'
        };
        document.getElementById('page-title').textContent = titles[section];

        // Update add button
        const addButton = document.getElementById('add-new-btn');
        const addTexts = {
            dashboard: 'Nouveau',
            clients: 'Nouveau Client',
            leads: 'Nouveau Lead',
            orders: 'Nouvelle Commande',
            contacts: 'Nouveau Contact',
            templates: 'Nouveau Template',
            analytics: 'Nouveau',
            settings: 'Nouveau'
        };
        addButton.innerHTML = `<i class="fas fa-plus"></i> ${addTexts[section]}`;

        this.currentSection = section;

        // Load section data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'clients':
                this.loadClients();
                break;
            case 'leads':
                this.loadLeads();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'contacts':
                this.loadContacts();
                break;
            case 'templates':
                this.loadTemplates();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    loadDashboard() {
        const analytics = crmData.getAnalytics();
        const activities = crmData.getRecentActivities();

        // Update stats
        document.getElementById('total-clients').textContent = analytics.stats.totalClients;
        document.getElementById('total-leads').textContent = analytics.stats.totalLeads;
        document.getElementById('total-orders').textContent = analytics.stats.totalOrders;
        document.getElementById('total-revenue').textContent = `${analytics.stats.totalRevenue}€`;

        // Load recent activities
        const activitiesList = document.getElementById('recent-activities-list');
        activitiesList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background-color: ${activity.color}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">
                    ${this.formatDate(activity.time)}
                </div>
            </div>
        `).join('');

        // Load dashboard widgets
        this.loadDashboardWidgets();

        // Update charts
        this.updateCharts(analytics);
    }

    loadClients() {
        const clients = crmData.getClients();
        const statusFilter = document.getElementById('client-status-filter').value;
        
        let filteredClients = clients;
        if (statusFilter) {
            filteredClients = clients.filter(client => client.status === statusFilter);
        }

        const tbody = document.getElementById('clients-tbody');
        tbody.innerHTML = filteredClients.map(client => `
            <tr>
                <td>${client.name}</td>
                <td>${client.company}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td><span class="status-badge status-${client.status}">${client.status}</span></td>
                <td>${client.lastContact ? this.formatDate(client.lastContact) : 'Jamais'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="app.editClient(${client.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="app.quickStatusChange(${client.id}, 'client')" title="Changer statut">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="app.quickAddNote(${client.id}, 'client')" title="Ajouter note">
                            <i class="fas fa-sticky-note"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.quickAddContact(${client.id})" title="Ajouter contact">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteClient(${client.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadLeads() {
        const leads = crmData.getLeads();
        const sourceFilter = document.getElementById('lead-source-filter').value;
        const priorityFilter = document.getElementById('lead-priority-filter').value;
        const statusFilter = document.getElementById('lead-status-filter').value;
        
        let filteredLeads = leads;
        if (sourceFilter) {
            filteredLeads = filteredLeads.filter(lead => lead.source === sourceFilter);
        }
        if (priorityFilter) {
            filteredLeads = filteredLeads.filter(lead => lead.priority === priorityFilter);
        }
        if (statusFilter) {
            filteredLeads = filteredLeads.filter(lead => lead.status === statusFilter);
        }

        const tbody = document.getElementById('leads-tbody');
        tbody.innerHTML = filteredLeads.map(lead => `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.company}</td>
                <td>${lead.email}</td>
                <td>${lead.source}</td>
                <td><span class="status-badge status-${lead.status.replace(/\s+/g, '-')}">${lead.status}</span></td>
                <td>${lead.priority || 'Medium'}</td>
                <td>${lead.service || 'Non défini'}</td>
                <td>${this.formatDate(lead.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="app.editLead(${lead.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.convertLead(${lead.id})" title="Convertir en client">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="app.quickStatusChange(${lead.id}, 'lead')" title="Changer statut">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="app.quickAddNote(${lead.id}, 'lead')" title="Ajouter note">
                            <i class="fas fa-sticky-note"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteLead(${lead.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadOrders() {
        const orders = crmData.getOrders();
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.orderNumber}</td>
                <td>${order.clientName}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>${order.unitPrice}€</td>
                <td>${order.total}€</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="app.editOrder(${order.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="app.quickStatusChangeOrder(${order.id})" title="Changer statut">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="app.duplicateOrder(${order.id})" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteOrder(${order.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadContacts() {
        const contacts = crmData.getContacts();
        const typeFilter = document.getElementById('contact-type-filter').value;
        
        let filteredContacts = contacts;
        if (typeFilter) {
            filteredContacts = contacts.filter(contact => contact.type === typeFilter);
        }

        const tbody = document.getElementById('contacts-tbody');
        tbody.innerHTML = filteredContacts.map(contact => `
            <tr>
                <td>${this.formatDate(contact.createdAt)}</td>
                <td>${contact.clientName}</td>
                <td>${contact.type}</td>
                <td>${contact.subject}</td>
                <td>${contact.summary}</td>
                <td>${contact.user}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="app.editContact(${contact.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="app.duplicateContact(${contact.id})" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteContact(${contact.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadTemplates() {
        const templates = crmData.getEmailTemplates();
        const grid = document.getElementById('templates-grid');
        grid.innerHTML = templates.map(template => `
            <div class="template-card">
                <div class="template-header">
                    <div class="template-title">${template.name}</div>
                    <div class="template-actions">
                        <button class="btn btn-sm btn-primary" onclick="app.editTemplate(${template.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="app.useTemplate(${template.id})" title="Utiliser">
                            <i class="fas fa-envelope"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="app.duplicateTemplate(${template.id})" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteTemplate(${template.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="template-preview">
                    <strong>Sujet:</strong> ${template.subject}<br>
                    <strong>Contenu:</strong> ${template.content.substring(0, 100)}...
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        const analytics = crmData.getAnalytics();
        this.updateAnalyticsCharts(analytics);
    }

    setupCharts() {
        // Initialize chart containers
        this.charts.clientsOrigin = new Chart(document.getElementById('clients-origin-chart'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        this.charts.salesEvolution = new Chart(document.getElementById('sales-evolution-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Commandes',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.charts.monthlyPerformance = new Chart(document.getElementById('monthly-performance-chart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Commandes',
                    data: [],
                    backgroundColor: '#667eea'
                }, {
                    label: 'CA (€)',
                    data: [],
                    backgroundColor: '#764ba2',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });

        this.charts.packagingTypes = new Chart(document.getElementById('packaging-types-chart'), {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        this.charts.leadSources = new Chart(document.getElementById('lead-sources-chart'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    updateCharts(analytics) {
        // Update clients origin chart
        this.charts.clientsOrigin.data.labels = Object.keys(analytics.clientOrigins);
        this.charts.clientsOrigin.data.datasets[0].data = Object.values(analytics.clientOrigins);
        this.charts.clientsOrigin.update();

        // Update sales evolution chart
        this.charts.salesEvolution.data.labels = analytics.monthlyPerformance.map(p => p.month);
        this.charts.salesEvolution.data.datasets[0].data = analytics.monthlyPerformance.map(p => p.orders);
        this.charts.salesEvolution.update();
    }

    updateAnalyticsCharts(analytics) {
        // Update monthly performance chart
        this.charts.monthlyPerformance.data.labels = analytics.monthlyPerformance.map(p => p.month);
        this.charts.monthlyPerformance.data.datasets[0].data = analytics.monthlyPerformance.map(p => p.orders);
        this.charts.monthlyPerformance.data.datasets[1].data = analytics.monthlyPerformance.map(p => p.revenue);
        this.charts.monthlyPerformance.update();

        // Update packaging types chart
        this.charts.packagingTypes.data.labels = Object.keys(analytics.packagingTypes);
        this.charts.packagingTypes.data.datasets[0].data = Object.values(analytics.packagingTypes);
        this.charts.packagingTypes.update();

        // Update lead sources chart
        this.charts.leadSources.data.labels = Object.keys(analytics.leadSources);
        this.charts.leadSources.data.datasets[0].data = Object.values(analytics.leadSources);
        this.charts.leadSources.update();
    }

    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        const results = crmData.search(query);
        console.log('Search results:', results);
        // You can implement a search results modal or highlight matching rows
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    showAddModal() {
        switch (this.currentSection) {
            case 'clients':
                this.showClientModal();
                break;
            case 'leads':
                this.showLeadModal();
                break;
            case 'orders':
                this.showOrderModal();
                break;
            case 'contacts':
                this.showContactModal();
                break;
            case 'templates':
                this.showTemplateModal();
                break;
        }
    }

    showClientModal(client = null) {
        const isEdit = client !== null;
        const title = isEdit ? 'Modifier le client' : 'Nouveau client';
        
        const content = `
            <form id="client-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="client-name">Nom *</label>
                        <input type="text" id="client-name" value="${client?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="client-company">Entreprise *</label>
                        <input type="text" id="client-company" value="${client?.company || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="client-email">Email *</label>
                        <input type="email" id="client-email" value="${client?.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="client-phone">Téléphone</label>
                        <input type="tel" id="client-phone" value="${client?.phone || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="client-status">Statut</label>
                        <select id="client-status">
                            <option value="à contacter" ${client?.status === 'à contacter' ? 'selected' : ''}>À contacter</option>
                            <option value="rdv pris" ${client?.status === 'rdv pris' ? 'selected' : ''}>RDV pris</option>
                            <option value="prendre rdv" ${client?.status === 'prendre rdv' ? 'selected' : ''}>Prendre RDV</option>
                            <option value="envoyer pochette" ${client?.status === 'envoyer pochette' ? 'selected' : ''}>Envoyer pochette</option>
                            <option value="pas intéresser" ${client?.status === 'pas intéresser' ? 'selected' : ''}>Pas intéressé</option>
                            <option value="à rappeler" ${client?.status === 'à rappeler' ? 'selected' : ''}>À rappeler</option>
                            <option value="appelé à relancer mail" ${client?.status === 'appelé à relancer mail' ? 'selected' : ''}>Appelé à relancer mail</option>
                            <option value="client actif" ${client?.status === 'client actif' ? 'selected' : ''}>Client actif</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="client-origin">Origine</label>
                        <select id="client-origin">
                            <option value="site-web" ${client?.origin === 'site-web' ? 'selected' : ''}>Site web</option>
                            <option value="reseaux-sociaux" ${client?.origin === 'reseaux-sociaux' ? 'selected' : ''}>Réseaux sociaux</option>
                            <option value="recommandation" ${client?.origin === 'recommandation' ? 'selected' : ''}>Recommandation</option>
                            <option value="salon" ${client?.origin === 'salon' ? 'selected' : ''}>Salon</option>
                            <option value="autre" ${client?.origin === 'autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="client-notes">Notes</label>
                    <textarea id="client-notes" placeholder="Notes sur le client...">${client?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        `;

        this.showModal(title, content);

        // Handle form submission
        document.getElementById('client-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('client-name').value,
                company: document.getElementById('client-company').value,
                email: document.getElementById('client-email').value,
                phone: document.getElementById('client-phone').value,
                status: document.getElementById('client-status').value,
                origin: document.getElementById('client-origin').value,
                notes: document.getElementById('client-notes').value
            };

            if (isEdit) {
                crmData.updateClient(client.id, formData);
            } else {
                crmData.addClient(formData);
            }

            this.closeModal();
            this.loadClients();
            this.loadDashboard();
        });
    }

    showLeadModal(lead = null) {
        const isEdit = lead !== null;
        const title = isEdit ? 'Modifier le lead' : 'Nouveau lead';
        
        const content = `
            <form id="lead-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="lead-name">Nom *</label>
                        <input type="text" id="lead-name" value="${lead?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="lead-company">Entreprise *</label>
                        <input type="text" id="lead-company" value="${lead?.company || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="lead-email">Email *</label>
                        <input type="email" id="lead-email" value="${lead?.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="lead-phone">Téléphone</label>
                        <input type="tel" id="lead-phone" value="${lead?.phone || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="lead-source">Source *</label>
                        <select id="lead-source" required>
                            <option value="site-web" ${lead?.source === 'site-web' ? 'selected' : ''}>Site web</option>
                            <option value="reseaux-sociaux" ${lead?.source === 'reseaux-sociaux' ? 'selected' : ''}>Réseaux sociaux</option>
                            <option value="recommandation" ${lead?.source === 'recommandation' ? 'selected' : ''}>Recommandation</option>
                            <option value="salon" ${lead?.source === 'salon' ? 'selected' : ''}>Salon</option>
                            <option value="internet" ${lead?.source === 'internet' ? 'selected' : ''}>Internet</option>
                            <option value="autre" ${lead?.source === 'autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="lead-priority">Priorité</label>
                        <select id="lead-priority">
                            <option value="High" ${lead?.priority === 'High' ? 'selected' : ''}>High</option>
                            <option value="Medium" ${lead?.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="Low" ${lead?.priority === 'Low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="lead-status">Statut</label>
                        <select id="lead-status">
                            <option value="à contacter" ${lead?.status === 'à contacter' ? 'selected' : ''}>À contacter</option>
                            <option value="rdv pris" ${lead?.status === 'rdv pris' ? 'selected' : ''}>RDV pris</option>
                            <option value="prendre rdv" ${lead?.status === 'prendre rdv' ? 'selected' : ''}>Prendre RDV</option>
                            <option value="envoyer pochette" ${lead?.status === 'envoyer pochette' ? 'selected' : ''}>Envoyer pochette</option>
                            <option value="pas intéresser" ${lead?.status === 'pas intéresser' ? 'selected' : ''}>Pas intéressé</option>
                            <option value="à rappeler" ${lead?.status === 'à rappeler' ? 'selected' : ''}>À rappeler</option>
                            <option value="appelé à relancer mail" ${lead?.status === 'appelé à relancer mail' ? 'selected' : ''}>Appelé à relancer mail</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="lead-service">Service/Produit</label>
                        <select id="lead-service">
                            <option value="B2C Pochette Plate" ${lead?.service === 'B2C Pochette Plate' ? 'selected' : ''}>B2C Pochette Plate</option>
                            <option value="B2B Pochette Classique" ${lead?.service === 'B2B Pochette Classique' ? 'selected' : ''}>B2B Pochette Classique</option>
                            <option value="Emballage sur mesure" ${lead?.service === 'Emballage sur mesure' ? 'selected' : ''}>Emballage sur mesure</option>
                            <option value="Autre" ${lead?.service === 'Autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="lead-notes">Notes</label>
                    <textarea id="lead-notes" placeholder="Notes sur le lead...">${lead?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        `;

        this.showModal(title, content);

        // Handle form submission
        document.getElementById('lead-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('lead-name').value,
                company: document.getElementById('lead-company').value,
                email: document.getElementById('lead-email').value,
                phone: document.getElementById('lead-phone').value,
                source: document.getElementById('lead-source').value,
                priority: document.getElementById('lead-priority').value,
                status: document.getElementById('lead-status').value,
                service: document.getElementById('lead-service').value,
                notes: document.getElementById('lead-notes').value
            };

            if (isEdit) {
                crmData.updateLead(lead.id, formData);
            } else {
                crmData.addLead(formData);
            }

            this.closeModal();
            this.loadLeads();
            this.loadDashboard();
        });
    }

    showOrderModal(order = null) {
        const isEdit = order !== null;
        const title = isEdit ? 'Modifier la commande' : 'Nouvelle commande';
        const clients = crmData.getClients();
        
        const content = `
            <form id="order-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="order-client">Client *</label>
                        <select id="order-client" required>
                            <option value="">Sélectionner un client</option>
                            ${clients.map(client => 
                                `<option value="${client.id}" ${order?.clientId === client.id ? 'selected' : ''}>${client.name} - ${client.company}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="order-product">Produit/Emballage *</label>
                        <input type="text" id="order-product" value="${order?.product || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="order-quantity">Quantité *</label>
                        <input type="number" id="order-quantity" value="${order?.quantity || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="order-unit-price">Prix unitaire (€) *</label>
                        <input type="number" step="0.01" id="order-unit-price" value="${order?.unitPrice || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="order-packaging-type">Type d'emballage</label>
                        <select id="order-packaging-type">
                            <option value="standard" ${order?.packagingType === 'standard' ? 'selected' : ''}>Standard</option>
                            <option value="premium" ${order?.packagingType === 'premium' ? 'selected' : ''}>Premium</option>
                            <option value="ecologique" ${order?.packagingType === 'ecologique' ? 'selected' : ''}>Écologique</option>
                            <option value="sur-mesure" ${order?.packagingType === 'sur-mesure' ? 'selected' : ''}>Sur mesure</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="order-status">Statut</label>
                        <select id="order-status">
                            <option value="en_attente" ${order?.status === 'en_attente' ? 'selected' : ''}>En attente</option>
                            <option value="confirmee" ${order?.status === 'confirmee' ? 'selected' : ''}>Confirmée</option>
                            <option value="en_production" ${order?.status === 'en_production' ? 'selected' : ''}>En production</option>
                            <option value="expediee" ${order?.status === 'expediee' ? 'selected' : ''}>Expédiée</option>
                            <option value="livree" ${order?.status === 'livree' ? 'selected' : ''}>Livrée</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="order-notes">Notes</label>
                    <textarea id="order-notes" placeholder="Notes sur la commande...">${order?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        `;

        this.showModal(title, content);

        // Handle form submission
        document.getElementById('order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const clientId = parseInt(document.getElementById('order-client').value);
            const client = clients.find(c => c.id === clientId);
            const quantity = parseInt(document.getElementById('order-quantity').value);
            const unitPrice = parseFloat(document.getElementById('order-unit-price').value);
            
            const formData = {
                clientId: clientId,
                clientName: client.name,
                product: document.getElementById('order-product').value,
                quantity: quantity,
                unitPrice: unitPrice,
                total: quantity * unitPrice,
                packagingType: document.getElementById('order-packaging-type').value,
                status: document.getElementById('order-status').value,
                notes: document.getElementById('order-notes').value
            };

            if (isEdit) {
                crmData.updateOrder(order.id, formData);
            } else {
                crmData.addOrder(formData);
            }

            this.closeModal();
            this.loadOrders();
            this.loadDashboard();
        });
    }

    showContactModal(contact = null) {
        const isEdit = contact !== null;
        const title = isEdit ? 'Modifier le contact' : 'Nouveau contact';
        const clients = crmData.getClients();
        const leads = crmData.getLeads();
        
        const content = `
            <form id="contact-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="contact-client">Client/Lead *</label>
                        <select id="contact-client" required>
                            <option value="">Sélectionner un client ou lead</option>
                            <optgroup label="Clients">
                                ${clients.map(client => 
                                    `<option value="client-${client.id}" ${contact?.clientId === client.id ? 'selected' : ''}>${client.name} - ${client.company}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="Leads">
                                ${leads.map(lead => 
                                    `<option value="lead-${lead.id}" ${contact?.leadId === lead.id ? 'selected' : ''}>${lead.name} - ${lead.company}</option>`
                                ).join('')}
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contact-type">Type de contact *</label>
                        <select id="contact-type" required>
                            <option value="appel" ${contact?.type === 'appel' ? 'selected' : ''}>Appel</option>
                            <option value="email" ${contact?.type === 'email' ? 'selected' : ''}>Email</option>
                            <option value="rdv" ${contact?.type === 'rdv' ? 'selected' : ''}>Rendez-vous</option>
                            <option value="autre" ${contact?.type === 'autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="contact-subject">Sujet *</label>
                    <input type="text" id="contact-subject" value="${contact?.subject || ''}" required>
                </div>
                <div class="form-group">
                    <label for="contact-summary">Résumé *</label>
                    <textarea id="contact-summary" required placeholder="Résumé de l'échange...">${contact?.summary || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="contact-follow-up">Prochaines étapes</label>
                    <textarea id="contact-follow-up" placeholder="Actions à suivre...">${contact?.followUp || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        `;

        this.showModal(title, content);

        // Handle form submission
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const clientSelection = document.getElementById('contact-client').value;
            const [type, id] = clientSelection.split('-');
            
            const formData = {
                clientId: type === 'client' ? parseInt(id) : null,
                leadId: type === 'lead' ? parseInt(id) : null,
                clientName: type === 'client' ? 
                    clients.find(c => c.id === parseInt(id))?.name : 
                    leads.find(l => l.id === parseInt(id))?.name,
                type: document.getElementById('contact-type').value,
                subject: document.getElementById('contact-subject').value,
                summary: document.getElementById('contact-summary').value,
                followUp: document.getElementById('contact-follow-up').value
            };

            if (isEdit) {
                crmData.updateContact(contact.id, formData);
            } else {
                crmData.addContact(formData);
            }

            this.closeModal();
            this.loadContacts();
            this.loadDashboard();
        });
    }

    showTemplateModal(template = null) {
        const isEdit = template !== null;
        const title = isEdit ? 'Modifier le template' : 'Nouveau template';
        
        const content = `
            <form id="template-form">
                <div class="form-group">
                    <label for="template-name">Nom du template *</label>
                    <input type="text" id="template-name" value="${template?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="template-subject">Sujet *</label>
                    <input type="text" id="template-subject" value="${template?.subject || ''}" required>
                </div>
                <div class="form-group">
                    <label for="template-content">Contenu *</label>
                    <textarea id="template-content" required placeholder="Contenu de l'email... Vous pouvez utiliser {{nom}}, {{entreprise}}, {{utilisateur}}, etc.">${template?.content || ''}</textarea>
                    <small>Variables disponibles: {{nom}}, {{entreprise}}, {{utilisateur}}, {{commande}}, {{produit}}, {{quantite}}, {{prix}}</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        `;

        this.showModal(title, content);

        // Handle form submission
        document.getElementById('template-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('template-name').value,
                subject: document.getElementById('template-subject').value,
                content: document.getElementById('template-content').value
            };

            if (isEdit) {
                crmData.updateEmailTemplate(template.id, formData);
            } else {
                crmData.addEmailTemplate(formData);
            }

            this.closeModal();
            this.loadTemplates();
        });
    }

    // CRUD Operations
    editClient(id) {
        const client = crmData.getClients().find(c => c.id === id);
        this.showClientModal(client);
    }

    deleteClient(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            crmData.deleteClient(id);
            this.loadClients();
            this.loadDashboard();
        }
    }

    editLead(id) {
        const lead = crmData.getLeads().find(l => l.id === id);
        this.showLeadModal(lead);
    }

    deleteLead(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
            crmData.deleteLead(id);
            this.loadLeads();
            this.loadDashboard();
        }
    }

    convertLead(id) {
        const lead = crmData.getLeads().find(l => l.id === id);
        if (lead) {
            // Convert lead to client
            const client = {
                name: lead.name,
                company: lead.company,
                email: lead.email,
                phone: lead.phone,
                status: 'prospect',
                origin: lead.source,
                notes: lead.notes
            };
            crmData.addClient(client);
            
            // Update lead status
            crmData.updateLead(id, { status: 'converted' });
            
            this.loadLeads();
            this.loadClients();
            this.loadDashboard();
            alert('Lead converti en client avec succès !');
        }
    }

    editOrder(id) {
        const order = crmData.getOrders().find(o => o.id === id);
        this.showOrderModal(order);
    }

    deleteOrder(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            crmData.deleteOrder(id);
            this.loadOrders();
            this.loadDashboard();
        }
    }

    editContact(id) {
        const contact = crmData.getContacts().find(c => c.id === id);
        this.showContactModal(contact);
    }

    deleteContact(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            crmData.deleteContact(id);
            this.loadContacts();
            this.loadDashboard();
        }
    }

    editTemplate(id) {
        const template = crmData.getEmailTemplates().find(t => t.id === id);
        this.showTemplateModal(template);
    }

    deleteTemplate(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
            crmData.deleteEmailTemplate(id);
            this.loadTemplates();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Settings and Advanced Features
    loadSettings() {
        const data = crmData.getData();
        document.getElementById('current-user').value = data.settings.currentUser;
    }

    exportData() {
        crmData.exportData();
        this.showMessage('Données exportées avec succès !', 'success');
    }

    importData(file) {
        crmData.importData(file)
            .then(() => {
                this.showMessage('Données importées avec succès !', 'success');
                this.loadDashboard();
                this.loadClients();
                this.loadLeads();
                this.loadOrders();
                this.loadContacts();
                this.loadTemplates();
            })
            .catch(error => {
                this.showMessage('Erreur lors de l\'import : ' + error.message, 'error');
            });
    }

    exportToExcel() {
        const data = crmData.getData();
        const leads = data.leads;
        const clients = data.clients;
        
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Leads header
        csvContent += "Type,Nom,Entreprise,Email,Téléphone,Source,Priorité,Statut,Service,Notes,Date Création\n";
        
        // Leads data
        leads.forEach(lead => {
            const row = [
                'Lead',
                lead.name,
                lead.company,
                lead.email,
                lead.phone,
                lead.source,
                lead.priority || 'Medium',
                lead.status,
                lead.service || 'Non défini',
                lead.notes.replace(/,/g, ';'),
                this.formatDate(lead.createdAt)
            ].join(',');
            csvContent += row + "\n";
        });
        
        // Clients data
        clients.forEach(client => {
            const row = [
                'Client',
                client.name,
                client.company,
                client.email,
                client.phone,
                client.origin,
                'N/A',
                client.status,
                'N/A',
                client.notes.replace(/,/g, ';'),
                this.formatDate(client.createdAt)
            ].join(',');
            csvContent += row + "\n";
        });
        
        // Download file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `crm-stelneo-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Export Excel généré avec succès !', 'success');
    }

    updateCurrentUser() {
        const newUser = document.getElementById('current-user').value;
        if (newUser.trim()) {
            const data = crmData.getData();
            data.settings.currentUser = newUser.trim();
            crmData.saveData(data);
            this.showMessage('Utilisateur mis à jour !', 'success');
        }
    }

    clearAllData() {
        if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible !')) {
            if (confirm('Dernière confirmation : toutes vos données seront perdues !')) {
                localStorage.removeItem('crm_data');
                crmData.initializeData();
                this.showMessage('Toutes les données ont été supprimées.', 'info');
                this.loadDashboard();
                this.loadClients();
                this.loadLeads();
                this.loadOrders();
                this.loadContacts();
                this.loadTemplates();
            }
        }
    }

    showRemindersSettings() {
        const content = `
            <div class="reminders-settings">
                <h4>Configuration des Rappels</h4>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="reminder-enabled" checked>
                        Activer les rappels automatiques
                    </label>
                </div>
                <div class="form-group">
                    <label for="reminder-interval">Intervalle de vérification (minutes)</label>
                    <input type="number" id="reminder-interval" value="30" min="5" max="1440">
                </div>
                <div class="form-group">
                    <label for="reminder-days">Jours d'avance pour les rappels</label>
                    <input type="number" id="reminder-days" value="1" min="0" max="30">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.saveRemindersSettings()">Sauvegarder</button>
                </div>
            </div>
        `;
        
        this.showModal('Configuration des Rappels', content);
    }

    saveRemindersSettings() {
        const enabled = document.getElementById('reminder-enabled').checked;
        const interval = parseInt(document.getElementById('reminder-interval').value);
        const days = parseInt(document.getElementById('reminder-days').value);
        
        const data = crmData.getData();
        data.settings.reminders = {
            enabled: enabled,
            interval: interval,
            days: days
        };
        crmData.saveData(data);
        
        this.closeModal();
        this.showMessage('Configuration des rappels sauvegardée !', 'success');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of the content
        const content = document.querySelector('.content');
        content.insertBefore(messageDiv, content.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    // Quick Actions
    quickStatusChange(id, type) {
        const statuses = [
            'à contacter',
            'rdv pris', 
            'prendre rdv',
            'envoyer pochette',
            'pas intéresser',
            'à rappeler',
            'appelé à relancer mail'
        ];

        const content = `
            <div class="quick-status-change">
                <h4>Changer le statut</h4>
                <div class="form-group">
                    <label for="new-status">Nouveau statut</label>
                    <select id="new-status">
                        ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.confirmStatusChange(${id}, '${type}')">Confirmer</button>
                </div>
            </div>
        `;

        this.showModal('Changement de Statut', content);
    }

    confirmStatusChange(id, type) {
        const newStatus = document.getElementById('new-status').value;
        
        if (type === 'lead') {
            crmData.updateLead(id, { status: newStatus });
            this.loadLeads();
        } else if (type === 'client') {
            crmData.updateClient(id, { status: newStatus });
            this.loadClients();
        }
        
        this.closeModal();
        this.showMessage('Statut mis à jour !', 'success');
    }

    quickAddNote(id, type) {
        const content = `
            <div class="quick-add-note">
                <h4>Ajouter une note</h4>
                <div class="form-group">
                    <label for="new-note">Note</label>
                    <textarea id="new-note" placeholder="Ajoutez votre note..." rows="4"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.confirmAddNote(${id}, '${type}')">Ajouter</button>
                </div>
            </div>
        `;

        this.showModal('Ajouter une Note', content);
    }

    confirmAddNote(id, type) {
        const newNote = document.getElementById('new-note').value;
        const currentDate = new Date().toLocaleDateString('fr-FR');
        const currentUser = crmData.getData().settings.currentUser;
        
        if (type === 'lead') {
            const lead = crmData.getLeads().find(l => l.id === id);
            const updatedNotes = lead.notes + `\n\n[${currentDate} - ${currentUser}] ${newNote}`;
            crmData.updateLead(id, { notes: updatedNotes });
            this.loadLeads();
        } else if (type === 'client') {
            const client = crmData.getClients().find(c => c.id === id);
            const updatedNotes = client.notes + `\n\n[${currentDate} - ${currentUser}] ${newNote}`;
            crmData.updateClient(id, { notes: updatedNotes });
            this.loadClients();
        }
        
        this.closeModal();
        this.showMessage('Note ajoutée !', 'success');
    }

    quickAddContact(clientId) {
        const client = crmData.getClients().find(c => c.id === clientId);
        if (!client) return;

        const content = `
            <div class="quick-add-contact">
                <h4>Ajouter un contact pour ${client.name}</h4>
                <div class="form-group">
                    <label for="contact-type-quick">Type de contact</label>
                    <select id="contact-type-quick">
                        <option value="appel">Appel</option>
                        <option value="email">Email</option>
                        <option value="rdv">Rendez-vous</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contact-subject-quick">Sujet</label>
                    <input type="text" id="contact-subject-quick" placeholder="Sujet du contact">
                </div>
                <div class="form-group">
                    <label for="contact-summary-quick">Résumé</label>
                    <textarea id="contact-summary-quick" placeholder="Résumé de l'échange..." rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.confirmQuickContact(${clientId})">Ajouter</button>
                </div>
            </div>
        `;

        this.showModal('Ajouter un Contact', content);
    }

    confirmQuickContact(clientId) {
        const type = document.getElementById('contact-type-quick').value;
        const subject = document.getElementById('contact-subject-quick').value;
        const summary = document.getElementById('contact-summary-quick').value;
        
        if (!subject || !summary) {
            this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const client = crmData.getClients().find(c => c.id === clientId);
        const contactData = {
            clientId: clientId,
            clientName: client.name,
            type: type,
            subject: subject,
            summary: summary
        };

        crmData.addContact(contactData);
        this.closeModal();
        this.showMessage('Contact ajouté !', 'success');
        this.loadContacts();
        this.loadClients();
        this.loadDashboard();
    }

    loadDashboardWidgets() {
        const data = crmData.getData();
        
        // Actions à faire
        const todoItems = [];
        data.leads.forEach(lead => {
            if (lead.status === 'à contacter' || lead.status === 'prendre rdv' || lead.status === 'envoyer pochette') {
                todoItems.push({
                    name: lead.name,
                    company: lead.company,
                    action: lead.status,
                    priority: lead.priority || 'Medium'
                });
            }
        });
        data.clients.forEach(client => {
            if (client.status === 'à contacter' || client.status === 'prendre rdv' || client.status === 'envoyer pochette') {
                todoItems.push({
                    name: client.name,
                    company: client.company,
                    action: client.status,
                    priority: 'High'
                });
            }
        });

        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = todoItems.slice(0, 5).map(item => `
            <li>
                <span>${item.name} - ${item.company}</span>
                <span class="status priority-${item.priority.toLowerCase()}">${item.action}</span>
            </li>
        `).join('') || '<li>Aucune action à faire</li>';

        // À rappeler
        const callbackItems = [];
        data.leads.forEach(lead => {
            if (lead.status === 'à rappeler' || lead.status === 'appelé à relancer mail') {
                callbackItems.push({
                    name: lead.name,
                    company: lead.company,
                    phone: lead.phone,
                    priority: lead.priority || 'Medium'
                });
            }
        });
        data.clients.forEach(client => {
            if (client.status === 'à rappeler' || client.status === 'appelé à relancer mail') {
                callbackItems.push({
                    name: client.name,
                    company: client.company,
                    phone: client.phone,
                    priority: 'High'
                });
            }
        });

        const callbackList = document.getElementById('callback-list');
        callbackList.innerHTML = callbackItems.slice(0, 5).map(item => `
            <li>
                <span>${item.name} - ${item.company}</span>
                <span class="status priority-${item.priority.toLowerCase()}">${item.phone}</span>
            </li>
        `).join('') || '<li>Aucun rappel prévu</li>';

        // RDV à venir
        const upcomingMeetings = [];
        data.contacts.forEach(contact => {
            if (contact.type === 'rdv' && contact.subject.toLowerCase().includes('rdv')) {
                const contactDate = new Date(contact.createdAt);
                const now = new Date();
                const diffTime = contactDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays >= 0 && diffDays <= 7) {
                    upcomingMeetings.push({
                        name: contact.clientName,
                        subject: contact.subject,
                        date: contact.createdAt,
                        daysLeft: diffDays
                    });
                }
            }
        });

        const meetingsList = document.getElementById('upcoming-meetings');
        meetingsList.innerHTML = upcomingMeetings.slice(0, 5).map(meeting => `
            <li>
                <span>${meeting.name}</span>
                <span class="status">${meeting.daysLeft === 0 ? 'Aujourd\'hui' : `Dans ${meeting.daysLeft}j`}</span>
            </li>
        `).join('') || '<li>Aucun RDV prévu</li>';
    }

    // Order quick actions
    quickStatusChangeOrder(id) {
        const order = crmData.getOrders().find(o => o.id === id);
        if (!order) return;

        const statuses = [
            'en_attente',
            'confirmee',
            'en_production',
            'expediee',
            'livree'
        ];

        const content = `
            <div class="quick-status-change">
                <h4>Changer le statut de la commande ${order.orderNumber}</h4>
                <div class="form-group">
                    <label for="new-order-status">Nouveau statut</label>
                    <select id="new-order-status">
                        ${statuses.map(status => 
                            `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.confirmOrderStatusChange(${id})">Confirmer</button>
                </div>
            </div>
        `;

        this.showModal('Changement de Statut Commande', content);
    }

    confirmOrderStatusChange(id) {
        const newStatus = document.getElementById('new-order-status').value;
        crmData.updateOrder(id, { status: newStatus });
        this.closeModal();
        this.showMessage('Statut de commande mis à jour !', 'success');
        this.loadOrders();
        this.loadDashboard();
    }

    duplicateOrder(id) {
        const order = crmData.getOrders().find(o => o.id === id);
        if (!order) return;

        const newOrder = {
            ...order,
            orderNumber: `CMD-${Date.now()}`,
            status: 'en_attente',
            createdAt: new Date().toISOString()
        };
        delete newOrder.id;

        crmData.addOrder(newOrder);
        this.showMessage('Commande dupliquée !', 'success');
        this.loadOrders();
        this.loadDashboard();
    }

    duplicateContact(id) {
        const contact = crmData.getContacts().find(c => c.id === id);
        if (!contact) return;

        const newContact = {
            ...contact,
            createdAt: new Date().toISOString(),
            subject: `${contact.subject} (Copie)`
        };
        delete newContact.id;

        crmData.addContact(newContact);
        this.showMessage('Contact dupliqué !', 'success');
        this.loadContacts();
        this.loadDashboard();
    }

    useTemplate(id) {
        const template = crmData.getEmailTemplates().find(t => t.id === id);
        if (!template) return;

        const clients = crmData.getClients();
        const leads = crmData.getLeads();
        
        const content = `
            <div class="use-template">
                <h4>Utiliser le template: ${template.name}</h4>
                <div class="form-group">
                    <label for="template-recipient">Destinataire</label>
                    <select id="template-recipient">
                        <option value="">Sélectionner un destinataire</option>
                        <optgroup label="Clients">
                            ${clients.map(client => 
                                `<option value="client-${client.id}">${client.name} - ${client.company} (${client.email})</option>`
                            ).join('')}
                        </optgroup>
                        <optgroup label="Leads">
                            ${leads.map(lead => 
                                `<option value="lead-${lead.id}">${lead.name} - ${lead.company} (${lead.email})</option>`
                            ).join('')}
                        </optgroup>
                    </select>
                </div>
                <div class="form-group">
                    <label for="template-subject-final">Sujet</label>
                    <input type="text" id="template-subject-final" value="${template.subject}">
                </div>
                <div class="form-group">
                    <label for="template-content-final">Contenu</label>
                    <textarea id="template-content-final" rows="8">${template.content}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick="app.sendTemplateEmail()">Envoyer</button>
                </div>
            </div>
        `;

        this.showModal('Utiliser le Template', content);
    }

    sendTemplateEmail() {
        const recipient = document.getElementById('template-recipient').value;
        const subject = document.getElementById('template-subject-final').value;
        const content = document.getElementById('template-content-final').value;
        
        if (!recipient || !subject || !content) {
            this.showMessage('Veuillez remplir tous les champs', 'error');
            return;
        }

        // Simuler l'envoi d'email
        this.showMessage('Email envoyé avec succès !', 'success');
        this.closeModal();
        
        // Enregistrer comme contact
        const [type, id] = recipient.split('-');
        const recipientData = type === 'client' ? 
            crmData.getClients().find(c => c.id === parseInt(id)) :
            crmData.getLeads().find(l => l.id === parseInt(id));
            
        if (recipientData) {
            const contactData = {
                clientId: type === 'client' ? parseInt(id) : null,
                leadId: type === 'lead' ? parseInt(id) : null,
                clientName: recipientData.name,
                type: 'email',
                subject: subject,
                summary: `Email envoyé: ${content.substring(0, 100)}...`
            };
            crmData.addContact(contactData);
            this.loadContacts();
            this.loadDashboard();
        }
    }

    duplicateTemplate(id) {
        const template = crmData.getEmailTemplates().find(t => t.id === id);
        if (!template) return;

        const newTemplate = {
            ...template,
            name: `${template.name} (Copie)`,
            createdAt: new Date().toISOString()
        };
        delete newTemplate.id;

        crmData.addEmailTemplate(newTemplate);
        this.showMessage('Template dupliqué !', 'success');
        this.loadTemplates();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CRMApp();
});
