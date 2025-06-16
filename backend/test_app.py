import pytest
from app import create_app
import json

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_product_not_found(client):
    response = client.get('/api/products/unknown')
    assert response.status_code == 404
    data = response.get_json()
    assert data['success'] is False
    assert 'Product not found' in data['message']

def test_get_product_success(client):
    response = client.get('/api/products/MLA123456789')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['id'] == 'MLA123456789'
    assert 'priceOptions' in data['data']
    assert 'reviews' in data['data']
    assert 'relatedProducts' in data['data']

def test_get_merchants(client):
    response = client.get('/api/merchants')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert isinstance(data['data'], dict)

def test_track_product_view(client):
    response = client.post('/api/products/MLA123456789/view')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'View tracked successfully' in data['message']

def test_get_related_products(client):
    response = client.get('/api/products/MLA123456789/related')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert isinstance(data['data'], list)
    # Check structure of related product
    if data['data']:
        rp = data['data'][0]
        assert 'id' in rp
        assert 'name' in rp
        assert 'image' in rp
        assert 'alt' in rp
        assert 'price' in rp
