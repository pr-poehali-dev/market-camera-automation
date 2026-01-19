import json
import os
import psycopg2

def handler(event, context):
    '''API для получения списка услуг с фильтрацией'''
    
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
    category = params.get('category', '')
    search = params.get('search', '')
    page = int(params.get('page', '1'))
    limit = int(params.get('limit', '50'))
    
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
    
    query = 'SELECT id, name, description, price, category, duration_hours FROM services WHERE is_active = true'
    conditions = []
    values = []
    
    if category:
        conditions.append('category = %s')
        values.append(category)
    
    if search:
        conditions.append('name ILIKE %s')
        values.append(f'%{search}%')
    
    if conditions:
        query += ' AND ' + ' AND '.join(conditions)
    
    count_query = f"SELECT COUNT(*) FROM ({query}) as filtered"
    cur.execute(count_query, values)
    total_count = cur.fetchone()[0]
    
    query += ' ORDER BY category, price LIMIT %s OFFSET %s'
    values.extend([limit, offset])
    
    cur.execute(query, values)
    rows = cur.fetchall()
    
    services = []
    for row in rows:
        services.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': float(row[3]),
            'category': row[4],
            'duration': row[5]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'services': services,
            'total': total_count,
            'page': page,
            'limit': limit
        })
    }
