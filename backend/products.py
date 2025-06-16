from flask import Blueprint, jsonify, request
from utils import load_json_file, enrich_product_with_merchants, get_reviews, get_related_products_joined
import os

products_bp = Blueprint('products', __name__)

# File paths (could be moved to config)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_FILE = os.path.join(BASE_DIR, 'database/products.json')
MERCHANTS_FILE = os.path.join(BASE_DIR, 'database/merchants.json')
REVIEWS_FILE = os.path.join(BASE_DIR, 'database/reviews.json')
RELATED_PRODUCTS_FILE = os.path.join(BASE_DIR, 'database/related_products.json')

@products_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id: str):
    """
    Get product with merchant data, reviews, and related products (joined and enriched)
    ---
    parameters:
      - name: product_id
        in: path
        type: string
        required: true
        description: The product ID
    responses:
      200:
        description: Product found
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
      404:
        description: Product not found
    """
    products_data = load_json_file(PRODUCTS_FILE)
    product = products_data.get('products', {}).get(product_id)
    if not product:
        return jsonify({'success': False, 'message': 'Product not found'}), 404
    enriched_product = enrich_product_with_merchants(product, MERCHANTS_FILE)
    enriched_product['reviews'] = get_reviews(product_id, REVIEWS_FILE)
    enriched_product['relatedProducts'] = get_related_products_joined(product_id, RELATED_PRODUCTS_FILE, PRODUCTS_FILE)
    return jsonify({'success': True, 'data': enriched_product})

@products_bp.route('/api/products/<product_id>/view', methods=['POST', 'OPTIONS'])
def track_product_view(product_id: str):
    """
    Track product view (e.g., for analytics)
    ---
    parameters:
      - name: product_id
        in: path
        type: string
        required: true
        description: The product ID
    responses:
      200:
        description: View tracked successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
    """
    if request.method == 'OPTIONS':
        return '', 200
    print(f"Product viewed: {product_id}")
    return jsonify({'success': True, 'message': 'View tracked successfully'}), 200

@products_bp.route('/api/products/<product_id>/related', methods=['GET'])
def get_related_products(product_id: str):
    """
    Get related products, flattened for frontend compatibility
    ---
    parameters:
      - name: product_id
        in: path
        type: string
        required: true
        description: The product ID
    responses:
      200:
        description: List of related products
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: array
              items:
                type: object
    """
    related_products = get_related_products_joined(product_id, RELATED_PRODUCTS_FILE, PRODUCTS_FILE)
    return jsonify({'success': True, 'data': related_products})
