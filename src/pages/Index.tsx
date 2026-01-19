import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

type CartItem = Product & {
  quantity: number;
  delivery: boolean;
  installation: boolean;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('home');

  const categories = [
    { name: 'Видеокамеры', icon: 'Camera', count: 4200 },
    { name: 'Автоматика для ворот', icon: 'DoorOpen', count: 3100 },
    { name: 'Шлагбаумы', icon: 'Construction', count: 850 },
    { name: 'Пожарная сигнализация', icon: 'Flame', count: 2900 },
    { name: 'Комплектующие', icon: 'Wrench', count: 3950 },
  ];

  const brands = ['Hikvision', 'Dahua', 'Axis', 'Bolid', 'CAME', 'Nice', 'BFT', 'Bosch'];

  const products: Product[] = [
    {
      id: 1,
      name: 'IP-камера Hikvision DS-2CD2143G2-I 4MP',
      price: 12500,
      category: 'Видеокамеры',
      brand: 'Hikvision',
      image: '/placeholder.svg',
      rating: 4.8,
      specs: ['4MP', 'ИК до 30м', 'WDR 120dB', 'H.265+'],
    },
    {
      id: 2,
      name: 'Привод для откатных ворот CAME BX-243',
      price: 28900,
      category: 'Автоматика для ворот',
      brand: 'CAME',
      image: '/placeholder.svg',
      rating: 4.9,
      specs: ['До 400кг', '230В', 'Энкодер', 'Концевики'],
    },
    {
      id: 3,
      name: 'Шлагбаум автоматический NICE WideM',
      price: 42000,
      category: 'Шлагбаумы',
      brand: 'Nice',
      image: '/placeholder.svg',
      rating: 4.7,
      specs: ['Стрела 4м', 'Интенсивность 100%', '230В', 'LED подсветка'],
    },
    {
      id: 4,
      name: 'Прибор пожарный Болид С2000-КДЛ',
      price: 8500,
      category: 'Пожарная сигнализация',
      brand: 'Bolid',
      image: '/placeholder.svg',
      rating: 4.6,
      specs: ['16 лучей', 'RS-485', 'Самодиагностика', 'IP54'],
    },
    {
      id: 5,
      name: 'PTZ-камера Dahua SD59432XA-HNR',
      price: 89500,
      category: 'Видеокамеры',
      brand: 'Dahua',
      image: '/placeholder.svg',
      rating: 4.9,
      specs: ['4MP', 'Zoom 32x', 'Starlight', 'ИК 150м'],
    },
    {
      id: 6,
      name: 'Привод для распашных ворот BFT VIRGO',
      price: 15600,
      category: 'Автоматика для ворот',
      brand: 'BFT',
      image: '/placeholder.svg',
      rating: 4.5,
      specs: ['До 250кг', '230В', 'Створка до 2м', 'Блокировка'],
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, delivery: false, installation: false }];
    });
  };

  const updateCartItem = (id: number, field: 'delivery' | 'installation', value: boolean) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.delivery) itemTotal += 1500;
      if (item.installation) itemTotal += Math.floor(item.price * 0.15);
      return total + itemTotal;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">TechMarket</h1>
                <p className="text-xs text-slate-500">Профессиональное оборудование</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('home')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeTab === 'catalog' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('catalog')}
                className="gap-2"
              >
                <Icon name="LayoutGrid" size={18} />
                Каталог
              </Button>
              <Button variant="ghost" className="gap-2">
                <Icon name="Settings" size={18} />
                Услуги
              </Button>
              <Button variant="ghost" className="gap-2">
                <Icon name="Info" size={18} />
                О нас
              </Button>
              <Button variant="ghost" className="gap-2">
                <Icon name="Mail" size={18} />
                Контакты
              </Button>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Корзина ({cart.length})</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="ShoppingCart" size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                                <p className="text-lg font-bold text-primary mb-2">
                                  {item.price.toLocaleString()} ₽
                                </p>
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                      checked={item.delivery}
                                      onCheckedChange={(checked) =>
                                        updateCartItem(item.id, 'delivery', checked as boolean)
                                      }
                                    />
                                    <span>Доставка (+1 500 ₽)</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                      checked={item.installation}
                                      onCheckedChange={(checked) =>
                                        updateCartItem(item.id, 'installation', checked as boolean)
                                      }
                                    />
                                    <span>
                                      Установка (+{Math.floor(item.price * 0.15).toLocaleString()} ₽)
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                                className="h-8 w-8"
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">{calculateTotal().toLocaleString()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="home" className="m-0">
          <section className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  Более 15 000 товаров в наличии
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Профессиональное оборудование для безопасности
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Видеонаблюдение, автоматика, пожарные системы с доставкой и установкой
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-blue-50"
                    onClick={() => setActiveTab('catalog')}
                  >
                    <Icon name="ShoppingBag" className="mr-2" size={20} />
                    Перейти в каталог
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Icon name="Phone" className="mr-2" size={20} />
                    Консультация
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Популярные категории</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Card
                  key={cat.name}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
                  onClick={() => {
                    setActiveTab('catalog');
                    setSelectedCategories([cat.name]);
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon name={cat.icon as any} className="text-primary" size={32} />
                    </div>
                    <h3 className="font-semibold mb-2">{cat.name}</h3>
                    <p className="text-sm text-slate-500">{cat.count} товаров</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-slate-100 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Хиты продаж</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 3).map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <div className="relative overflow-hidden bg-slate-200 h-64">
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
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.specs.slice(0, 3).map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString()} ₽
                        </span>
                        <Button onClick={() => addToCart(product)} className="gap-2">
                          <Icon name="ShoppingCart" size={18} />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 border-2 border-primary/20">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Truck" className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2">Быстрая доставка</h3>
                <p className="text-slate-600">Доставим за 1-3 дня по всей России</p>
              </Card>
              <Card className="text-center p-6 border-2 border-accent/20">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="Wrench" className="text-accent" size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2">Профессиональный монтаж</h3>
                <p className="text-slate-600">Установка и настройка оборудования</p>
              </Card>
              <Card className="text-center p-6 border-2 border-secondary/20">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Icon name="Shield" className="text-secondary" size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2">Гарантия качества</h3>
                <p className="text-slate-600">Официальная гарантия на все товары</p>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="catalog" className="m-0">
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
                          setSelectedCategories([]);
                          setSelectedBrands([]);
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
        </TabsContent>
      </Tabs>

      <footer className="bg-secondary text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" className="text-white" size={24} />
                </div>
                <span className="font-bold text-xl">TechMarket</span>
              </div>
              <p className="text-sm text-slate-300">
                Профессиональное оборудование для безопасности и автоматизации
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Видеокамеры</li>
                <li>Автоматика</li>
                <li>Шлагбаумы</li>
                <li>Сигнализация</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Доставка</li>
                <li>Установка</li>
                <li>Гарантия</li>
                <li>Консультация</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@techmarket.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Примерная, 123
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-600 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2026 TechMarket. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
