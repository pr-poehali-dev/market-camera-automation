import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface HomePageProps {
  categories: Array<{ name: string; icon: string; count: number }>;
  products: Product[];
  setActiveTab: (tab: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  addToCart: (product: Product) => void;
}

const HomePage = ({ categories, products, setActiveTab, setSelectedCategories, addToCart }: HomePageProps) => {
  return (
    <>
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
    </>
  );
};

export default HomePage;
