import json
import os
import psycopg2
from urllib.parse import parse_qs

def handler(event, context):
    '''API для каталога товаров с фильтрацией и поиском'''
    
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
    
    params = event.get('queryStringParameters') or {}
    
    search = params.get('search', '')
    category_ids = params.get('categories', '')
    brand_ids = params.get('brands', '')
    min_price = params.get('min_price', '0')
    max_price = params.get('max_price', '999999999')
    page = int(params.get('page', '1'))
    limit = int(params.get('limit', '24'))
    
    offset = (page - 1) * limit
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    query = '''
        SELECT 
            p.id, p.name, p.price, p.image_url, p.rating, p.specs, p.stock_quantity,
            c.name as category_name, c.id as category_id,
            b.name as brand_name, b.id as brand_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = true
    '''
    
    conditions = []
    values = []
    
    if search:
        conditions.append("p.name ILIKE %s")
        values.append(f'%{search}%')
    
    if category_ids:
        cat_list = [int(x) for x in category_ids.split(',') if x.isdigit()]
        if cat_list:
            conditions.append(f"p.category_id = ANY(%s)")
            values.append(cat_list)
    
    if brand_ids:
        brand_list = [int(x) for x in brand_ids.split(',') if x.isdigit()]
        if brand_list:
            conditions.append(f"p.brand_id = ANY(%s)")
            values.append(brand_list)
    
    try:
        min_p = float(min_price)
        max_p = float(max_price)
        conditions.append("p.price BETWEEN %s AND %s")
        values.append(min_p)
        values.append(max_p)
    except:
        pass
    
    if conditions:
        query += ' AND ' + ' AND '.join(conditions)
    
    count_query = f"SELECT COUNT(*) FROM ({query}) as filtered"
    cur.execute(count_query, values)
    total_count = cur.fetchone()[0]
    
    query += ' ORDER BY p.created_at DESC LIMIT %s OFFSET %s'
    values.extend([limit, offset])
    
    cur.execute(query, values)
    rows = cur.fetchall()
    
    products = []
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'price': float(row[2]),
            'image': row[3] or '/placeholder.svg',
            'rating': float(row[4]) if row[4] else 0,
            'specs': row[5] or [],
            'stock': row[6],
            'category': row[7],
            'category_id': row[8],
            'brand': row[9],
            'brand_id': row[10]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'products': products,
            'total': total_count,
            'page': page,
            'limit': limit,
            'pages': (total_count + limit - 1) // limit
        })
    }
