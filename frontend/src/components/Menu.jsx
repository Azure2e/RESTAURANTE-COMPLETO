// frontend/src/components/Menu.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

// Placeholder para imagem se não houver no backend ou falhar
const PLACEHOLDER_IMAGE = '/placeholder.png'; // Crie este arquivo em public/

/**
 * @typedef {Object} ProductAPI
 * @property {string} id - O ID único do produto.
 * @property {string} name - O nome do produto.
 * @property {string} description - A descrição do produto.
 * @property {number} price - O preço do produto.
 * @property {string} [imageUrl] - A URL da imagem do produto (opcional, pode vir vazia).
 * @property {string} [category] - A categoria do produto (opcional).
 * @property {boolean} available - Indica se o produto está disponível.
 */

/**
 * @typedef {Object} MenuItemFormatted
 * @property {string} id - O ID do item formatado.
 * @property {string} title - O título do item (nome do produto).
 * @property {string} desc - A descrição do item.
 * @property {string} price - O preço formatado como string "R$ X,XX".
 * @property {string} img - A URL da imagem ou o placeholder.
 * @property {boolean} available - Status de disponibilidade.
 * @property {string} category - A categoria do item.
 */

export default function Menu({ openModal }) {
  // Estado para armazenar todos os produtos recebidos da API
  const [products, setProducts] = useState([]);
  // Estado para controlar o status de carregamento
  const [loading, setLoading] = useState(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);
  // Hook do contexto do carrinho para adicionar itens
  const { addItem } = useCart();

  // Estados para a navegação por abas e busca
  // menuData vai armazenar os produtos organizados por categoria
  const [menuData, setMenuData] = useState({});
  // tab armazena a aba atualmente selecionada
  const [tab, setTab] = useState('entradas'); // Valor inicial, será ajustado no useEffect
  // query armazena o texto da busca
  const [query, setQuery] = useState('');

  // Função otimizada com useCallback para fazer fallback de imagem
  // Se a imagem principal falhar ao carregar, exibe uma imagem placeholder
  const fallbackImage = useCallback((e) => {
    e.target.onerror = null; // Previne loops infinitos de erro
    e.target.src = PLACEHOLDER_IMAGE; // Define a imagem de fallback
  }, []);

  // Efeito para buscar os produtos da API quando o componente é montado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Inicia o estado de carregamento
        const response = await fetch('http://localhost:3001/api/products'); // Faz a requisição à API

        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        /** @type {ProductAPI[]} */
        const data = await response.json(); // Converte a resposta para JSON
        setProducts(data); // Salva todos os produtos no estado 'products'

        // Organiza os produtos por categoria, para exibição nas abas
        const organizedMenu = data.reduce((acc, /** @type {ProductAPI} */ product) => {
          // Normaliza o nome da categoria para usar como chave
          const categoryKey = product.category ? product.category.toLowerCase().replace(/ /g, '') : 'outros';
          // Se a categoria ainda não existe no acumulador, cria um array para ela
          if (!acc[categoryKey]) {
            acc[categoryKey] = [];
          }
          // Adapta a estrutura do item da API para o formato esperado pelo seu front-end
          /** @type {MenuItemFormatted} */
          const formattedItem = {
            id: product.id, // Garante que o ID venha da API
            title: product.name,
            desc: product.description,
            price: `R$ ${product.price.toFixed(2).replace('.', ',')}`, // Formata para R$ X,XX
            img: product.imageUrl || PLACEHOLDER_IMAGE, // Usa a imagem da API ou placeholder
            available: product.available, // Adiciona status de disponibilidade
            category: product.category,
          };
          acc[categoryKey].push(formattedItem); // Adiciona o item formatado à sua categoria
          return acc;
        }, {});

        setMenuData(organizedMenu); // Atualiza o estado com os dados organizados

        // Define a aba inicial: prioriza o parâmetro 'tab' na URL, senão a primeira categoria encontrada, senão 'entradas'
        const firstCategory = Object.keys(organizedMenu)[0];
        if (firstCategory) {
            const urlParams = new URLSearchParams(window.location.search);
            const requestedTab = urlParams.get('tab');
            // Verifica se a aba requisitada na URL existe nas categorias
            if (requestedTab && organizedMenu[requestedTab]) {
                setTab(requestedTab);
            } else {
                setTab(firstCategory); // Define a primeira categoria como aba padrão
            }
        } else {
            setTab('entradas'); // Fallback se não houver categorias
        }

      } catch (e) {
        setError(e.message); // Armazena a mensagem de erro
        console.error("Erro ao buscar produtos:", e); // Loga o erro no console
        toast.error("Erro ao carregar o cardápio. Tente novamente mais tarde."); // Exibe notificação de erro
      } finally {
        setLoading(false); // Finaliza o estado de carregamento, mesmo em caso de erro
      }
    };

    fetchProducts(); // Chama a função de busca de produtos
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez na montagem do componente

  // Lógica para adicionar um item ao carrinho
  function handleAddToCart(item) {
    // Garante que o item possui um ID antes de adicionar ao carrinho
    if (!item.id) {
        toast.error("Não foi possível adicionar o item ao carrinho: ID ausente.");
        return;
    }
    addItem(item); // Adiciona o item ao carrinho através do contexto
    toast.success(`${item.title} adicionado ao carrinho!`); // Exibe notificação de sucesso
  }

  // Filtra os produtos da categoria atual com base na busca do usuário
  const currentCategoryItems = menuData[tab] || []; // Pega os itens da aba selecionada
  const filteredItems = currentCategoryItems.filter((it) =>
    // Converte título e descrição para minúsculas para uma busca case-insensitive
    (it.title + ' ' + it.desc).toLowerCase().includes(query.toLowerCase())
  );

  // Renderização condicional para estados de carregamento e erro
  if (loading) {
    return (
      <section id="cardapio" className="reveal">
        <h2>Cardápio</h2>
        <p>Carregando cardápio...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="cardapio" className="reveal">
        <h2>Cardápio</h2>
        <p style={{ color: 'red' }}>Erro ao carregar cardápio: {error}</p>
      </section>
    );
  }

  // Renderização do menu principal
  return (
    <section id="cardapio">
      <h2>Cardápio</h2>

      {/* Container dos botões de aba (categorias) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
        <div className="tab-buttons" role="tablist">
          {/* Mapeia as chaves (categorias) do menuData para criar botões de aba */}
          {Object.keys(menuData).map(key => (
            <button
              key={key}
              className={`tab-btn ${tab === key ? 'active' : ''}`} // Adiciona classe 'active' se for a aba selecionada
              onClick={() => { setTab(key); setQuery(''); }} // Ao clicar, muda a aba e limpa a busca
              role="tab"
              aria-selected={tab === key}
            >
              {key[0].toUpperCase() + key.slice(1)} {/* Capitaliza o nome da categoria para exibição */}
            </button>
          ))}
          {/* Mensagem se não houver categorias */}
          {Object.keys(menuData).length === 0 && <p>Nenhuma categoria disponível.</p>}
        </div>
      </div>

      {/* Campo de busca */}
      <div style={{ width: '100%', marginBottom: 18, textAlign: 'center' }}>
        <input
          type="search"
          placeholder="Buscar no cardápio — ex: carbonara, risotto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Atualiza o estado da busca ao digitar
          style={{ maxWidth: 620, width: '100%', padding: 12, borderRadius: 10, border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
        />
      </div>

      {/* Conteúdo da aba selecionada */}
      <div id={tab} className="tab-content active">
        <div className="menu-grid">
          {/* Mapeia os itens filtrados para renderizar os cards de prato */}
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx} // Usa o ID do item ou o índice como key
              className="prato reveal"
              onClick={() => openModal(item)} // Abre o modal ao clicar no prato
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') openModal(item) }} // Acessibilidade com teclado
            >
              <img src={item.img} alt={item.title} onError={fallbackImage} loading="lazy" />
              <div className="prato-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="preco">{item.price}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn-primary"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} // Impede que o clique se propague para o prato
                      disabled={!item.available} // Desabilita o botão se o item não estiver disponível
                      style={!item.available ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {item.available ? 'Adicionar' : 'Indisponível'}
                    </button>
                    <button className="btn-primary" style={{ background: '#999' }} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Mensagem se nenhum item for encontrado na busca/filtro */}
          {filteredItems.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Nenhum prato encontrado</p>}
        </div>
      </div>
    </section>
  );
}