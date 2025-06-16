from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database file paths
PRODUCTS_FILE = 'database/products.json'
MERCHANTS_FILE = 'database/merchants.json'

def load_json_file(file_path):
    """Load JSON file with error handling"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"JSON decode error in {file_path}: {e}")
        return {}

def save_json_file(file_path, data):
    """Save JSON file with error handling"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {file_path}: {e}")
        return False

def calculate_discounted_price(base_price, discount):
    """Calculate price after applying discount"""
    if not discount:
        return base_price
    
    if discount['type'] == 'percentage':
        discount_amount = (base_price * discount['value']) / 100
        return base_price - discount_amount
    elif discount['type'] == 'fixed':
        return max(base_price - discount['value'], 0)
    
    return base_price

def enrich_product_with_merchants(product):
    """Add merchant information to product price options"""
    merchants_data = load_json_file(MERCHANTS_FILE)
    merchants = merchants_data.get('merchants', {})
    
    enriched_product = product.copy()
    
    # Enrich price options with merchant data and calculate prices
    if 'priceOptions' in enriched_product:
        for option in enriched_product['priceOptions']:
            merchant_id = option.get('merchantId')
            if merchant_id and merchant_id in merchants:
                merchant = merchants[merchant_id]
                option['seller'] = {
                    'name': merchant['name'],
                    'displayName': merchant['displayName'],
                    'isOfficial': merchant['isOfficial'],
                    'verified': merchant['verified'],
                    'rating': merchant.get('rating'),
                    'salesCount': merchant.get('salesCount'),
                    'location': merchant.get('location')
                }
                
                # Calculate final price
                base_price = enriched_product['basePrice']
                discount = option.get('discount')
                final_price = calculate_discounted_price(base_price, discount)
                
                option['price'] = final_price
                option['originalPrice'] = base_price if discount else None
                
                # Calculate installment amount if applicable
                if 'installments' in option and option['installments']:
                    installment_count = option['installments']['count']
                    option['installments']['amount'] = round(final_price / installment_count)
    
    return enriched_product

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get product with merchant data and calculated prices"""
    try:
        products_data = load_json_file(PRODUCTS_FILE)
        
        if product_id not in products_data.get('products', {}):
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        product = products_data['products'][product_id]
        enriched_product = enrich_product_with_merchants(product)
        
        return jsonify({
            'success': True,
            'data': enriched_product
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching product: {str(e)}'
        }), 500

@app.route('/api/products/<product_id>/view', methods=['POST', 'OPTIONS'])
def track_product_view(product_id):
    """Track product view (e.g., for analytics)"""
    if request.method == 'OPTIONS':
        return '', 200

    print(f"[{datetime.now()}] Product viewed: {product_id}")
    return jsonify({
        'success': True,
        'message': 'View tracked successfully'
    }), 200


@app.route('/api/products/<product_id>/related', methods=['GET'])
def get_related_products(product_id):
    """Get related products"""
    try:
        products_data = load_json_file(PRODUCTS_FILE)
        related_products = products_data.get('relatedProducts', {}).get(product_id, [])
        
        return jsonify({
            'success': True,
            'data': related_products
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching related products: {str(e)}'
        }), 500

# MERCHANT ENDPOINTS

@app.route('/api/merchants', methods=['GET'])
def get_merchants():
    """Get all merchants"""
    try:
        merchants_data = load_json_file(MERCHANTS_FILE)
        return jsonify({
            'success': True,
            'data': merchants_data.get('merchants', {})
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching merchants: {str(e)}'
        }), 500

@app.route('/api/merchants/<merchant_id>', methods=['GET'])
def get_merchant(merchant_id):
    """Get specific merchant"""
    try:
        merchants_data = load_json_file(MERCHANTS_FILE)
        merchants = merchants_data.get('merchants', {})
        
        if merchant_id not in merchants:
            return jsonify({
                'success': False,
                'message': 'Merchant not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': merchants[merchant_id]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching merchant: {str(e)}'
        }), 500

# MERCHANT DISCOUNT MANAGEMENT

@app.route('/api/merchant/<merchant_id>/products/<product_id>/discount', methods=['PUT'])
def update_merchant_discount(merchant_id, product_id):
    """Update discount for a specific merchant's price option"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['priceOptionId', 'discountType', 'discountValue']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: priceOptionId, discountType, discountValue'
            }), 400
        
        # Validate discount type
        if data['discountType'] not in ['percentage', 'fixed']:
            return jsonify({
                'success': False,
                'message': 'discountType must be "percentage" or "fixed"'
            }), 400
        
        # Load products
        products_data = load_json_file(PRODUCTS_FILE)
        
        if product_id not in products_data.get('products', {}):
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        product = products_data['products'][product_id]
        price_option_id = data['priceOptionId']
        
        # Find the price option for this merchant
        price_option = None
        for option in product.get('priceOptions', []):
            if option['id'] == price_option_id and option.get('merchantId') == merchant_id:
                price_option = option
                break
        
        if not price_option:
            return jsonify({
                'success': False,
                'message': f'Price option {price_option_id} not found for merchant {merchant_id}'
            }), 404
        
        # Update discount
        discount = {
            'type': data['discountType'],
            'value': data['discountValue'],
            'appliedAt': datetime.now().isoformat() + 'Z',
            'reason': data.get('reason', 'Merchant discount'),
            'campaignId': data.get('campaignId', f"CAMPAIGN_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        }
        
        # Add optional expiration
        if 'validUntil' in data:
            discount['validUntil'] = data['validUntil']
        
        price_option['discount'] = discount
        
        # Save updated products
        if save_json_file(PRODUCTS_FILE, products_data):
            # Return enriched product data
            enriched_product = enrich_product_with_merchants(product)
            return jsonify({
                'success': True,
                'message': 'Discount updated successfully',
                'data': {
                    'product': enriched_product,
                    'appliedDiscount': discount
                }
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save discount'
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating discount: {str(e)}'
        }), 500

@app.route('/api/merchant/<merchant_id>/products/<product_id>/discount', methods=['DELETE'])
def remove_merchant_discount(merchant_id, product_id):
    """Remove discount for a specific merchant's price option"""
    try:
        data = request.get_json()
        price_option_id = data.get('priceOptionId')
        
        if not price_option_id:
            return jsonify({
                'success': False,
                'message': 'priceOptionId is required'
            }), 400
        
        # Load products
        products_data = load_json_file(PRODUCTS_FILE)
        
        if product_id not in products_data.get('products', {}):
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        product = products_data['products'][product_id]
        
        # Find and update the price option
        updated = False
        for option in product.get('priceOptions', []):
            if option['id'] == price_option_id and option.get('merchantId') == merchant_id:
                if 'discount' in option:
                    del option['discount']
                    updated = True
                break
        
        if not updated:
            return jsonify({
                'success': False,
                'message': f'Price option {price_option_id} not found for merchant {merchant_id}'
            }), 404
        
        # Save updated products
        if save_json_file(PRODUCTS_FILE, products_data):
            enriched_product = enrich_product_with_merchants(product)
            return jsonify({
                'success': True,
                'message': 'Discount removed successfully',
                'data': enriched_product
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to save changes'
            }), 500
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error removing discount: {str(e)}'
        }), 500

@app.route('/api/merchant/<merchant_id>/products', methods=['GET'])
def get_merchant_products(merchant_id):
    """Get all products for a specific merchant"""
    try:
        products_data = load_json_file(PRODUCTS_FILE)
        merchant_products = []
        
        for product_id, product in products_data.get('products', {}).items():
            # Check if merchant has any price options for this product
            has_price_option = any(
                option.get('merchantId') == merchant_id 
                for option in product.get('priceOptions', [])
            )
            
            if has_price_option:
                enriched_product = enrich_product_with_merchants(product)
                # Filter to only show this merchant's price options
                enriched_product['priceOptions'] = [
                    option for option in enriched_product['priceOptions']
                    if option.get('merchantId') == merchant_id
                ]
                merchant_products.append(enriched_product)
        
        return jsonify({
            'success': True,
            'data': merchant_products
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching merchant products: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
