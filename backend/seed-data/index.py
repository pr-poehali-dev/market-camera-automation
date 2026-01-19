import json
import os
import psycopg2

def handler(event, context):
    '''Наполнить базу данных товарами и услугами (15000 товаров, 1000 услуг)'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    categories_data = [
        ('Видеокамеры', 'videocameras', 'Camera', 'IP-камеры, аналоговые камеры, PTZ-камеры'),
        ('Автоматика для ворот', 'gate-automation', 'DoorOpen', 'Приводы для откатных и распашных ворот'),
        ('Шлагбаумы', 'barriers', 'Construction', 'Автоматические шлагбаумы'),
        ('Пожарная сигнализация', 'fire-alarm', 'Flame', 'Датчики, приборы, оповещатели'),
        ('Комплектующие', 'accessories', 'Wrench', 'Кабели, блоки питания, крепления'),
        ('Видеорегистраторы', 'dvr', 'HardDrive', 'NVR, DVR, гибридные регистраторы'),
        ('Домофоны', 'intercoms', 'Phone', 'Видеодомофоны, переговорные устройства'),
        ('Контроллеры доступа', 'access-control', 'KeyRound', 'СКУД, замки, считыватели'),
    ]
    
    brands_data = [
        'Hikvision', 'Dahua', 'Axis', 'Bolid', 'CAME', 'Nice', 'BFT', 'Bosch',
        'Samsung', 'Uniview', 'Polyvision', 'RVI', 'Novicam', 'Tantos', 'FAAC',
        'DoorHan', 'Roger', 'Rubezh', 'Esser', 'Honeywell', 'Satel', 'Paradox'
    ]
    
    cur.execute('SELECT COUNT(*) FROM categories')
    if cur.fetchone()[0] == 0:
        for cat in categories_data:
            cur.execute(
                'INSERT INTO categories (name, slug, icon, description) VALUES (%s, %s, %s, %s)',
                cat
            )
    
    cur.execute('SELECT COUNT(*) FROM brands')
    if cur.fetchone()[0] == 0:
        for brand in brands_data:
            cur.execute('INSERT INTO brands (name) VALUES (%s)', (brand,))
    
    cur.execute('SELECT id FROM categories')
    category_ids = [row[0] for row in cur.fetchall()]
    
    cur.execute('SELECT id FROM brands')
    brand_ids = [row[0] for row in cur.fetchall()]
    
    cur.execute('SELECT COUNT(*) FROM products')
    existing_products = cur.fetchone()[0]
    
    if existing_products < 15000:
        products_to_add = 15000 - existing_products
        
        product_templates = [
            ('IP-камера {brand} {model} {mp}MP', 8000, 95000, ['2MP', '4MP', '5MP', '8MP'], ['Цилиндр', 'Купол', 'PTZ']),
            ('Привод для ворот {brand} {model}', 15000, 85000, ['откатных', 'распашных'], ['до 400кг', 'до 600кг', 'до 1000кг']),
            ('Шлагбаум {brand} {model}', 35000, 120000, ['3м', '4м', '5м', '6м'], ['стандарт', 'интенсив']),
            ('Датчик пожарный {brand} {model}', 500, 15000, ['дымовой', 'тепловой', 'комбинированный'], ['IP20', 'IP54']),
            ('Видеорегистратор {brand} {model}', 12000, 180000, ['4-канальный', '8-канальный', '16-канальный', '32-канальный'], ['NVR', 'DVR']),
            ('Кабель {type} {length}м', 50, 5000, ['UTP', 'коаксиальный', 'питания'], ['100', '305', '500']),
            ('Домофон {brand} {model}', 8500, 45000, ['видео', 'аудио'], ['цветной', 'черно-белый', 'IP']),
            ('Контроллер {brand} {model}', 7500, 65000, ['2 двери', '4 двери'], ['автономный', 'сетевой']),
        ]
        
        batch = []
        for i in range(products_to_add):
            template = product_templates[i % len(product_templates)]
            base_name = template[0]
            min_price = template[1]
            max_price = template[2]
            
            import random
            brand_id = random.choice(brand_ids)
            category_id = random.choice(category_ids)
            price = random.randint(min_price, max_price)
            model = f'{random.choice(["DS", "IPC", "SD", "BX", "VR", "KD", "C"])}-{random.randint(100, 9999)}'
            
            cur.execute('SELECT name FROM brands WHERE id = %s', (brand_id,))
            brand_name = cur.fetchone()[0]
            
            specs_list = random.sample(template[3] + template[4], min(3, len(template[3]) + len(template[4])))
            
            name = base_name.format(
                brand=brand_name,
                model=model,
                mp=random.choice(['2', '4', '5', '8']),
                type=random.choice(template[3]),
                length=random.choice(['100', '305', '500'])
            )
            
            slug = f'{name.lower().replace(" ", "-")}-{i}'
            specs = json.dumps(specs_list)
            rating = round(random.uniform(4.0, 5.0), 1)
            stock = random.randint(0, 100)
            
            batch.append((name, slug, price, category_id, brand_id, specs, rating, stock))
            
            if len(batch) >= 500:
                cur.executemany(
                    '''INSERT INTO products (name, slug, price, category_id, brand_id, specs, rating, stock_quantity) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
                    batch
                )
                batch = []
        
        if batch:
            cur.executemany(
                '''INSERT INTO products (name, slug, price, category_id, brand_id, specs, rating, stock_quantity) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
                batch
            )
    
    cur.execute('SELECT COUNT(*) FROM services')
    existing_services = cur.fetchone()[0]
    
    if existing_services < 1000:
        services_to_add = 1000 - existing_services
        
        service_templates = [
            ('Доставка {region}', 500, 15000, 'delivery', 1, ['по городу', 'в область', 'по России', 'экспресс']),
            ('Установка {equipment}', 2000, 25000, 'installation', 4, ['видеокамеры', 'домофона', 'шлагбаума', 'ворот', 'СКУД']),
            ('Настройка {system}', 1500, 12000, 'setup', 2, ['видеонаблюдения', 'контроля доступа', 'пожарной сигнализации']),
            ('Монтаж {equipment}', 3000, 35000, 'installation', 6, ['видеонаблюдения', 'автоматики', 'домофона', 'СКУД']),
            ('Пусконаладка {system}', 5000, 45000, 'commissioning', 8, ['системы безопасности', 'автоматических ворот', 'шлагбаума']),
            ('Техническое обслуживание {equipment}', 2500, 18000, 'maintenance', 3, ['видеонаблюдения', 'СКУД', 'ворот', 'шлагбаума']),
            ('Консультация специалиста {type}', 1000, 8000, 'consulting', 1, ['по видеонаблюдению', 'по автоматике', 'по СКУД']),
            ('Проектирование {system}', 15000, 150000, 'design', 40, ['системы безопасности', 'видеонаблюдения', 'СКУД']),
        ]
        
        batch = []
        for i in range(services_to_add):
            template = service_templates[i % len(service_templates)]
            base_name = template[0]
            min_price = template[1]
            max_price = template[2]
            category = template[3]
            duration = template[4]
            variants = template[5]
            
            import random
            price = random.randint(min_price, max_price)
            variant = random.choice(variants)
            
            name = base_name.format(
                region=variant if 'Доставка' in base_name else '',
                equipment=variant,
                system=variant,
                type=variant
            )
            
            slug = f'{name.lower().replace(" ", "-")}-{i}'
            
            batch.append((name, slug, price, category, duration))
            
            if len(batch) >= 500:
                cur.executemany(
                    'INSERT INTO services (name, slug, price, category, duration_hours) VALUES (%s, %s, %s, %s, %s)',
                    batch
                )
                batch = []
        
        if batch:
            cur.executemany(
                'INSERT INTO services (name, slug, price, category, duration_hours) VALUES (%s, %s, %s, %s, %s)',
                batch
            )
    
    conn.commit()
    
    cur.execute('SELECT COUNT(*) FROM products')
    total_products = cur.fetchone()[0]
    
    cur.execute('SELECT COUNT(*) FROM services')
    total_services = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'products': total_products,
            'services': total_services,
            'message': f'База данных наполнена: {total_products} товаров, {total_services} услуг'
        })
    }
