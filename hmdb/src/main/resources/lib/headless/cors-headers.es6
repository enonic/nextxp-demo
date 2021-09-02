import { FRONTEND_DOMAIN } from '../../frontend-connection-config';

exports.CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': FRONTEND_DOMAIN
};
