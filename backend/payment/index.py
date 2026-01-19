import json
import os
import psycopg2
import uuid
import base64
import urllib.request
import urllib.error

def handler(event, context):
    '''Создание платежа через ЮKassa и сохранение заказа'''
    
    method = event.get('httpMethod', 'POST')
    
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
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment credentials not configured'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    customer_name = body.get('customerName', '')
    customer_email = body.get('customerEmail', '')
    customer_phone = body.get('customerPhone', '')
    items = body.get('items', [])
    total_amount = body.get('totalAmount', 0)
    
    if not items or total_amount <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid order data'})
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
    
    order_number = f'ORD-{uuid.uuid4().hex[:8].upper()}'
    
    cur.execute(
        '''INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total_amount, status, payment_status)
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id''',
        (order_number, customer_name, customer_email, customer_phone, total_amount, 'pending', 'pending')
    )
    order_id = cur.fetchone()[0]
    
    for item in items:
        product_id = item.get('productId')
        service_id = item.get('serviceId')
        quantity = item.get('quantity', 1)
        price = item.get('price', 0)
        
        cur.execute(
            'INSERT INTO order_items (order_id, product_id, service_id, quantity, price) VALUES (%s, %s, %s, %s, %s)',
            (order_id, product_id, service_id, quantity, price)
        )
    
    conn.commit()
    
    idempotence_key = str(uuid.uuid4())
    
    payment_data = {
        'amount': {
            'value': f'{total_amount:.2f}',
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': 'https://yoursite.com/order-success'
        },
        'capture': True,
        'description': f'Заказ {order_number}',
        'metadata': {
            'order_id': order_id,
            'order_number': order_number
        }
    }
    
    if customer_email:
        payment_data['receipt'] = {
            'customer': {'email': customer_email},
            'items': []
        }
        
        for item in items:
            payment_data['receipt']['items'].append({
                'description': item.get('name', 'Товар'),
                'quantity': str(item.get('quantity', 1)),
                'amount': {
                    'value': f"{item.get('price', 0):.2f}",
                    'currency': 'RUB'
                },
                'vat_code': 1
            })
    
    try:
        auth_string = f'{shop_id}:{secret_key}'
        auth_bytes = auth_string.encode('utf-8')
        auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        req = urllib.request.Request(
            'https://api.yookassa.ru/v3/payments',
            data=json.dumps(payment_data).encode('utf-8'),
            headers={
                'Authorization': f'Basic {auth_base64}',
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotence_key
            }
        )
        
        with urllib.request.urlopen(req) as response:
            payment_response = json.loads(response.read().decode('utf-8'))
        
        payment_id = payment_response.get('id')
        confirmation_url = payment_response.get('confirmation', {}).get('confirmation_url')
        
        cur.execute(
            'UPDATE orders SET payment_id = %s WHERE id = %s',
            (payment_id, order_id)
        )
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'orderId': order_id,
                'orderNumber': order_number,
                'paymentId': payment_id,
                'confirmationUrl': confirmation_url
            })
        }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        cur.close()
        conn.close()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment creation failed', 'details': error_body})
        }
    
    except Exception as e:
        cur.close()
        conn.close()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
