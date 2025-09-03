// Miribela E-commerce - JavaScript Moderno
// Versão 2.0 - Funcionalidades Avançadas

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    CARRINHO_STORAGE_KEY: 'miribela_carrinho',
    TOAST_DURATION: 4000,
    ANIMATION_DURATION: 300
};

// ===== UTILITÁRIOS =====
class Utils {
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    static parseCurrency(value) {
        return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.notifications = new Map();
    }

    show(message, type = 'success', duration = CONFIG.TOAST_DURATION) {
        const id = Utils.generateId();
        const notification = this.createNotification(id, message, type);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            this.remove(id);
        }, duration);

        return id;
    }

    createNotification(id, message, type) {
        const notification = document.createElement('div');
        notification.className = `toast ${type}`;
        notification.dataset.id = id;
        
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="notificationSystem.remove('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        return notification;
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(id);
            }, CONFIG.ANIMATION_DURATION);
        }
    }
}

// ===== SISTEMA DE CARRINHO AVANÇADO =====
class Carrinho {
    constructor() {
        this.itens = new Map();
        this.modal = document.getElementById('carrinho-modal');
        this.itensContainer = document.getElementById('itens-carrinho');
        this.totalElement = document.getElementById('total-carrinho');
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateUI();
        this.updateBadge();
    }

    setupEventListeners() {
        // Eventos dos botões de adicionar ao carrinho
        document.addEventListener('click', (e) => {
            if (e.target.closest('.adicionar-carrinho')) {
                e.preventDefault();
                this.handleAddToCart(e.target.closest('.adicionar-carrinho'));
            }
        });

        // Eventos do modal
        document.getElementById('carrinho-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.abrirModal();
        });

        document.querySelector('.close-modal')?.addEventListener('click', () => {
            this.fecharModal();
        });

        document.getElementById('finalizar-pedido')?.addEventListener('click', () => {
            this.finalizarPedido();
        });

        document.getElementById('limpar-carrinho')?.addEventListener('click', () => {
            this.limparCarrinho();
        });

