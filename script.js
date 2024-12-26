// Function to display messages
function displayMessage(message, type = 'info') {
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.prepend(messageContainer);
    }

    messageContainer.className = `message ${type}`;
    messageContainer.textContent = message;

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// Fetch Equipment Data
async function fetchEquipment() {
    displayMessage('Loading equipment data...', 'info');
    try {
        const response = await fetch('backend/equipment.php?action=read');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const tableBody = document.getElementById('equipment-table');
        tableBody.innerHTML = '';

        if (data && data.status === 'error') {
            displayMessage(data.message, 'error');
            return;
        }

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No equipment found.</td></tr>';
        } else {
            data.forEach((item) => {
                const row = `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.model_number || ''}</td>
                        <td>${item.serial_number || ''}</td>
                        <td>${item.last_serviced || ''}</td>
                        <td>${item.next_service || ''}</td>
                        <td>${item.facility || ''}</td>
                        <td>${item.facility_location || ''}</td>
                        <td>${item.facility_contact || ''}</td>
                        <td>
                            <button class="delete-btn" data-id="${item.id}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
        displayMessage('Equipment data loaded.', 'success');
    } catch (error) {
        console.error('Error fetching equipment:', error);
        displayMessage('Error loading equipment data. Please try again later.', 'error');
    }
}

// Delete Equipment
async function deleteEquipment(id) {
    if (!confirm("Are you sure you want to delete this equipment?")) {
        return;
    }

    displayMessage('Deleting equipment...', 'info');
    try {
        const response = await fetch('backend/equipment.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: id })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'error') {
            displayMessage(data.message, 'error');
            return;
        }

        fetchEquipment();
        displayMessage('Equipment deleted successfully.', 'success');
    } catch (error) {
        console.error('Error deleting equipment:', error);
        displayMessage('Error deleting equipment. Please try again later.', 'error');
    }
}

async function generateReport(reportType) { // ... (No changes needed) }
function convertJsonToCsv(jsonData) { // ... (No changes needed) }

async function fetchCatalog() {
    displayMessage('Loading catalog data...', 'info');
    try {
        const response = await fetch('backend/equipment.php?action=read_catalog');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const tableBody = document.getElementById('catalog-table');
        tableBody.innerHTML = '';

        if (data && data.status === 'error') {
            displayMessage(data.message, 'error');
            return;
        }

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No catalog items found.</td></tr>';
            return;
        }

        data.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.name || ''}</td>
                    <td>${item.model || ''}</td>
                    <td>${item.description || ''}</td>
                    <td>${item.image ? `<img src="${item.image}" alt="${item.name} Image" width="100">` : ''}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
        displayMessage('Catalog data loaded.', 'success');
    } catch (error) {
        console.error('Error fetching catalog:', error);
        displayMessage('Error loading catalog data. Please try again later.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'flex';

    // Navigation
    const navLinks = document.querySelectorAll('#sidebar nav a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSectionId = link.dataset.section;

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(targetSectionId).classList.add('active');
        });
    });

    document.getElementById('dashboard').classList.add('active');
    navLinks[0].classList.add('active');

    // Add Equipment Form
    const addEquipmentBtn = document.getElementById('add-equipment-btn');
    const addEquipmentForm = document.getElementById('add-equipment-form');
    const equipmentForm = document.getElementById('equipment-form');
    const cancelAddEquipment = document.getElementById('cancel-add-equipment');

    addEquipmentBtn.addEventListener('click', () => {
        addEquipmentForm.style.display = 'block';
    });

    cancelAddEquipment.addEventListener('click', () => {
        addEquipmentForm.style.display = 'none';
    });

    equipmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('equipment-name').value;
        const modelNumber = document.getElementById('model-number').value;
        const serialNumber = document.getElementById('serial-number').value;
        const lastServiced = document.getElementById('last-serviced').value;
        const nextService = document.getElementById('next-service').value;
        const facility = document.getElementById('facility').value;
        const facilityLocation = document.getElementById('facility-location').value;
        const facilityContact = document.getElementById('facility-contact').value;

        try {
            const response = await fetch('backend/equipment.php?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    name,
                    model_number: modelNumber,
                    serial_number: serialNumber,
                    last_serviced: lastServiced,
                    next_service: nextService,
                    facility,
                    facility_location: facilityLocation,
                    facility_contact: facilityContact
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                displayMessage('Equipment added successfully!', 'success');
                fetchEquipment();
                equipmentForm.reset();
                addEquipmentForm.style.display = 'none';
            } else {
                displayMessage(data.message, 'error');
            }
        } catch (error) {
            console.error("Error creating equipment:", error);
            displayMessage('An error occurred while adding equipment.', 'error');
        }
    });

    const exportButton = document.getElementById('export-excel');
    const reportTypeSelect = document.getElementById('report-type');

    exportButton.addEventListener('click', () => {
        const selectedReport = reportTypeSelect.value;
        generateReport(selectedReport);
    });

    fetchEquipment();
    fetchCatalog();
});