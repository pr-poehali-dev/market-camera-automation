import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Header from '@/components/marketplace/Header';
import HomePage from '@/components/marketplace/HomePage';
import CatalogPage from '@/components/marketplace/CatalogPage';
import Footer from '@/components/marketplace/Footer';

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
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="home" className="m-0">
          <HomePage
            categories={categories}
            products={products}
            setActiveTab={setActiveTab}
            setSelectedCategories={setSelectedCategories}
            addToCart={addToCart}
          />
        </TabsContent>

        <TabsContent value="catalog" className="m-0">
          <CatalogPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            toggleCategory={toggleCategory}
            toggleBrand={toggleBrand}
            filteredProducts={filteredProducts}
            addToCart={addToCart}
          />
        </TabsContent>
      </Tabs>

      <Footer />
    </div>
  );
};

export default Index;
