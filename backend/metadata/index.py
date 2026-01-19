import json
import os
import psycopg2

def handler(event, context):
    '''Получить метаданные каталога: категории, бренды'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'GET':
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
    
    cur.execute('''
        SELECT c.id, c.name, c.slug, c.icon, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
        GROUP BY c.id, c.name, c.slug, c.icon
        ORDER BY c.name
    ''')
    
    categories = []
    for row in cur.fetchall():
        categories.append({
            'id': row[0],
            'name': row[1],
            'slug': row[2],
            'icon': row[3],
            'count': row[4]
        })
    
    cur.execute('''
        SELECT b.id, b.name, COUNT(p.id) as product_count
        FROM brands b
        LEFT JOIN products p ON p.brand_id = b.id AND p.is_active = true
        GROUP BY b.id, b.name
        HAVING COUNT(p.id) > 0
        ORDER BY b.name
    ''')
    
    brands = []
    for row in cur.fetchall():
        brands.append({
            'id': row[0],
            'name': row[1],
            'count': row[2]
        })
    
    cur.execute('SELECT MIN(price), MAX(price) FROM products WHERE is_active = true')
    price_range = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'categories': categories,
            'brands': brands,
            'priceRange': {
                'min': float(price_range[0]) if price_range[0] else 0,
                'max': float(price_range[1]) if price_range[1] else 0
            }
        })
    }
