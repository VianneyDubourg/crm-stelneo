// CRM Data Management
class CRMData {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize data structure if not exists
        if (!localStorage.getItem('crm_data')) {
            const initialData = {
                clients: [
                    {
                        id: 1,
                        name: "Marine Pradal",
                        company: "Octobulle",
                        email: "marine@octobulle.fr",
                        phone: "06 78 96 72 93",
                        status: "appelé à relancer mail",
                        origin: "internet",
                        notes: "Mail envoyé, cold call: 07/07 elle est intéressée plutôt disponible mais plutôt en octobre parce que actuellement elle est en vacances donc j'ai calé un rendez-vous le 23 octobre à 10h00 ce sera soit moi soit Léopold il faut que je lui envoie un mail courant octobre avec toutes les infos avant le rendez-vous et une invitation pour le rendez-vous",
                        createdAt: new Date().toISOString(),
                        lastContact: new Date().toISOString()
                    }
                ],
                leads: [
                    {
                        id: 1,
                        name: "Sophie",
                        company: "Les savons de sophie",
                        email: "contact@lessavonsdesophie.fr",
                        phone: "06 10 16 58 16",
                        source: "internet",
                        priority: "Medium",
                        status: "pas intéresser",
                        service: "B2C Pochette Plate",
                        notes: "Mail envoyé, cold call 07/07: Bon alors le problème c'est que la personne je l'ai appelée elle est très sympa Mais elle envoie pas beaucoup sur son site et elle compte fermer son entreprise donc malheureusement ça sera pas un client",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: "Carole",
                        company: "Savonnerie Carole",
                        email: "carole@savonnerie.fr",
                        phone: "06 12 34 56 78",
                        source: "recommandation",
                        priority: "High",
                        status: "à rappeler",
                        service: "B2B Pochette Classique",
                        notes: "Mail envoyé, cold call 07/07: la personne n'a pas répondu pensez à la rappeler demain/ 11 09 la personne ne reponds pas je rappellerai dans 2 jours",
                        createdAt: new Date().toISOString()
                    }
                ],
                orders: [],
                contacts: [],
                emailTemplates: [
                    {
                        id: 1,
                        name: "Premier contact",
                        subject: "Découverte de vos besoins en emballage",
                        content: "Bonjour {{nom}},\n\nJ'espère que vous allez bien. Je me permets de vous contacter pour discuter de vos besoins en emballage.\n\nNous proposons une large gamme d'emballages adaptés à votre secteur d'activité.\n\nSeriez-vous disponible pour un échange téléphonique cette semaine ?\n\nCordialement,\n{{utilisateur}}",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: "Relance commerciale",
                        subject: "Relance - Proposition d'emballage",
                        content: "Bonjour {{nom}},\n\nJe vous recontacte concernant notre échange précédent sur vos besoins en emballage.\n\nAvez-vous eu l'occasion de réfléchir à notre proposition ?\n\nJe reste à votre disposition pour toute question.\n\nCordialement,\n{{utilisateur}}",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 3,
                        name: "Confirmation commande",
                        subject: "Confirmation de votre commande",
                        content: "Bonjour {{nom}},\n\nJe vous confirme la réception de votre commande n°{{commande}}.\n\nDétails :\n- Produit : {{produit}}\n- Quantité : {{quantite}}\n- Prix total : {{prix}}€\n\nVotre commande sera expédiée sous 48h.\n\nMerci pour votre confiance !\n\nCordialement,\n{{utilisateur}}",
                        createdAt: new Date().toISOString()
                    }
                ],
                settings: {
                    currentUser: "Utilisateur 1",
                    companyName: "STELNEO",
                    currency: "€"
                }
            };
            localStorage.setItem('crm_data', JSON.stringify(initialData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('crm_data'));
    }

    saveData(data) {
        localStorage.setItem('crm_data', JSON.stringify(data));
    }

    // Clients Management
    addClient(client) {
        const data = this.getData();
        const newClient = {
            id: Date.now(),
            ...client,
            createdAt: new Date().toISOString(),
            lastContact: null
        };
        data.clients.push(newClient);
        this.saveData(data);
        return newClient;
    }

    updateClient(id, updates) {
        const data = this.getData();
        const clientIndex = data.clients.findIndex(c => c.id === id);
        if (clientIndex !== -1) {
            data.clients[clientIndex] = { ...data.clients[clientIndex], ...updates };
            this.saveData(data);
            return data.clients[clientIndex];
        }
        return null;
    }

    deleteClient(id) {
        const data = this.getData();
        data.clients = data.clients.filter(c => c.id !== id);
        this.saveData(data);
    }

    getClients() {
        return this.getData().clients;
    }

    // Leads Management
    addLead(lead) {
        const data = this.getData();
        const newLead = {
            id: Date.now(),
            ...lead,
            createdAt: new Date().toISOString(),
            status: 'nouveau'
        };
        data.leads.push(newLead);
        this.saveData(data);
        return newLead;
    }

    updateLead(id, updates) {
        const data = this.getData();
        const leadIndex = data.leads.findIndex(l => l.id === id);
        if (leadIndex !== -1) {
            data.leads[leadIndex] = { ...data.leads[leadIndex], ...updates };
            this.saveData(data);
            return data.leads[leadIndex];
        }
        return null;
    }

    deleteLead(id) {
        const data = this.getData();
        data.leads = data.leads.filter(l => l.id !== id);
        this.saveData(data);
    }

    getLeads() {
        return this.getData().leads;
    }

    // Orders Management
    addOrder(order) {
        const data = this.getData();
        const newOrder = {
            id: Date.now(),
            orderNumber: `CMD-${Date.now()}`,
            ...order,
            createdAt: new Date().toISOString(),
            status: 'en_attente'
        };
        data.orders.push(newOrder);
        this.saveData(data);
        return newOrder;
    }

    updateOrder(id, updates) {
        const data = this.getData();
        const orderIndex = data.orders.findIndex(o => o.id === id);
        if (orderIndex !== -1) {
            data.orders[orderIndex] = { ...data.orders[orderIndex], ...updates };
            this.saveData(data);
            return data.orders[orderIndex];
        }
        return null;
    }

    deleteOrder(id) {
        const data = this.getData();
        data.orders = data.orders.filter(o => o.id !== id);
        this.saveData(data);
    }

    getOrders() {
        return this.getData().orders;
    }

    // Contacts Management
    addContact(contact) {
        const data = this.getData();
        const newContact = {
            id: Date.now(),
            ...contact,
            createdAt: new Date().toISOString(),
            user: data.settings.currentUser
        };
        data.contacts.push(newContact);
        
        // Update last contact for client/lead
        if (contact.clientId) {
            this.updateClient(contact.clientId, { lastContact: newContact.createdAt });
        }
        
        this.saveData(data);
        return newContact;
    }

    updateContact(id, updates) {
        const data = this.getData();
        const contactIndex = data.contacts.findIndex(c => c.id === id);
        if (contactIndex !== -1) {
            data.contacts[contactIndex] = { ...data.contacts[contactIndex], ...updates };
            this.saveData(data);
            return data.contacts[contactIndex];
        }
        return null;
    }

    deleteContact(id) {
        const data = this.getData();
        data.contacts = data.contacts.filter(c => c.id !== id);
        this.saveData(data);
    }

    getContacts() {
        return this.getData().contacts;
    }

    // Email Templates Management
    addEmailTemplate(template) {
        const data = this.getData();
        const newTemplate = {
            id: Date.now(),
            ...template,
            createdAt: new Date().toISOString()
        };
        data.emailTemplates.push(newTemplate);
        this.saveData(data);
        return newTemplate;
    }

    updateEmailTemplate(id, updates) {
        const data = this.getData();
        const templateIndex = data.emailTemplates.findIndex(t => t.id === id);
        if (templateIndex !== -1) {
            data.emailTemplates[templateIndex] = { ...data.emailTemplates[templateIndex], ...updates };
            this.saveData(data);
            return data.emailTemplates[templateIndex];
        }
        return null;
    }

    deleteEmailTemplate(id) {
        const data = this.getData();
        data.emailTemplates = data.emailTemplates.filter(t => t.id !== id);
        this.saveData(data);
    }

    getEmailTemplates() {
        return this.getData().emailTemplates;
    }

    // Search functionality
    search(query) {
        const data = this.getData();
        const results = {
            clients: [],
            leads: [],
            contacts: [],
            orders: []
        };

        if (!query) return results;

        const searchTerm = query.toLowerCase();

        // Search in clients
        results.clients = data.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.company.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            client.phone.includes(searchTerm)
        );

        // Search in leads
        results.leads = data.leads.filter(lead => 
            lead.name.toLowerCase().includes(searchTerm) ||
            lead.company.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm) ||
            lead.phone.includes(searchTerm)
        );

