import pytest
from app import app
import json

def test_get_product_not_found():
    client = app.test_client()
    response = client.get('/api/products/unknown')
    assert response.status_code == 404
    data = response.get_json()
    assert data['success'] is False
    assert 'Product not found' in data['message']

def test_get_merchants():
    client = app.test_client()
    response = client.get('/api/merchants')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert isinstance(data['data'], dict)

def test_get_merchant_not_found():
    client = app.test_client()
    response = client.get('/api/merchants/unknown')
    assert response.status_code == 404
    data = response.get_json()
    assert data['success'] is False
    assert 'Merchant not found' in data['message']

def test_track_product_view():
    client = app.test_client()
    response = client.post('/api/products/unknown/view')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'View tracked successfully' in data['message']

def test_get_product_success():
    client = app.test_client()
    response = client.get('/api/products/MLA123456789')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['id'] == 'MLA123456789'
    assert 'priceOptions' in data['data']


def test_get_related_products():
    client = app.test_client()
    response = client.get('/api/products/MLA123456789/related')
    assert response.status_code in (200, 404)
    data = response.get_json()
    if response.status_code == 200:
        assert data['success'] is True
        assert isinstance(data['data'], list)
    else:
        assert data['success'] is False


def test_update_and_remove_discount():
    client = app.test_client()
    # Add discount
    payload = {
        "priceOptionId": "best_price",
        "discountType": "fixed",
        "discountValue": 10000,
        "reason": "Test discount"
    }
    response = client.put(
        '/api/merchant/angel_estrada/products/MLA123456789/discount',
        data=json.dumps(payload),
        content_type='application/json'
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['appliedDiscount']['type'] == 'fixed'
    # Remove discount
    response = client.delete(
        '/api/merchant/angel_estrada/products/MLA123456789/discount',
        data=json.dumps({"priceOptionId": "best_price"}),
        content_type='application/json'
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True


def test_get_merchant_products():
    client = app.test_client()
    response = client.get('/api/merchant/angel_estrada/products')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert isinstance(data['data'], list)
    for product in data['data']:
        assert 'priceOptions' in product
        for option in product['priceOptions']:
            assert option['merchantId'] == 'angel_estrada'
