import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  rating: number;
  specs: string[];
};

interface CatalogPageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Array<{ name: string; icon: string; count: number }>;
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  filteredProducts: Product[];
  addToCart: (product: Product) => void;
}

const CatalogPage = ({
  searchQuery,
  setSearchQuery,
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  setPriceRange,
  toggleCategory,
  toggleBrand,
  filteredProducts,
  addToCart
}: CatalogPageProps) => {
  return (
    <section className="py-8 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Каталог товаров</h2>
        <div className="flex gap-6">
          <Card className="w-80 h-fit sticky top-24 hidden lg:block">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Icon name="Filter" size={20} />
                Фильтры
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Категории</h4>
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCategories.includes(cat.name)}
                        onCheckedChange={() => toggleCategory(cat.name)}
                      />
                      <span className="text-sm">{cat.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">({cat.count})</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Производитель</h4>
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Цена</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500000}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{priceRange[0].toLocaleString()} ₽</span>
                    <span>{priceRange[1].toLocaleString()} ₽</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toggleCategory('');
                    toggleBrand('');
                    setPriceRange([0, 500000]);
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            <div className="mb-6">
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative overflow-hidden bg-slate-200 h-56">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-accent">
                      <Icon name="Star" size={14} className="mr-1" />
                      {product.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-slate-500">{product.brand}</span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.specs.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} ₽
                      </span>
                      <Button onClick={() => addToCart(product)} size="sm" className="gap-2">
                        <Icon name="ShoppingCart" size={16} />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Icon name="Search" size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-slate-500">Попробуйте изменить параметры поиска</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogPage;