        // Search in contacts
        results.contacts = data.contacts.filter(contact => 
            contact.subject.toLowerCase().includes(searchTerm) ||
            contact.summary.toLowerCase().includes(searchTerm)
        );

        // Search in orders
        results.orders = data.orders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.product.toLowerCase().includes(searchTerm) ||
            order.clientName.toLowerCase().includes(searchTerm)
        );

        return results;
    }

    // Analytics
    getAnalytics() {
        const data = this.getData();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter data for current month
        const currentMonthOrders = data.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });

        // Calculate stats
        const stats = {
            totalClients: data.clients.length,
            totalLeads: data.leads.filter(lead => lead.status !== 'converted').length,
            totalOrders: currentMonthOrders.length,
            totalRevenue: currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        };

        // Client origins
        const clientOrigins = {};
        data.clients.forEach(client => {
            const origin = client.origin || 'inconnu';
            clientOrigins[origin] = (clientOrigins[origin] || 0) + 1;
        });

        // Lead sources
        const leadSources = {};
        data.leads.forEach(lead => {
            const source = lead.source || 'inconnu';
            leadSources[source] = (leadSources[source] || 0) + 1;
        });

        // Packaging types
        const packagingTypes = {};
        data.orders.forEach(order => {
            const type = order.packagingType || 'standard';
            packagingTypes[type] = (packagingTypes[type] || 0) + 1;
        });

        // Monthly performance (last 6 months)
        const monthlyPerformance = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthOrders = data.orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
            });
            
            monthlyPerformance.push({
                month: date.toLocaleDateString('fr-FR', { month: 'short' }),
                orders: monthOrders.length,
                revenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
            });
        }

        return {
            stats,
            clientOrigins,
            leadSources,
            packagingTypes,
            monthlyPerformance
        };
    }

    // Recent activities
    getRecentActivities(limit = 10) {
        const data = this.getData();
        const activities = [];

        // Add recent contacts
        data.contacts.slice(-limit).forEach(contact => {
            activities.push({
                type: 'contact',
                icon: contact.type === 'appel' ? 'fas fa-phone' : 
                      contact.type === 'email' ? 'fas fa-envelope' : 'fas fa-calendar',
                title: `${contact.type} avec ${contact.clientName}`,
                description: contact.subject,
                time: contact.createdAt,
                color: contact.type === 'appel' ? '#28a745' : 
                       contact.type === 'email' ? '#007bff' : '#ffc107'
            });
        });

        // Add recent orders
        data.orders.slice(-limit).forEach(order => {
            activities.push({
                type: 'order',
                icon: 'fas fa-shopping-cart',
                title: `Nouvelle commande ${order.orderNumber}`,
                description: `${order.product} - ${order.clientName}`,
                time: order.createdAt,
                color: '#6f42c1'
            });
        });

        // Sort by date and limit
        return activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, limit);
    }

    // Export/Import functionality
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}

// Initialize global data instance
window.crmData = new CRMData();