        // Fechar modal com ESC ou clique fora
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.fecharModal();
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fecharModal();
            }
        });
    }

    handleAddToCart(button) {
        const produtoCard = button.closest('.produto-card');
        const produto = this.extractProductData(produtoCard);
        
        if (produto) {
            this.adicionarItem(produto);
            notificationSystem.show(`${produto.nome} adicionado ao carrinho!`, 'success');
        }
    }

    extractProductData(produtoCard) {
        try {
            const nome = produtoCard.querySelector('h3')?.textContent?.trim();
            const preco = produtoCard.querySelector('.preco')?.textContent?.trim();
            const imagem = produtoCard.querySelector('img')?.src;
            const descricao = produtoCard.querySelector('.produto-descricao')?.textContent?.trim();
            const categoria = produtoCard.dataset.categoria;

            if (!nome || !preco || !imagem) {
                throw new Error('Dados do produto incompletos');
            }

            return {
                id: Utils.generateId(),
                nome,
                preco: Utils.parseCurrency(preco),
                precoFormatado: preco,
                imagem,
                descricao: descricao || '',
                categoria: categoria || 'geral',
                quantidade: 1,
                dataAdicao: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erro ao extrair dados do produto:', error);
            notificationSystem.show('Erro ao adicionar produto ao carrinho', 'error');
            return null;
        }
    }

    adicionarItem(produto) {
        const existingItem = Array.from(this.itens.values())
            .find(item => item.nome === produto.nome);

        if (existingItem) {
            existingItem.quantidade += 1;
        } else {
            this.itens.set(produto.id, produto);
        }

        this.saveToStorage();
        this.updateUI();
        this.updateBadge();
    }

    removerItem(id) {
        if (this.itens.has(id)) {
            this.itens.delete(id);
            this.saveToStorage();
            this.updateUI();
            this.updateBadge();
            notificationSystem.show('Item removido do carrinho', 'info');
        }
    }

    atualizarQuantidade(id, quantidade) {
        if (this.itens.has(id) && quantidade > 0) {
            this.itens.get(id).quantidade = quantidade;
            this.saveToStorage();
            this.updateUI();
            this.updateBadge();
        } else if (quantidade <= 0) {
            this.removerItem(id);
        }
    }

    limparCarrinho() {
        if (this.itens.size > 0) {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                this.itens.clear();
                this.saveToStorage();
                this.updateUI();
                this.updateBadge();
                notificationSystem.show('Carrinho limpo', 'info');
            }
        }
    }

    updateUI() {
        this.itensContainer.innerHTML = '';

        if (this.itens.size === 0) {
            this.itensContainer.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <a href="#produtos" class="btn btn-outline" onclick="carrinho.fecharModal()">
                        Continuar Comprando
                    </a>
                </div>
            `;
            this.totalElement.textContent = 'R$ 0,00';
            return;
        }

        let total = 0;

        this.itens.forEach((item, id) => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'item-carrinho';
            itemElement.innerHTML = `
                <div class="item-info">
                    <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
                    <div class="item-details">
                        <h4>${item.nome}</h4>
                        <p class="item-price">${Utils.formatCurrency(item.preco)}</p>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="carrinho.atualizarQuantidade('${id}', ${item.quantidade - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantidade}</span>
                            <button class="qty-btn" onclick="carrinho.atualizarQuantidade('${id}', ${item.quantidade + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-total">${Utils.formatCurrency(itemTotal)}</div>
                    <button class="remover-item" onclick="carrinho.removerItem('${id}')" title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.itensContainer.appendChild(itemElement);
        });

        this.totalElement.textContent = Utils.formatCurrency(total);
    }

    updateBadge() {
        const badge = document.querySelector('.carrinho-badge');
        const totalItens = Array.from(this.itens.values())
            .reduce((total, item) => total + item.quantidade, 0);

        if (badge) {
            badge.textContent = totalItens;
            badge.style.display = totalItens > 0 ? 'block' : 'none';
        }
    }

    abrirModal() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            this.modal.style.opacity = '1';
            this.modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        });
    }

    fecharModal() {
        this.modal.style.opacity = '0';
        this.modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, CONFIG.ANIMATION_DURATION);
    }

    finalizarPedido() {
        if (this.itens.size === 0) {
            notificationSystem.show('Seu carrinho está vazio!', 'warning');
            return;
        }

        const total = Array.from(this.itens.values())
            .reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

        const resumo = Array.from(this.itens.values())
            .map(item => `${item.nome} (${item.quantidade}x ${Utils.formatCurrency(item.preco)})`)
            .join('\n');

        const mensagem = `🛍️ *Pedido Miribela*\n\n` +
            `📋 *Itens:*\n${resumo}\n\n` +
            `💰 *Total: ${Utils.formatCurrency(total)}*\n\n` +
            `📞 *Contato:* (71) 99210-4877\n` +
            `📧 *Email:* mirebela.contato@gmail.com\n\n` +
            `Obrigado por escolher a Miribela! 💕`;

        // Abrir WhatsApp com a mensagem
        const whatsappUrl = `https://wa.me/5571992104877?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');

        notificationSystem.show('Redirecionando para o WhatsApp...', 'success');
        
        // Limpar carrinho após finalizar
        setTimeout(() => {
            this.limparCarrinho();
            this.fecharModal();
        }, 2000);
    }

    saveToStorage() {
        try {
            const data = Array.from(this.itens.entries());
            localStorage.setItem(CONFIG.CARRINHO_STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(CONFIG.CARRINHO_STORAGE_KEY);
            if (data) {
                const items = JSON.parse(data);
                this.itens = new Map(items);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            this.itens = new Map();
        }
    }
}

// ===== SISTEMA DE FILTROS E BUSCA =====
class FiltroBusca {
    constructor() {
        this.produtos = [];
        this.filtroAtivo = 'todos';
        this.termoBusca = '';
        this.init();
    }

    init() {
        this.carregarProdutos();
        this.setupEventListeners();
    }

    carregarProdutos() {
        const produtoCards = document.querySelectorAll('.produto-card');
        this.produtos = Array.from(produtoCards).map(card => ({
            element: card,
            nome: card.dataset.nome || '',
            categoria: card.dataset.categoria || 'geral',
            texto: this.extrairTextoProduto(card)
        }));
    }

    extrairTextoProduto(card) {
        const nome = card.querySelector('h3')?.textContent?.toLowerCase() || '';
        const descricao = card.querySelector('.produto-descricao')?.textContent?.toLowerCase() || '';
        return `${nome} ${descricao}`;
    }

    setupEventListeners() {
        // Filtros
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFiltroAtivo(e.target.dataset.filtro);
            });
        });

        // Busca
        const buscaInput = document.getElementById('busca-produtos');
        if (buscaInput) {
            const debouncedSearch = Utils.debounce((termo) => {
                this.setTermoBusca(termo);
            }, 300);

            buscaInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }

    setFiltroAtivo(filtro) {
        this.filtroAtivo = filtro;
        
        // Atualizar botões
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filtro === filtro);
        });

        this.aplicarFiltros();
    }

    setTermoBusca(termo) {
        this.termoBusca = termo.toLowerCase();
        this.aplicarFiltros();
    }

    aplicarFiltros() {
        this.produtos.forEach(({ element, nome, categoria, texto }) => {
            const passaFiltro = this.filtroAtivo === 'todos' || categoria === this.filtroAtivo;
            const passaBusca = !this.termoBusca || texto.includes(this.termoBusca);
            
            const deveMostrar = passaFiltro && passaBusca;
            
            element.style.display = deveMostrar ? 'block' : 'none';
            
            if (deveMostrar) {
                element.style.animation = 'fadeInUp 0.5s ease';
            }
        });

        this.atualizarContador();
    }

    atualizarContador() {
        const produtosVisiveis = this.produtos.filter(({ element }) => 
            element.style.display !== 'none'
        ).length;

        const contador = document.querySelector('.produtos-contador');
        if (contador) {
            contador.textContent = `${produtosVisiveis} produto(s) encontrado(s)`;
        }
    }
}

// ===== MODAL DE DETALHES DO PRODUTO =====
class ModalProduto {
    constructor() {
        this.modal = document.getElementById('produto-modal');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botões de ver detalhes
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-ver-detalhes')) {
                e.preventDefault();
                const produtoCard = e.target.closest('.produto-card');
                this.abrirModal(produtoCard);
            }
        });

        // Fechar modal
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            this.fecharModal();
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.fecharModal();
            }
        });

        // Fechar ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fecharModal();
            }
        });

        // Seleção de tamanhos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tamanho')) {
                this.selecionarTamanho(e.target);
            }
        });

        // Adicionar ao carrinho no modal
        document.getElementById('adicionar-carrinho-modal')?.addEventListener('click', () => {
            this.adicionarAoCarrinho();
        });
    }

    abrirModal(produtoCard) {
        const produto = this.extrairDadosProduto(produtoCard);
        this.popularModal(produto);
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            this.modal.style.opacity = '1';
            this.modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        });
    }

    extrairDadosProduto(card) {
        return {
            nome: card.querySelector('h3')?.textContent?.trim() || '',
            descricao: card.querySelector('.produto-descricao')?.textContent?.trim() || '',
            preco: card.querySelector('.preco')?.textContent?.trim() || '',
            imagem: card.querySelector('img')?.src || '',
            categoria: card.dataset.categoria || 'geral'
        };
    }

    popularModal(produto) {
        document.getElementById('produto-modal-title').textContent = produto.nome;
        document.getElementById('produto-modal-descricao').textContent = produto.descricao;
        document.getElementById('produto-modal-preco').textContent = produto.preco;
        document.getElementById('produto-modal-img').src = produto.imagem;
        document.getElementById('produto-modal-img').alt = produto.nome;

        // Gerar tamanhos
        this.gerarTamanhos();
    }

    gerarTamanhos() {
        const container = document.getElementById('tamanhos-selecao');
        const tamanhos = ['35', '36', '37', '38', '39', '40'];
        
        container.innerHTML = tamanhos.map(tamanho => 
            `<span class="tamanho" data-tamanho="${tamanho}">${tamanho}</span>`
        ).join('');
    }

    selecionarTamanho(elemento) {
        // Remover seleção anterior
        document.querySelectorAll('.tamanho').forEach(t => t.classList.remove('selected'));
        
        // Selecionar novo tamanho
        elemento.classList.add('selected');
    }

    adicionarAoCarrinho() {
        const tamanhoSelecionado = document.querySelector('.tamanho.selected');
        
        if (!tamanhoSelecionado) {
            notificationSystem.show('Por favor, selecione um tamanho', 'warning');
            return;
        }

        // Simular adição ao carrinho
        notificationSystem.show('Produto adicionado ao carrinho!', 'success');
        this.fecharModal();
    }

    fecharModal() {
        this.modal.style.opacity = '0';
        this.modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, CONFIG.ANIMATION_DURATION);
    }
}

// ===== SISTEMA DE FORMULÁRIOS =====
class FormularioContato {
    constructor() {
        this.form = document.getElementById('contato-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validação em tempo real
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'email':
                isValid = Utils.validateEmail(value);
                message = isValid ? '' : 'Email inválido';
                break;
            default:
                isValid = value.length > 0;
                message = isValid ? '' : 'Campo obrigatório';
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        field.classList.toggle('error', !isValid);
        field.classList.toggle('success', isValid && field.value.trim());

        if (!isValid && message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Validar todos os campos
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let allValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            notificationSystem.show('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // Mostrar loading
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            notificationSystem.show('Mensagem enviada com sucesso!', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            notificationSystem.show('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ===== NEWSLETTER =====
class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const email = this.form.querySelector('input[type="email"]').value.trim();

        if (!Utils.validateEmail(email)) {
            notificationSystem.show('Por favor, insira um email válido', 'error');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Assinando...';
        submitBtn.disabled = true;

        try {
            // Simular assinatura
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            notificationSystem.show('Obrigado por se inscrever na nossa newsletter!', 'success');
            this.form.reset();
            
        } catch (error) {
            notificationSystem.show('Erro ao assinar newsletter. Tente novamente.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ===== MENU MOBILE =====
class MenuMobile {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.navigation ul');
        this.init();
    }

    init() {
        if (this.menuToggle && this.navMenu) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Fechar menu ao clicar em um link
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.fecharMenu();
            }
        });

        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.fecharMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('show');
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Animar ícone
        const icon = this.menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    }

    fecharMenu() {
        this.navMenu.classList.remove('show');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        const icon = this.menuToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
}

// ===== SCROLL SUAVE E ANIMAÇÕES =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupScrollAnimations();
        this.setupBackToTop();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.querySelectorAll('.produto-card, .destaque, .contato-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupBackToTop() {
        // Criar botão de voltar ao topo
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        document.body.appendChild(backToTopBtn);

        // Mostrar/ocultar botão baseado no scroll
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);

        // Funcionalidade do botão
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== INICIALIZAÇÃO =====
class App {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        try {
            // Inicializar sistemas
            window.notificationSystem = new NotificationSystem();
            window.carrinho = new Carrinho();
            window.filtroBusca = new FiltroBusca();
            window.modalProduto = new ModalProduto();
            window.formularioContato = new FormularioContato();
            window.newsletter = new Newsletter();
            window.menuMobile = new MenuMobile();
            window.scrollAnimations = new ScrollAnimations();

            // Adicionar estilos para botão de voltar ao topo
            this.addBackToTopStyles();

            console.log('🚀 Miribela E-commerce inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            notificationSystem?.show('Erro ao carregar a aplicação', 'error');
        }
    }

    addBackToTopStyles() {
        const styles = `
            .back-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--color-primary);
                color: var(--color-white);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: var(--shadow-md);
            }
            
            .back-to-top.show {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                background: var(--color-primary-dark);
                transform: translateY(-2px);
            }
            
            .field-error {
                color: var(--color-error);
                font-size: var(--font-size-sm);
                margin-top: var(--spacing-xs);
            }
            
            .form-group input.error,
            .form-group textarea.error {
                border-color: var(--color-error);
            }
            
            .form-group input.success,
            .form-group textarea.success {
                border-color: var(--color-success);
            }
            
            .carrinho-vazio {
                text-align: center;
                padding: var(--spacing-3xl);
                color: var(--color-text-light);
            }
            
            .carrinho-vazio i {
                font-size: 3rem;
                margin-bottom: var(--spacing-lg);
                color: var(--color-text-muted);
            }
            
            .quantity-controls {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-sm);
            }
            
            .qty-btn {
                width: 30px;
                height: 30px;
                border: 1px solid var(--color-border);
                background: var(--color-white);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .qty-btn:hover {
                background: var(--color-primary);
                color: var(--color-white);
                border-color: var(--color-primary);
            }
            
            .quantity {
                font-weight: 600;
                min-width: 20px;
                text-align: center;
            }
            
            .item-actions {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: var(--spacing-sm);
            }
            
            .item-total {
                font-weight: 600;
                color: var(--color-primary);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .toast-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: var(--spacing-xs);
                margin-left: auto;
            }
            
            .produtos-contador {
                text-align: center;
                color: var(--color-text-light);
                font-size: var(--font-size-sm);
                margin-bottom: var(--spacing-lg);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// ===== INICIALIZAR APLICAÇÃO =====
new App();
