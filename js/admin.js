// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections and remove active class from nav items
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
            
            // Show target section and add active class to clicked nav item
            document.getElementById(targetId).classList.add('active');
            this.parentElement.classList.add('active');
        });
    });

    // Fetch emails data
    fetchEmails();

    // Fetch visitors data
    fetchVisitors();

    // Initialize dashboard stats and charts
    initializeDashboard();

    // Setup export buttons
    setupExportButtons();

    // Setup settings save buttons
    setupSettingsButtons();
});

// Fetch emails from the server
function fetchEmails() {
    fetch('/api/emails')
        .then(response => response.json())
        .then(data => {
            updateEmailsTable(data.emails);
            updateEmailStats(data.emails);
        })
        .catch(error => {
            console.error('Error fetching emails:', error);
            const tableBody = document.getElementById('emails-list');
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Erreur lors du chargement des emails. Vérifiez la console du serveur.</td></tr>';
            // Also clear stats or show error
            document.getElementById('email-count').textContent = 'Erreur';
            document.getElementById('last-signup').textContent = 'Erreur';
        });
}

// Load sample emails for demonstration
function loadSampleEmails() {
    const sampleEmails = [
        { email: 'user1@example.com', date: '2025-04-28T10:15:30Z', status: 'Actif' },
        { email: 'user2@example.com', date: '2025-04-28T09:22:15Z', status: 'Actif' },
        { email: 'user3@example.com', date: '2025-04-27T16:45:00Z', status: 'Actif' },
        { email: 'user4@example.com', date: '2025-04-27T14:10:45Z', status: 'Actif' },
        { email: 'user5@example.com', date: '2025-04-26T11:30:20Z', status: 'Actif' }
    ];
    
    updateEmailsTable(sampleEmails);
    updateEmailStats(sampleEmails);
}

