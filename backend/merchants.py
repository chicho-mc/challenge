from flask import Blueprint, jsonify
from utils import load_json_file
import os

merchants_bp = Blueprint('merchants', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MERCHANTS_FILE = os.path.join(BASE_DIR, 'database/merchants.json')

@merchants_bp.route('/api/merchants', methods=['GET'])
def get_merchants():
    """
    Get all merchants
    ---
    responses:
      200:
        description: List of merchants
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
    """
    merchants_data = load_json_file(MERCHANTS_FILE)
    return jsonify({'success': True, 'data': merchants_data.get('merchants', {})})
