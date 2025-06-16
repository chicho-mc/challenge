from flask import Blueprint, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter

metrics_bp = Blueprint('metrics', __name__)

# Example metric: count all HTTP requests
http_requests_total = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])

@metrics_bp.route('/metrics')
def metrics():
    """Expose Prometheus metrics."""
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)