// Update emails table with data
function updateEmailsTable(emails) {
    const tableBody = document.getElementById('emails-list');
    tableBody.innerHTML = '';
    
    if (emails.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center;">Aucun email collecté pour le moment</td>';
        tableBody.appendChild(row);
        return;
    }
    
    emails.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
        
        row.innerHTML = `
            <td>${item.email}</td>
            <td>${formattedDate}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>
                <button class="action-btn" title="Envoyer un email"><i class="fas fa-envelope"></i></button>
                <button class="action-btn" title="Supprimer"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update email statistics
function updateEmailStats(emails) {
    document.getElementById('email-count').textContent = emails.length;
    
    if (emails.length > 0) {
        const lastEmail = new Date(emails[0].date);
        document.getElementById('last-signup').textContent = lastEmail.toLocaleDateString('fr-FR') + ' ' + lastEmail.toLocaleTimeString('fr-FR');
    }
}

// Fetch visitors data
function fetchVisitors() {
    fetch('/api/visitors')
        .then(response => response.json())
        .then(data => {
            updateVisitorsTable(data.visitors);
            updateVisitorStats(data.visitors);
        })
        .catch(error => {
            console.error("Error fetching visitors:", error);
            const tableBody = document.getElementById("visitors-list");
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Erreur lors du chargement des visiteurs. Vérifiez la console du serveur.</td></tr>';
            // Also clear stats or show error
            document.getElementById("visitor-count").textContent = "Erreur";
            document.getElementById("conversion-rate").textContent = "Erreur";
        });
}

// Load sample visitors for demonstration
function loadSampleVisitors() {
    const sampleVisitors = [
        { ip: '192.168.1.1', date: '2025-04-28T10:10:30Z', country: 'France', device: 'Desktop', browser: 'Chrome', converted: true },
        { ip: '192.168.1.2', date: '2025-04-28T09:20:15Z', country: 'France', device: 'Mobile', browser: 'Safari', converted: false },
        { ip: '192.168.1.3', date: '2025-04-27T16:40:00Z', country: 'Belgique', device: 'Desktop', browser: 'Firefox', converted: true },
        { ip: '192.168.1.4', date: '2025-04-27T14:15:45Z', country: 'Suisse', device: 'Tablet', browser: 'Chrome', converted: false },
        { ip: '192.168.1.5', date: '2025-04-26T11:35:20Z', country: 'Canada', device: 'Desktop', browser: 'Edge', converted: true },
        { ip: '192.168.1.6', date: '2025-04-26T10:25:10Z', country: 'France', device: 'Mobile', browser: 'Chrome', converted: false },
        { ip: '192.168.1.7', date: '2025-04-25T18:50:30Z', country: 'France', device: 'Desktop', browser: 'Firefox', converted: false },
        { ip: '192.168.1.8', date: '2025-04-25T15:05:40Z', country: 'Belgique', device: 'Mobile', browser: 'Safari', converted: true }
    ];
    
    updateVisitorsTable(sampleVisitors);
    updateVisitorStats(sampleVisitors);
}

// Update visitors table with data
function updateVisitorsTable(visitors) {
    const tableBody = document.getElementById('visitors-list');
    tableBody.innerHTML = '';
    
    if (visitors.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Aucun visiteur enregistré pour le moment</td>';
        tableBody.appendChild(row);
        return;
    }
    
    visitors.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
        
        row.innerHTML = `
            <td>${item.ip}</td>
            <td>${formattedDate}</td>
            <td>${item.country}</td>
            <td>${item.device}</td>
            <td>${item.browser}</td>
            <td>${item.converted ? '<span class="status-badge converted">Oui</span>' : '<span class="status-badge not-converted">Non</span>'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update visitor statistics
function updateVisitorStats(visitors) {
    document.getElementById('visitor-count').textContent = visitors.length;
    
    const convertedCount = visitors.filter(visitor => visitor.converted).length;
    const conversionRate = visitors.length > 0 ? ((convertedCount / visitors.length) * 100).toFixed(1) : '0';
    document.getElementById('conversion-rate').textContent = conversionRate + '%';
}

// Initialize dashboard with charts
function initializeDashboard() {
    // Sample data for charts
    const dates = getLast7Days();
    
    const signupsData = [3, 5, 2, 7, 4, 6, 5];
    const visitorsData = [12, 15, 10, 18, 14, 20, 16];
    
    // Create signups chart
    const signupsCtx = document.getElementById('signups-chart').getContext('2d');
    new Chart(signupsCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Inscriptions',
                data: signupsData,
                backgroundColor: 'rgba(0, 193, 162, 0.2)',
                borderColor: '#00c1a2',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#00c1a2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
    
    // Create visitors chart
    const visitorsCtx = document.getElementById('visitors-chart').getContext('2d');
    new Chart(visitorsCtx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Visiteurs',
                data: visitorsData,
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
                borderColor: '#1a1a1a',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Get array of last 7 days for chart labels
function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
    }
    return dates;
}

// Setup export buttons functionality
function setupExportButtons() {
    // Email exports
    document.getElementById('export-emails').addEventListener('click', function() {
        exportEmails('csv');
    });
    
    document.getElementById('export-emails-csv').addEventListener('click', function() {
        exportEmails('csv');
    });
    
    document.getElementById('export-emails-json').addEventListener('click', function() {
        exportEmails('json');
    });
    
    // Visitor exports
    document.getElementById('export-visitors').addEventListener('click', function() {
        exportVisitors('csv');
    });
    
    document.getElementById('export-visitors-csv').addEventListener('click', function() {
        exportVisitors('csv');
    });
    
    document.getElementById('export-visitors-json').addEventListener('click', function() {
        exportVisitors('json');
    });
    
    // Report generation
    document.getElementById('generate-report').addEventListener('click', function() {
        alert('Génération du rapport PDF en cours...');
        // This would be implemented with a PDF generation library in a real application
    });
}

// Export emails to file
function exportEmails(format) {
    fetch('/api/emails')
        .then(response => response.json())
        .then(data => {
            if (format === 'csv') {
                downloadCSV(data.emails, 'emails');
            } else {
                downloadJSON(data.emails, 'emails');
            }
        })
        .catch(error => {
            console.error('Error exporting emails:', error);
            alert('Erreur lors de l\'exportation des emails. Veuillez réessayer.');
            // For demo, use sample data
            const sampleEmails = [
                { email: 'user1@example.com', date: '2025-04-28T10:15:30Z', status: 'Actif' },
                { email: 'user2@example.com', date: '2025-04-28T09:22:15Z', status: 'Actif' },
                { email: 'user3@example.com', date: '2025-04-27T16:45:00Z', status: 'Actif' },
                { email: 'user4@example.com', date: '2025-04-27T14:10:45Z', status: 'Actif' },
                { email: 'user5@example.com', date: '2025-04-26T11:30:20Z', status: 'Actif' }
            ];
            
            if (format === 'csv') {
                downloadCSV(sampleEmails, 'emails');
            } else {
                downloadJSON(sampleEmails, 'emails');
            }
        });
}

// Export visitors to file
function exportVisitors(format) {
    fetch('/api/visitors')
        .then(response => response.json())
        .then(data => {
            if (format === 'csv') {
                downloadCSV(data.visitors, 'visitors');
            } else {
                downloadJSON(data.visitors, 'visitors');
            }
        })
        .catch(error => {
            console.error('Error exporting visitors:', error);
            alert('Erreur lors de l\'exportation des visiteurs. Veuillez réessayer.');
            // For demo, use sample data
            const sampleVisitors = [
                { ip: '192.168.1.1', date: '2025-04-28T10:10:30Z', country: 'France', device: 'Desktop', browser: 'Chrome', converted: true },
                { ip: '192.168.1.2', date: '2025-04-28T09:20:15Z', country: 'France', device: 'Mobile', browser: 'Safari', converted: false },
                { ip: '192.168.1.3', date: '2025-04-27T16:40:00Z', country: 'Belgique', device: 'Desktop', browser: 'Firefox', converted: true },
                { ip: '192.168.1.4', date: '2025-04-27T14:15:45Z', country: 'Suisse', device: 'Tablet', browser: 'Chrome', converted: false },
                { ip: '192.168.1.5', date: '2025-04-26T11:35:20Z', country: 'Canada', device: 'Desktop', browser: 'Edge', converted: true }
            ];
            
            if (format === 'csv') {
                downloadCSV(sampleVisitors, 'visitors');
            } else {
                downloadJSON(sampleVisitors, 'visitors');
            }
        });
}

// Download data as CSV
function downloadCSV(data, filename) {
    if (data.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(item => {
        const row = headers.map(header => {
            let value = item[header];
            // Format date if it's a date string
            if (header === 'date' && typeof value === 'string') {
                value = new Date(value).toLocaleString('fr-FR');
            }
            // Handle commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDate(new Date())}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download data as JSON
function downloadJSON(data, filename) {
    if (data.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDate(new Date())}.json`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Format date for filenames
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Setup settings save buttons
function setupSettingsButtons() {
    // Redirect settings
    document.getElementById('save-redirect-settings').addEventListener('click', function() {
        const redirectUrl = document.getElementById('redirect-url').value;
        const redirectDelay = document.getElementById('redirect-delay').value;
        
        // In a real app, this would save to the server
        alert(`Paramètres de redirection enregistrés:\nURL: ${redirectUrl}\nDélai: ${redirectDelay} secondes`);
    });
    
    // Email settings
    document.getElementById('save-email-settings').addEventListener('click', function() {
        const emailSender = document.getElementById('email-sender').value;
        const emailSubject = document.getElementById('email-subject').value;
        
        // In a real app, this would save to the server
        alert(`Paramètres d'email enregistrés:\nExpéditeur: ${emailSender}\nSujet: ${emailSubject}`);
    });
    
    // Security settings
    document.getElementById('save-security-settings').addEventListener('click', function() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // In a real app, this would save to the server
        alert(`Paramètres de sécurité enregistrés:\nNom d'utilisateur: ${username}\nMot de passe: ********`);
    });
}
