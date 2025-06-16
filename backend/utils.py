"""
utils.py - Utility functions for the backend API.

Provides JSON file loading/saving with caching, product enrichment, review lookup, and related product joining.
"""

import json
from typing import Any, Dict, List

# Simple in-memory cache for JSON files
_json_cache = {}

def load_json_file(file_path: str, use_cache: bool = True) -> Any:
    """
    Load a JSON file from disk, with optional in-memory caching.

    Args:
        file_path (str): Path to the JSON file.
        use_cache (bool): Whether to use in-memory cache. Default is True.

    Returns:
        Any: Parsed JSON data (dict or list), or empty dict on error.
    """
    if use_cache and file_path in _json_cache:
        return _json_cache[file_path]
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if use_cache:
                _json_cache[file_path] = data
            return data
    except Exception as e:
        from logger import logger
        logger.error(f"Error loading {file_path}: {e}")
        return {}

def save_json_file(file_path: str, data: Any) -> bool:
    """
    Save data to a JSON file on disk, with error handling and cache update.

    Args:
        file_path (str): Path to the JSON file.
        data (Any): Data to save (dict or list).

    Returns:
        bool: True if save succeeded, False otherwise.
    """
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        _json_cache[file_path] = data
        return True
    except Exception as e:
        from logger import logger
        logger.error(f"Error saving {file_path}: {e}")
        return False

def enrich_product_with_merchants(product: Dict, merchants_file: str) -> Dict:
    """
    Add merchant information to each price option in a product.

    Args:
        product (Dict): The product dictionary.
        merchants_file (str): Path to merchants.json.

    Returns:
        Dict: Product with price options enriched with merchant info.
    """
    from copy import deepcopy
    merchants_data = load_json_file(merchants_file)
    merchants = merchants_data.get('merchants', {})
    enriched_product = deepcopy(product)
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
    return enriched_product

def get_reviews(product_id: str, reviews_file: str) -> Dict:
    """
    Get the reviews for a product from reviews.json.

    Args:
        product_id (str): The product ID.
        reviews_file (str): Path to reviews.json.

    Returns:
        Dict: Review data (rating, count) or empty dict if not found.
    """
    reviews_data = load_json_file(reviews_file)
    return reviews_data.get('reviews', {}).get(product_id, {})

def get_related_products_joined(product_id: str, related_file: str, products_file: str) -> List[Dict]:
    """
    Get related product IDs for a product and join with product data, flattening for frontend compatibility.

    Args:
        product_id (str): The product ID.
        related_file (str): Path to related_products.json.
        products_file (str): Path to products.json.

    Returns:
        List[Dict]: List of related product dicts (flattened for frontend).
    """
    related_data = load_json_file(related_file)
    products_data = load_json_file(products_file)
    related_ids = related_data.get('relatedProducts', {}).get(product_id, [])
    all_products = products_data.get('products', {})
    related_products = []
    for pid in related_ids:
        if pid in all_products:
            prod = all_products[pid]
            flat = {
                'id': prod.get('id'),
                'name': prod.get('title'),
                'price': prod.get('basePrice'),
                'originalPrice': prod.get('priceOptions', [{}])[0].get('originalPrice'),
                'image': prod.get('images', [{}])[0].get('url', ''),
                'alt': prod.get('images', [{}])[0].get('alt', prod.get('title', '')),
                'freeShipping': any(opt.get('type') == 'free' for opt in prod.get('shipping', []))
            }
            related_products.append(flat)
    return related_products
