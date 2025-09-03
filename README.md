# 🛍️ Miribela - E-commerce de Calçados Femininos

![Miribela Logo](Miribela/imagens/Logo%20Miribela.png)

Um e-commerce moderno e elegante especializado em calçados femininos, desenvolvido com as melhores práticas de desenvolvimento web e focado na experiência do usuário.

## ✨ Características Principais

### 🎨 Design Moderno
- Interface elegante e intuitiva
- Design responsivo para todos os dispositivos
- Animações suaves e transições fluidas
- Paleta de cores sofisticada (dourado e tons neutros)
- Tipografia premium (Playfair Display + Roboto)

### 🛒 Funcionalidades Avançadas
- **Carrinho Inteligente**: Persistência local, controle de quantidade, cálculo automático
- **Sistema de Filtros**: Por categoria (Todos, Novidades, Premium)
- **Busca em Tempo Real**: Pesquisa instantânea nos produtos
- **Modal de Detalhes**: Visualização ampliada com seleção de tamanhos
- **Notificações Toast**: Feedback visual para todas as ações
- **Formulário de Contato**: Validação em tempo real e envio seguro
- **Newsletter**: Sistema de inscrição com validação de email

### 📱 Responsividade Total
- **Desktop**: Layout otimizado para telas grandes (1200px+)
- **Laptop**: Adaptação perfeita para notebooks (992px+)
- **Tablet**: Interface otimizada para tablets (768px+)
- **Mobile**: Experiência mobile-first (576px+)

### ♿ Acessibilidade (WCAG 2.1)
- Navegação por teclado completa
- Skip links para navegação rápida
- ARIA labels e roles semânticos
- Contraste adequado em todos os elementos
- Textos alternativos em todas as imagens
- Estados focáveis visíveis

### 🚀 Performance
- Lazy loading de imagens
- Preload de recursos críticos
- Otimização de animações
- Debounce em buscas
- Throttle em eventos de scroll
- Armazenamento local eficiente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Variáveis CSS, Grid, Flexbox, animações modernas
- **JavaScript ES6+**: Classes, módulos, async/await, Map/Set
- **Font Awesome 6.4.0**: Ícones modernos e consistentes
- **Google Fonts**: Tipografia premium

### Funcionalidades JavaScript
- **Sistema de Notificações**: Toast notifications com diferentes tipos
- **Carrinho Avançado**: Persistência, validação, cálculos automáticos
- **Filtros e Busca**: Sistema de filtragem em tempo real
- **Modais Interativos**: Abertura/fechamento suave com animações
- **Formulários Inteligentes**: Validação em tempo real
- **Scroll Animations**: Animações baseadas em Intersection Observer
- **Menu Mobile**: Navegação responsiva com animações

## 📁 Estrutura do Projeto

```
Miribela/
├── index.html              # Página principal
├── style.css               # Estilos principais
├── script.js               # JavaScript moderno
├── imagens/                # Assets de imagem
│   ├── Logo Miribela.png   # Logo da marca
│   ├── Sandália 1 Miribela.png
│   ├── Sandalia 2 Miribela.png
│   └── Sandalia 3 miribela.png
└── README.md               # Documentação
```

## 🎯 Funcionalidades Detalhadas

### 🛒 Sistema de Carrinho
- **Adicionar Produtos**: Clique simples para adicionar ao carrinho
- **Controle de Quantidade**: Botões +/- para ajustar quantidades
- **Remoção Individual**: Remover itens específicos
- **Limpeza Total**: Opção para esvaziar o carrinho
- **Persistência**: Dados salvos no localStorage
- **Cálculo Automático**: Total atualizado em tempo real
- **Finalização via WhatsApp**: Integração direta com WhatsApp

### 🔍 Sistema de Busca e Filtros
- **Filtros por Categoria**: Todos, Novidades, Premium
- **Busca em Tempo Real**: Pesquisa instantânea por nome/descrição
- **Debounce**: Otimização de performance na busca
- **Contador de Resultados**: Mostra quantos produtos foram encontrados
- **Animações**: Transições suaves ao filtrar

### 📋 Formulário de Contato
- **Validação em Tempo Real**: Feedback imediato nos campos
- **Campos Obrigatórios**: Nome, email e mensagem
- **Validação de Email**: Regex para verificar formato
- **Estados Visuais**: Campos com erro/sucesso destacados
- **Simulação de Envio**: Loading state e feedback

### 📧 Newsletter
- **Validação de Email**: Verificação de formato válido
- **Feedback Visual**: Confirmação de inscrição
- **Reset Automático**: Limpeza do formulário após envio

### 📱 Menu Mobile
- **Hamburger Menu**: Menu colapsável para mobile
- **Animações**: Transições suaves de abertura/fechamento
- **Auto-close**: Fecha automaticamente ao clicar em links
- **Responsivo**: Adapta-se ao redimensionamento da tela

