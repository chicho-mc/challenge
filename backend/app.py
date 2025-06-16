from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from products import products_bp
from merchants import merchants_bp
from metrics import metrics_bp
import os
import yaml


def create_app():
    app = Flask(__name__)
    CORS(app)
    # Load Swagger YAML as dict
    swagger_config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'swagger_config.yml')
    with open(swagger_config_path, 'r') as f:
        swagger_template = yaml.safe_load(f)
    Swagger(app, template=swagger_template)
    app.register_blueprint(products_bp)
    app.register_blueprint(merchants_bp)
    app.register_blueprint(metrics_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001, host='0.0.0.0')
