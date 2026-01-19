import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  updateCartItem: (id: number, field: 'delivery' | 'installation', value: boolean) => void;
  removeFromCart: (id: number) => void;
  calculateTotal: () => number;
}

const Header = ({ activeTab, setActiveTab, cart, updateCartItem, removeFromCart, calculateTotal }: HeaderProps) => {
  return (
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
  );
};

export default Header;