## 🎨 Design System

### Paleta de Cores
```css
--color-primary: #d4af37;        /* Dourado principal */
--color-primary-dark: #b8941f;   /* Dourado escuro */
--color-primary-light: #f4e4a6;  /* Dourado claro */
--color-secondary: #8b4513;      /* Marrom */
--color-accent: #ff6b6b;         /* Coral para destaques */
--color-text: #2c3e50;           /* Azul escuro para texto */
--color-text-light: #7f8c8d;     /* Cinza para texto secundário */
--color-background: #fefefe;     /* Branco quase puro */
--color-background-light: #f8f9fa; /* Cinza muito claro */
```

### Tipografia
- **Títulos**: Playfair Display (serif elegante)
- **Corpo**: Roboto (sans-serif moderna)
- **Hierarquia**: 8 tamanhos de fonte (xs a 4xl)

### Espaçamento
- **Sistema Consistente**: 8 tamanhos de espaçamento
- **Responsivo**: Adapta-se ao tamanho da tela
- **Harmônico**: Proporções baseadas em escala

### Sombras
- **5 Níveis**: xs, sm, md, lg, xl
- **Consistência**: Mesma direção e blur
- **Profundidade**: Cria hierarquia visual

## 🚀 Como Executar

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/miribela.git
cd miribela
```

### 2. Abra no Navegador
```bash
# Opção 1: Abrir diretamente
open Miribela/index.html

# Opção 2: Servidor local (recomendado)
python -m http.server 8000
# ou
npx serve Miribela
```

### 3. Acesse
- **Local**: `http://localhost:8000`
- **Direto**: Abra `Miribela/index.html` no navegador

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS, Android)

## 🔧 Configurações

### Personalização de Cores
Edite as variáveis CSS em `style.css`:
```css
:root {
    --color-primary: #sua-cor;
    --color-primary-dark: #sua-cor-escura;
    /* ... outras variáveis */
}
```

### Configurações JavaScript
Ajuste as configurações em `script.js`:
```javascript
const CONFIG = {
    CARRINHO_STORAGE_KEY: 'miribela_carrinho',
    TOAST_DURATION: 4000,
    ANIMATION_DURATION: 300
};
```

## 📊 Performance

### Métricas Otimizadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Otimizações Implementadas
- Lazy loading de imagens
- Preload de recursos críticos
- Debounce em buscas
- Throttle em scroll events
- CSS otimizado com variáveis
- JavaScript modular e eficiente

## 🔒 Segurança

### Medidas Implementadas
- Validação de entrada em formulários
- Sanitização de dados
- Prevenção de XSS
- HTTPS ready
- Content Security Policy ready

## 📈 SEO

### Otimizações
- Meta tags completas
- Open Graph para redes sociais
- Twitter Cards
- Estrutura semântica HTML5
- Schema.org markup ready
- Sitemap.xml ready
- Robots.txt ready

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- **HTML**: Semântico e acessível
- **CSS**: BEM methodology, variáveis CSS
- **JavaScript**: ES6+, classes, async/await
- **Comentários**: Em português, claros e objetivos

## 📝 Changelog

### v2.0.0 (2025-01-27)
- ✨ Sistema de notificações toast
- 🛒 Carrinho avançado com persistência
- 🔍 Filtros e busca em tempo real
- 📱 Modal de detalhes do produto
- 📋 Formulário de contato com validação
- 🎨 Design system moderno
- ♿ Melhorias de acessibilidade
- 📱 Responsividade aprimorada
- 🚀 Performance otimizada

### v1.0.0 (2025-01-26)
- 🎉 Lançamento inicial
- 🛒 Carrinho básico
- 📱 Design responsivo
- 📧 Newsletter

## 📞 Contato

### Miribela
- **Email**: mirebela.contato@gmail.com
- **WhatsApp**: [(71) 99210-4877](https://wa.me/5571992104877)
- **Instagram**: [@ton_rcg](https://www.instagram.com/ton_rcg/)

### Desenvolvedor
- **GitHub**: [Seu GitHub](https://github.com/seu-usuario)
- **LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)
- **Portfolio**: [Seu Portfolio](https://seu-portfolio.com)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Font Awesome** pelos ícones incríveis
- **Google Fonts** pelas tipografias premium
- **Comunidade Web** pelas melhores práticas
- **Usuários** pelo feedback valioso

---

<div align="center">

**Desenvolvido com ❤️ para a Miribela**

*Conforto e elegância em cada passo*

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/miribela?style=social)](https://github.com/seu-usuario/miribela)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/miribela?style=social)](https://github.com/seu-usuario/miribela)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/miribela)](https://github.com/seu-usuario/miribela/issues)

</div>