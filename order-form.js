// order-form.js - Buyurtma formasi uchun alohida JavaScript

class OrderForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.cart = [];
        this.customerInfo = {};
        this.productType = '';
        this.init();
    }
    
    init() {
        console.log('OrderForm initialized');
        this.loadCart();
        this.renderForm();
        this.setupEventListeners();
    }
    
    loadCart() {
        // Savat ma'lumotlarini olish
        this.cart = JSON.parse(localStorage.getItem('kents_cart')) || [];
        console.log('Loaded cart:', this.cart);
    }
    
    renderForm() {
        const cartModal = document.querySelector('.cart-modal');
        if (!cartModal) return;
        
        // Savat modalining footer qismini o'zgartirish
        const cartFooter = document.querySelector('.cart-footer');
        if (cartFooter) {
            cartFooter.innerHTML = `
                <div class="order-form-container" id="orderFormContainer">
                    <h3><i class="fas fa-file-alt"></i> Buyurtma ma'lumotlari</h3>
                    
                    <div class="form-step" id="step1">
                        <div class="step-title"><i class="fas fa-shopping-cart"></i> Savatingiz</div>
                        <div class="product-info" id="cartPreview">
                            <!-- Savat mahsulotlari bu yerda -->
                        </div>
                    </div>
                    
                    <div class="form-step" id="step2">
                        <div class="step-title"><i class="fas fa-user"></i> Mijoz ma'lumotlari</div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-user-circle"></i> Ismingiz <span class="form-required">*</span></label>
                            <input type="text" id="customerName" placeholder="To'liq ismingizni kiriting" required>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Aloqa usuli <span class="form-required">*</span></label>
                            <select id="contactMethod" required>
                                <option value="">Tanlang</option>
                                <option value="telegram">Telegram (@username)</option>
                                <option value="phone">Telefon raqami</option>
                                <option value="email">Email</option>
                            </select>
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> Siz bilan bog'lanish usulini tanlang
                            </div>
                        </div>
                        
                        <div class="form-group" id="telegramField" style="display: none;">
                            <label><i class="fab fa-telegram"></i> Telegram username <span class="form-required">*</span></label>
                            <input type="text" id="telegramUsername" placeholder="@username">
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> @ belgisiz kiriting (masalan: john_doe)
                            </div>
                        </div>
                        
                        <div class="form-group" id="phoneField" style="display: none;">
                            <label><i class="fas fa-mobile-alt"></i> Telefon raqami <span class="form-required">*</span></label>
                            <input type="tel" id="phoneNumber" placeholder="+998901234567">
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> +998 kodi bilan kiriting
                            </div>
                        </div>
                        
                        <div class="form-group" id="emailField" style="display: none;">
                            <label><i class="fas fa-envelope"></i> Email manzili <span class="form-required">*</span></label>
                            <input type="email" id="emailAddress" placeholder="example@gmail.com">
                        </div>
                    </div>
                    
                    <div class="form-step" id="step3" style="display: none;">
                        <div class="step-title"><i class="fas fa-gamepad"></i> Akkaunt ma'lumotlari</div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-tags"></i> Mahsulot turi <span class="form-required">*</span></label>
                            <select id="productTypeSelect" required>
                                <option value="">Tanlang</option>
                                <option value="game">O'yin donatlari</option>
                                <option value="telegram">Telegram mahsulotlari</option>
                                <!-- Kriptovalyuta o'chirildi -->
                            </select>
                        </div>
                        
                        <!-- O'yin akkaunt maydonlari -->
                        <div class="account-type-fields" id="gameFields">
                            <div class="form-group">
                                <label><i class="fas fa-gamepad"></i> O'yin turi</label>
                                <select id="gameType">
                                    <option value="">Tanlang</option>
                                    <option value="standoff">Standoff 2</option>
                                    <option value="pubg">PUBG Mobile</option>
                                    <option value="brawl">Brawl Stars</option>
                                    <option value="mlbb">Mobile Legends</option>
                                    <option value="roblox">Roblox</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label><i class="fas fa-user"></i> O'yin ID/Email <span class="form-required">*</span></label>
                                <input type="text" id="gameAccount" placeholder="O'yin ID yoki email manzili">
                                <div class="form-hint">
                                    <i class="fas fa-info-circle"></i> Donat qayerga yuborilishini kiriting
                                </div>
                            </div>
                        </div>
                        
                        <!-- Telegram akkaunt maydonlari -->
                        <div class="account-type-fields" id="telegramFields">
                            <div class="form-group">
                                <label><i class="fab fa-telegram"></i> Telegram username <span class="form-required">*</span></label>
                                <input type="text" id="telegramAccount" placeholder="@username">
                                <div class="form-hint">
                                    <i class="fas fa-info-circle"></i> Premium yoki Stars qayerga yuborilishini kiriting
                                </div>
                            </div>
                        </div>
                        
                        <!-- Izoh maydoni -->
                        <div class="form-group">
                            <label><i class="fas fa-sticky-note"></i> Qo'shimcha izoh (ixtiyoriy)</label>
                            <textarea id="orderNotes" placeholder="Qo'shimcha izohlar, talablar..."></textarea>
                        </div>
                    </div>
                    
                    <div class="order-summary" id="orderSummary">
                        <!-- Buyurtma summasi bu yerda -->
                    </div>
                    
                    <div class="form-buttons">
                        <button class="btn-back" id="backBtn" style="display: none;">
                            <i class="fas fa-arrow-left"></i> Orqaga
                        </button>
                        <button class="btn-submit" id="nextBtn">
                            Keyingi <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Dastlabki render
            this.updateCartPreview();
            this.updateOrderSummary();
            this.bindEvents();
        }
    }
    
    bindEvents() {
        // Aloqa usuli o'zgarishida
        document.getElementById('contactMethod')?.addEventListener('change', (e) => {
            this.toggleContactFields(e.target.value);
        });
        
        // Mahsulot turi o'zgarishida
        document.getElementById('productTypeSelect')?.addEventListener('change', (e) => {
            this.toggleProductFields(e.target.value);
        });
        
        // Orqaga tugmasi
        document.getElementById('backBtn')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        // Keyingi tugmasi
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            this.nextStep();
        });
        
        // Sahifa yuklanganda aloqa usulini tekshirish
        this.toggleContactFields(document.getElementById('contactMethod')?.value || '');
    }
    
    setupEventListeners() {
        // Asosiy savat modalini ochganda
        document.addEventListener('DOMContentLoaded', () => {
            const cartIcon = document.getElementById('cartIcon');
            if (cartIcon) {
                cartIcon.addEventListener('click', () => {
                    setTimeout(() => this.renderForm(), 100);
                });
            }
        });
    }
    
    updateCartPreview() {
        const container = document.getElementById('cartPreview');
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Savat bo'sh</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.cart.map(item => `
            <div class="product-item">
                <div>
                    <div class="product-name">${item.name}</div>
                    <div class="product-quantity">${item.price.toLocaleString()} UZS × ${item.quantity}</div>
                </div>
                <div class="product-total">
                    ${(item.price * item.quantity).toLocaleString()} UZS
                </div>
            </div>
        `).join('');
    }
    
    updateOrderSummary() {
        const container = document.getElementById('orderSummary');
        if (!container) return;
        
        const total = this.calculateTotal();
        
        container.innerHTML = `
            <div class="summary-item">
                <span>Mahsulotlar:</span>
                <span>${this.cart.length} ta</span>
            </div>
            <div class="summary-item">
                <span>Jami summa:</span>
                <span>${total.toLocaleString()} UZS</span>
            </div>
        `;
    }
    
    calculateTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    toggleContactFields(method) {
        // Barcha maydonlarni yashirish
        ['telegramField', 'phoneField', 'emailField'].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.style.display = 'none';
        });
        
        // Tanlangan maydonni ko'rsatish
        switch(method) {
            case 'telegram':
                document.getElementById('telegramField').style.display = 'block';
                break;
            case 'phone':
                document.getElementById('phoneField').style.display = 'block';
                break;
            case 'email':
                document.getElementById('emailField').style.display = 'block';
                break;
        }
    }
    
    toggleProductFields(type) {
        // Barcha maydonlarni yashirish
        ['gameFields', 'telegramFields'].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.classList.remove('active');
        });
        
        // Tanlangan maydonni ko'rsatish
        switch(type) {
            case 'game':
                document.getElementById('gameFields').classList.add('active');
                break;
            case 'telegram':
                document.getElementById('telegramFields').classList.add('active');
                break;
        }
    }
    
    nextStep() {
        // Joriy qadamni tekshirish
        if (!this.validateStep(this.currentStep)) {
            return;
        }
        
        // Ma'lumotlarni saqlash
        this.saveStepData(this.currentStep);
        
        // Keyingi qadamga o'tish
        if (this.currentStep < this.totalSteps) {
            document.getElementById(`step${this.currentStep}`).style.display = 'none';
            this.currentStep++;
            document.getElementById(`step${this.currentStep}`).style.display = 'block';
            
            // Tugma matnini o'zgartirish
            const nextBtn = document.getElementById('nextBtn');
            const backBtn = document.getElementById('backBtn');
            
            if (this.currentStep === this.totalSteps) {
                nextBtn.innerHTML = `
                    <span class="loading" id="loadingIndicator" style="display: none;">
                        <i class="fas fa-spinner"></i> Yuborilmoqda...
                    </span>
                    <span id="submitText">
                        <i class="fab fa-telegram"></i> Telegramga yuborish
                    </span>
                `;
            }
            
            // Orqaga tugmasini ko'rsatish
            backBtn.style.display = 'flex';
            
        } else {
            // So'nggi qadam - buyurtmani yuborish
            this.submitOrder();
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            document.getElementById(`step${this.currentStep}`).style.display = 'none';
            this.currentStep--;
            document.getElementById(`step${this.currentStep}`).style.display = 'block';
            
            // Tugma matnini o'zgartirish
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.innerHTML = `
                Keyingi <i class="fas fa-arrow-right"></i>
            `;
            
            // Orqaga tugmasini yashirish
            if (this.currentStep === 1) {
                document.getElementById('backBtn').style.display = 'none';
            }
        }
    }
    
    validateStep(step) {
        switch(step) {
            case 1:
                if (this.cart.length === 0) {
                    alert('Iltimos, avval mahsulot tanlang!');
                    return false;
                }
                return true;
                
            case 2:
                const name = document.getElementById('customerName').value.trim();
                const contactMethod = document.getElementById('contactMethod').value;
                
                if (!name) {
                    alert('Iltimos, ismingizni kiriting!');
                    return false;
                }
                
                if (!contactMethod) {
                    alert('Iltimos, aloqa usulini tanlang!');
                    return false;
                }
                
                // Aloqa usuli bo'yicha validatsiya
                let contactValid = false;
                switch(contactMethod) {
                    case 'telegram':
                        const telegram = document.getElementById('telegramUsername').value.trim();
                        contactValid = telegram.length > 0;
                        break;
                    case 'phone':
                        const phone = document.getElementById('phoneNumber').value.trim();
                        contactValid = phone.length >= 9;
                        break;
                    case 'email':
                        const email = document.getElementById('emailAddress').value.trim();
                        contactValid = email.includes('@') && email.includes('.');
                        break;
                }
                
                if (!contactValid) {
                    alert('Iltimos, tgri aloqa malumotini kiriting!');
                    return false;
                }
                return true;
                
            case 3:
                const productType = document.getElementById('productTypeSelect').value;
                if (!productType) {
                    alert('Iltimos, mahsulot turini tanlang!');
                    return false;
                }
                
                // Akkaunt ma'lumotlari validatsiyasi
                let accountValid = false;
                switch(productType) {
                    case 'game':
                        const gameAccount = document.getElementById('gameAccount').value.trim();
                        accountValid = gameAccount.length > 0;
                        break;
                    case 'telegram':
                        const telegramAccount = document.getElementById('telegramAccount').value.trim();
                        accountValid = telegramAccount.length > 0;
                        break;
                }
                
                if (!accountValid) {
                    alert('Iltimos, akkaunt malumotlarini kiriting!');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    saveStepData(step) {
        switch(step) {
            case 2:
                this.customerInfo.name = document.getElementById('customerName').value.trim();
                this.customerInfo.contactMethod = document.getElementById('contactMethod').value;
                
                switch(this.customerInfo.contactMethod) {
                    case 'telegram':
                        this.customerInfo.contact = '@' + document.getElementById('telegramUsername').value.trim();
                        break;
                    case 'phone':
                        this.customerInfo.contact = document.getElementById('phoneNumber').value.trim();
                        break;
                    case 'email':
                        this.customerInfo.contact = document.getElementById('emailAddress').value.trim();
                        break;
                }
                break;
                
            case 3:
                this.productType = document.getElementById('productTypeSelect').value;
                this.customerInfo.notes = document.getElementById('orderNotes').value.trim();
                
                switch(this.productType) {
                    case 'game':
                        this.customerInfo.gameType = document.getElementById('gameType').value;
                        this.customerInfo.gameAccount = document.getElementById('gameAccount').value.trim();
                        break;
                    case 'telegram':
                        this.customerInfo.telegramAccount = document.getElementById('telegramAccount').value.trim();
                        break;
                }
                break;
        }
    }
    
    async submitOrder() {
        const loading = document.getElementById('loadingIndicator');
        const submitText = document.getElementById('submitText');
        
        if (loading && submitText) {
            loading.style.display = 'flex';
            submitText.style.display = 'none';
        }
        
        try {
            // 1. Buyurtma ID yaratish
            const orderId = 'KENT-' + Date.now().toString().slice(-6);
            const total = this.calculateTotal();
            
            // 2. Buyurtma ma'lumotlarini tayyorlash
            const orderData = {
                id: orderId,
                customerName: this.customerInfo.name,
                customerContact: this.customerInfo.contact,
                contactMethod: this.customerInfo.contactMethod,
                productType: this.productType,
                gameType: this.customerInfo.gameType,
                gameAccount: this.customerInfo.gameAccount,
                telegramAccount: this.customerInfo.telegramAccount,
                items: this.cart,
                total: total,
                notes: this.customerInfo.notes,
                status: 'yangi',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                history: [{
                    status: 'yangi',
                    date: new Date().toISOString(),
                    message: 'Buyurtma yaratildi'
                }]
            };
            
            // 3. Telegramga yuborish
            const telegramMessage = this.generateTelegramMessage(orderData);
            const telegramUrl = `https://t.me/ownerkents?text=${encodeURIComponent(telegramMessage)}`;
            
            // 4. Telegramga ochish
            setTimeout(() => {
                window.open(telegramUrl, '_blank');
                
                // 5. Savatni tozalash
                this.cart = [];
                localStorage.setItem('kents_cart', JSON.stringify([]));
                
                // 6. Modalni yopish
                const cartModal = document.querySelector('.cart-modal');
                if (cartModal) cartModal.style.display = 'none';
                
                // 7. Xabarnoma ko'rsatish
                this.showNotification(`✅ Buyurtma #${orderId} yuborildi!`);
                
                // 8. Formani reset qilish
                this.resetForm();
                
            }, 1000);
            
        } catch (error) {
            console.error('Order submission error:', error);
            this.showNotification('❌ Xatolik yuz berdi!', 'error');
        } finally {
            if (loading && submitText) {
                loading.style.display = 'none';
                submitText.style.display = 'block';
            }
        }
    }
    
    generateTelegramMessage(orderData) {
        let message = `🆕 *YANGI BUYURTMA* #${orderData.id}\n\n`;
        
        // Mijoz ma'lumotlari
        message += `👤 *Mijoz:* ${orderData.customerName}\n`;
        message += `📞 *Aloqa:* ${orderData.customerContact} (${orderData.contactMethod})\n\n`;
        
        // Mahsulot ma'lumotlari
        message += `🏷 *Mahsulot turi:* ${this.getProductTypeText(orderData.productType)}\n`;
        
        if (orderData.gameType) {
            message += `🎮 *O'yin turi:* ${this.getGameTypeText(orderData.gameType)}\n`;
        }
        
        // Akkaunt ma'lumotlari
        if (orderData.gameAccount) {
            message += `🔐 *O'yin akkaunti:* ${orderData.gameAccount}\n`;
        }
        if (orderData.telegramAccount) {
            message += `📱 *Telegram akkaunti:* @${orderData.telegramAccount}\n`;
        }
        
        message += `\n📦 *Mahsulotlar:*\n`;
        orderData.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.quantity} dona\n`;
        });
        
        message += `\n💰 *Jami summa:* ${orderData.total.toLocaleString()} UZS\n`;
        
        if (orderData.notes) {
            message += `\n📝 *Mijoz izohi:* ${orderData.notes}\n`;
        }
        
        message += `\n📅 *Sana:* ${new Date().toLocaleString('uz-UZ')}\n`;
        message += `📍 *Manzil:* ${window.location.href}\n`;
        
        return message;
    }
    
    getProductTypeText(type) {
        const types = {
            'game': '🎮 O\'yin donatlari',
            'telegram': '📱 Telegram mahsulotlari'
            // Kriptovalyuta o'chirildi
        };
        return types[type] || type;
    }
    
    getGameTypeText(type) {
        const games = {
            'standoff': 'Standoff 2',
            'pubg': 'PUBG Mobile',
            'brawl': 'Brawl Stars',
            'mlbb': 'Mobile Legends',
            'roblox': 'Roblox'
        };
        return games[type] || type;
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4cc9f0' : '#ff4757'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    resetForm() {
        this.currentStep = 1;
        this.customerInfo = {};
        this.productType = '';
    }
}

// Global OrderForm obyekti
window.OrderForm = OrderForm;

// Sayt yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    window.orderForm = new OrderForm();
});