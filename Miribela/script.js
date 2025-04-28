// Classes
class Carrinho {
    constructor() {
        this.itens = [];
        this.modal = document.getElementById('carrinho-modal');
        this.itensContainer = document.getElementById('itens-carrinho');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.atualizarCarrinho();
    }

    setupEventListeners() {
        document.querySelectorAll('.adicionar-carrinho').forEach(botao => {
            botao.addEventListener('click', () => this.adicionarItem(botao));
        });

        document.getElementById('carrinho-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.abrirModal();
        });

        document.querySelector('.close-modal').addEventListener('click', () => this.fecharModal());

        document.getElementById('finalizar-pedido').addEventListener('click', () => this.finalizarPedido());

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fecharModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.fecharModal();
            }
        });
    }

    adicionarItem(botao) {
        const produtoCard = botao.closest('.produto-card');
        const nomeProduto = produtoCard.querySelector('h3').innerText;
        const precoProduto = produtoCard.querySelector('.preco').innerText;
        const imagemProduto = produtoCard.querySelector('img').src;

        this.itens.push({
            nome: nomeProduto,
            preco: precoProduto,
            imagem: imagemProduto
        });

        this.mostrarMensagem(`${nomeProduto} adicionado ao carrinho!`);
        this.atualizarCarrinho();
    }

    mostrarMensagem(texto) {
        const mensagem = document.createElement('div');
        mensagem.className = 'mensagem-sucesso';
        mensagem.innerText = texto;
        document.body.appendChild(mensagem);

        setTimeout(() => {
            mensagem.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            mensagem.style.opacity = '0';
            setTimeout(() => mensagem.remove(), 400);
        }, 3000);
    }

    atualizarCarrinho() {
        this.itensContainer.innerHTML = '';

        if (this.itens.length === 0) {
            this.itensContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        const total = this.itens.reduce((acc, item) => {
            const preco = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
            return acc + preco;
        }, 0);

        this.itens.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-carrinho';
            itemElement.innerHTML = `
                <div class="item-info">
                    <img src="${item.imagem}" alt="${item.nome}" width="60" height="60">
                    <div>
                        <h4>${item.nome}</h4>
                        <p>${item.preco}</p>
                    </div>
                </div>
                <button class="remover-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            this.itensContainer.appendChild(itemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'total-carrinho';
        totalElement.innerHTML = `
            <p>Total: <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong></p>
        `;
        this.itensContainer.appendChild(totalElement);

        // Adicionar eventos para remover itens
        document.querySelectorAll('.remover-item').forEach(botao => {
            botao.addEventListener('click', () => {
                const index = parseInt(botao.dataset.index);
                this.itens.splice(index, 1);
                this.atualizarCarrinho();
            });
        });
    }

    abrirModal() {
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.style.opacity = '1';
            this.modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }

    fecharModal() {
        this.modal.style.opacity = '0';
        this.modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }

    finalizarPedido() {
        if (this.itens.length === 0) {
            this.mostrarMensagem('Seu carrinho está vazio!');
            return;
        }

        const resumo = this.itens.map(item => `${item.nome} (${item.preco})`).join('\n');
        const total = this.itens.reduce((acc, item) => {
            const preco = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
            return acc + preco;
        }, 0);

        const mensagem = `✅ Pedido Finalizado!\n\nItens:\n${resumo}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nObrigado por comprar na Mirebela!`;
        this.mostrarMensagem('Pedido finalizado com sucesso!');
        
        this.itens = [];
        this.atualizarCarrinho();
        this.fecharModal();
    }
}

class MenuMobile {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.navigation ul');
        this.init();
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
    }

    toggleMenu() {
        this.navMenu.classList.toggle('show');
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
    }
}

// Newsletter
class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.form.querySelector('input[type="email"]').value;
        
        // Simulação de envio
        setTimeout(() => {
            const mensagem = document.createElement('div');
            mensagem.className = 'mensagem-sucesso';
            mensagem.innerText = 'Obrigado por se inscrever!';
            document.body.appendChild(mensagem);

            setTimeout(() => {
                mensagem.style.opacity = '1';
            }, 100);

            setTimeout(() => {
                mensagem.style.opacity = '0';
                setTimeout(() => mensagem.remove(), 400);
            }, 3000);

            this.form.reset();
        }, 1000);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new Carrinho();
    new MenuMobile();
    new Newsletter();
});
