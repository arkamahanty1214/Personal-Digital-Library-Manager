class DigitalLibrary {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLibraryItems();
    }

    bindEvents() {
        document.getElementById('addItemBtn').addEventListener('click', () => this.showAddModal());
        document.querySelector('.close').addEventListener('click', () => this.hideAddModal());
        document.getElementById('addItemForm').addEventListener('submit', (e) => this.handleAddItem(e));
        document.getElementById('searchInput').addEventListener('input', () => this.filterItems());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterItems());
    }

    async loadLibraryItems() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/items`);
            const items = await response.json();
            this.displayItems(items);
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }

    displayItems(items) {
        const container = document.getElementById('libraryItems');
        container.innerHTML = items.map(item => `
            <div class="item-card" data-category="${item.category}">
                <h3>${item.title}</h3>
                <p><strong>Author:</strong> ${item.author}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p>${item.description}</p>
                <div class="item-actions">
                    <button onclick="library.markAsRead(${item.id})">Mark Read</button>
                    <button onclick="library.deleteItem(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async handleAddItem(event) {
        event.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.hideAddModal();
                this.loadLibraryItems();
                document.getElementById('addItemForm').reset();
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    async markAsRead(itemId) {
        try {
            await fetch(`${this.apiBaseUrl}/items/${itemId}/read`, {
                method: 'PUT'
            });
            this.loadLibraryItems();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    async deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await fetch(`${this.apiBaseUrl}/items/${itemId}`, {
                    method: 'DELETE'
                });
                this.loadLibraryItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    }

    filterItems() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        
        document.querySelectorAll('.item-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.dataset.category;
            
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
            
            card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });
    }

    showAddModal() {
        document.getElementById('addItemModal').style.display = 'block';
    }

    hideAddModal() {
        document.getElementById('addItemModal').style.display = 'none';
    }
}

// Initialize the library when page loads
const library = new DigitalLibrary();
