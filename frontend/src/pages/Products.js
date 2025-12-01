import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { Filter, X, Grid, List, ArrowUpDown } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [priceDisplay, setPriceDisplay] = useState('full'); // 'full' or 'monthly'

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;
      if (priceRange[0] > 0) params.min_price = priceRange[0];
      if (priceRange[1] < 1000) params.max_price = priceRange[1];
      if (sortBy) params.sort_by = sortBy;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    if (value === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', value);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };

  return (
    <div data-testid="products-page" className="min-h-screen py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 data-testid="page-title" className="text-4xl font-bold mb-2">
              {search ? `Search Results for "${search}"` : 'All Products'}
            </h1>
            <p className="text-gray-600">{products.length} products found</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Price Display Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setPriceDisplay('full')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  priceDisplay === 'full'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Повна ціна
              </button>
              <button
                onClick={() => setPriceDisplay('monthly')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  priceDisplay === 'monthly'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ціна в місяць
              </button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px] bg-white">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">За популярністю</SelectItem>
                <SelectItem value="newest">Нові</SelectItem>
                <SelectItem value="price_asc">Ціна: від дешевих</SelectItem>
                <SelectItem value="price_desc">Ціна: від дорогих</SelectItem>
                <SelectItem value="rating">За рейтингом</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Сетка"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Список"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Toggle */}
            <Button
              data-testid="toggle-filters-button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 space-y-6`}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 sticky top-24">
              <div className="flex justify-between items-center">
                <h3 data-testid="filters-title" className="font-semibold text-lg">Filters</h3>
                <Button
                  data-testid="clear-filters-button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>

              {/* Category Filter */}
              <div>
                <Label className="mb-2 block font-medium">Category</Label>
                <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
                  <SelectTrigger data-testid="category-select">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label className="mb-2 block font-medium">Price Range</Label>
                <div className="space-y-4">
                  <Slider
                    data-testid="price-slider"
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Button
                    data-testid="apply-price-filter-button"
                    onClick={fetchProducts}
                    className="w-full"
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071E3]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                    priceDisplay={priceDisplay}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;