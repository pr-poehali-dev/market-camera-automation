import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
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
  );
};

export default Footer;
