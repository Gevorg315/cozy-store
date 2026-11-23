import { filterProducts } from '../catalog/filterProducts';
import { sortProducts, type SortOption } from '../catalog/sortProducts';
import { products } from '../data/products';
import type { Product } from '../types/product';

const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  className = '',
  text = '',
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
};

const createProductCard = (
  product: Product,
  onAddToCart: (product: Product) => void,
): HTMLElement => {
  const card = createElement('article', 'product-card');

  const imagePlaceholder = createElement(
    'div',
    `product-image product-image-${product.category.toLowerCase()}`,
    product.category,
  );

  const details = createElement('div', 'product-details');
  const category = createElement('p', 'product-category', product.category);
  const name = createElement('h3', 'product-name', product.name);
  const description = createElement('p', 'product-description', product.description);

  const bottom = createElement('div', 'product-bottom');
  const price = createElement('span', 'product-price', `$${product.price.toFixed(2)}`);

  const addButton = createElement('button', 'add-to-cart-button', 'Add to cart');
  addButton.type = 'button';
  addButton.addEventListener('click', () => onAddToCart(product));

  bottom.append(price, addButton);
  details.append(category, name, description, bottom);
  card.append(imagePlaceholder, details);

  return card;
};

export const createCatalogPage = (
  onAddToCart: (product: Product) => void,
): HTMLElement => {
  const section = createElement('section', 'catalog-page');

  const heading = createElement('div', 'catalog-heading');
  const eyebrow = createElement('p', 'eyebrow', 'THE COZY COLLECTION');
  const title = createElement('h1', 'catalog-title', 'Find your cozy.');
  const subtitle = createElement(
    'p',
    'catalog-subtitle',
    'Thoughtful details for a home you love.',
  );

  heading.append(eyebrow, title, subtitle);

  const filters = createElement('div', 'catalog-filters');

  const searchInput = createElement('input', 'filter-input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search products...';
  searchInput.setAttribute('aria-label', 'Search products');

  const categorySelect = createElement('select', 'filter-input');
  categorySelect.setAttribute('aria-label', 'Filter by category');

  const categories = ['All categories', 'Kitchen', 'Lighting', 'Home', 'Decor'];

  categories.forEach((categoryName) => {
    const option = createElement('option', '', categoryName);
    option.value = categoryName === 'All categories' ? '' : categoryName;
    categorySelect.append(option);
  });

  const minPriceInput = createElement('input', 'filter-input');
  minPriceInput.type = 'number';
  minPriceInput.min = '0';
  minPriceInput.placeholder = 'Min price';
  minPriceInput.setAttribute('aria-label', 'Minimum price');

  const maxPriceInput = createElement('input', 'filter-input');
  maxPriceInput.type = 'number';
  maxPriceInput.min = '0';
  maxPriceInput.placeholder = 'Max price';
  maxPriceInput.setAttribute('aria-label', 'Maximum price');

  const sortSelect = createElement('select', 'filter-input');
  sortSelect.setAttribute('aria-label', 'Sort products');

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default order' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
  ];

  sortOptions.forEach((sortOption) => {
    const option = createElement('option', '', sortOption.label);
    option.value = sortOption.value;
    sortSelect.append(option);
  });

  filters.append(searchInput, categorySelect, minPriceInput, maxPriceInput, sortSelect);

  const resultsLabel = createElement('p', 'results-label');
  const grid = createElement('div', 'product-grid');

  const renderProducts = (): void => {
    const minPrice =
      minPriceInput.value.trim() === '' ? undefined : Number(minPriceInput.value);

    const maxPrice =
      maxPriceInput.value.trim() === '' ? undefined : Number(maxPriceInput.value);

    const filteredProducts = filterProducts(products, {
      search: searchInput.value,
      category: categorySelect.value || undefined,
      minPrice,
      maxPrice,
    });

    const visibleProducts = sortProducts(
      filteredProducts,
      sortSelect.value as SortOption,
    );

    resultsLabel.textContent = `${visibleProducts.length} products found`;
    grid.replaceChildren();

    if (visibleProducts.length === 0) {
      const emptyMessage = createElement(
        'p',
        'empty-message',
        'No products found. Try changing your filters.',
      );
      grid.append(emptyMessage);
      return;
    }

    visibleProducts.forEach((product) => {
      grid.append(createProductCard(product, onAddToCart));
    });
  };

  searchInput.addEventListener('input', renderProducts);
  categorySelect.addEventListener('change', renderProducts);
  minPriceInput.addEventListener('input', renderProducts);
  maxPriceInput.addEventListener('input', renderProducts);
  sortSelect.addEventListener('change', renderProducts);

  section.append(heading, filters, resultsLabel, grid);

  renderProducts();

  return section;
};
