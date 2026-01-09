// Netlify Function: validate-phone
// Validates phone numbers using various API providers

const PROVIDERS = {
    numverify: {
        name: 'NumVerify',
        baseUrl: 'http://apilayer.net/api/validate',
        buildUrl: (phone, apiKey) => 
            `http://apilayer.net/api/validate?access_key=${apiKey}&number=${encodeURIComponent(phone)}&format=1`,
        parseResponse: (data) => ({
            valid: data.valid,
            number: data.number,
            local_format: data.local_format,
            international_format: data.international_format,
            country_prefix: data.country_prefix,
            country_code: data.country_code,
            country_name: data.country_name,
            location: data.location,
            carrier: data.carrier,
            line_type: data.line_type
        })
    },
    abstractapi: {
        name: 'AbstractAPI',
        baseUrl: 'https://phonevalidation.abstractapi.com/v1/',
        buildUrl: (phone, apiKey) => 
            `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${encodeURIComponent(phone)}`,
        parseResponse: (data) => ({
            valid: data.valid,
            number: data.phone,
            local_format: data.format?.local,
            international_format: data.format?.international,
            country_prefix: data.country?.prefix,
            country_code: data.country?.code,
            country_name: data.country?.name,
            location: data.location,
            carrier: data.carrier,
            line_type: data.type
        })
    },
    veriphone: {
        name: 'Veriphone',
        baseUrl: 'https://api.veriphone.io/v2/verify',
        buildUrl: (phone, apiKey) => 
            `https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(phone)}&key=${apiKey}`,
        parseResponse: (data) => ({
            valid: data.phone_valid,
            number: data.phone,
            local_format: data.phone_domestic,
            international_format: data.phone_e164,
            country_prefix: data.country_prefix,
            country_code: data.country_code,
            country_name: data.country,
            location: data.phone_region,
            carrier: data.carrier,
            line_type: data.phone_type
        })
    }
};

// Country code patterns for validation
const COUNTRY_PATTERNS = {
    // Europe
    '34': { name: 'Spain', region: 'Europe', mobilePrefix: /^[67]/ },
    '33': { name: 'France', region: 'Europe', mobilePrefix: /^[67]/ },
    '49': { name: 'Germany', region: 'Europe', mobilePrefix: /^1[567]/ },
    '44': { name: 'United Kingdom', region: 'Europe', mobilePrefix: /^7/ },
    '39': { name: 'Italy', region: 'Europe', mobilePrefix: /^3/ },
    '351': { name: 'Portugal', region: 'Europe', mobilePrefix: /^9/ },
    '31': { name: 'Netherlands', region: 'Europe', mobilePrefix: /^6/ },
    '32': { name: 'Belgium', region: 'Europe', mobilePrefix: /^4/ },
    '41': { name: 'Switzerland', region: 'Europe', mobilePrefix: /^7/ },
    '43': { name: 'Austria', region: 'Europe', mobilePrefix: /^6/ },
    '48': { name: 'Poland', region: 'Europe', mobilePrefix: /^[5-8]/ },
    
    // North America
    '1': { name: 'USA/Canada', region: 'North America', mobilePrefix: /^[2-9]/ },
    
    // Central America
    '52': { name: 'Mexico', region: 'Central America', mobilePrefix: /^[1-9]/ },
    '502': { name: 'Guatemala', region: 'Central America', mobilePrefix: /^[3-5]/ },
    '503': { name: 'El Salvador', region: 'Central America', mobilePrefix: /^[67]/ },
    '504': { name: 'Honduras', region: 'Central America', mobilePrefix: /^[389]/ },
    '505': { name: 'Nicaragua', region: 'Central America', mobilePrefix: /^[578]/ },
    '506': { name: 'Costa Rica', region: 'Central America', mobilePrefix: /^[5-8]/ },
    '507': { name: 'Panama', region: 'Central America', mobilePrefix: /^6/ },
    
    // South America
    '54': { name: 'Argentina', region: 'South America', mobilePrefix: /^9?[1-3]/ },
    '55': { name: 'Brazil', region: 'South America', mobilePrefix: /^[1-9]/ },
    '56': { name: 'Chile', region: 'South America', mobilePrefix: /^9/ },
    '57': { name: 'Colombia', region: 'South America', mobilePrefix: /^3/ },
    '58': { name: 'Venezuela', region: 'South America', mobilePrefix: /^4/ },
    '51': { name: 'Peru', region: 'South America', mobilePrefix: /^9/ },
    '593': { name: 'Ecuador', region: 'South America', mobilePrefix: /^9/ },
    '591': { name: 'Bolivia', region: 'South America', mobilePrefix: /^[67]/ },
    '595': { name: 'Paraguay', region: 'South America', mobilePrefix: /^9/ },
    '598': { name: 'Uruguay', region: 'South America', mobilePrefix: /^9/ }
};

// Basic format validation (fallback when no API key)
function basicValidation(phone) {
    // Clean the phone number
    let cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Remove leading + if present
    if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.substring(1);
    }
    
    // Check minimum/maximum length
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return {
            valid: false,
            number: phone,
            error: 'Invalid phone number length'
        };
    }
    
    // Try to identify the country
    let countryInfo = null;
    let countryPrefix = '';
    let nationalNumber = '';
    
    // Check 3-digit prefixes first
    for (const prefix of Object.keys(COUNTRY_PATTERNS).filter(p => p.length === 3)) {
        if (cleanPhone.startsWith(prefix)) {
            countryInfo = COUNTRY_PATTERNS[prefix];
            countryPrefix = prefix;
            nationalNumber = cleanPhone.substring(3);
            break;
        }
    }
    
    // Then check 2-digit prefixes
    if (!countryInfo) {
        for (const prefix of Object.keys(COUNTRY_PATTERNS).filter(p => p.length === 2)) {
            if (cleanPhone.startsWith(prefix)) {
                countryInfo = COUNTRY_PATTERNS[prefix];
                countryPrefix = prefix;
                nationalNumber = cleanPhone.substring(2);
                break;
            }
        }
    }
    
    // Finally check 1-digit prefixes
    if (!countryInfo) {
        for (const prefix of Object.keys(COUNTRY_PATTERNS).filter(p => p.length === 1)) {
            if (cleanPhone.startsWith(prefix)) {
                countryInfo = COUNTRY_PATTERNS[prefix];
                countryPrefix = prefix;
                nationalNumber = cleanPhone.substring(1);
                break;
            }
        }
    }
    
    if (!countryInfo) {
        return {
            valid: false,
            number: phone,
            error: 'Unrecognized country code'
        };
    }
    
    // Check if it looks like a mobile number
    const isMobile = countryInfo.mobilePrefix.test(nationalNumber);
    
    return {
        valid: true,
        number: cleanPhone,
        international_format: `+${cleanPhone}`,
        country_prefix: `+${countryPrefix}`,
        country_name: countryInfo.name,
        location: countryInfo.region,
        line_type: isMobile ? 'mobile' : 'unknown',
        validation_type: 'basic'
    };
}

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { phone, provider = 'numverify', apiKey: clientApiKey } = JSON.parse(event.body);

        if (!phone) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Phone number is required' })
            };
        }

        // Use environment variable API key, fallback to client-provided key
        const apiKey = process.env.NUMVERIFY_API_KEY || clientApiKey;

        // If no API key available, use basic validation
        if (!apiKey) {
            const result = basicValidation(phone);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...result,
                    note: 'Basic validation only. Add API key for full validation.'
                })
            };
        }

        // Get provider config
        const providerConfig = PROVIDERS[provider];
        if (!providerConfig) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid API provider' })
            };
        }

        // Build API URL
        const url = providerConfig.buildUrl(phone, apiKey);

        // Make API request
        const response = await fetch(url);
        const data = await response.json();

        // Check for API errors
        if (data.error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    valid: false,
                    number: phone,
                    error: data.error.info || data.error.message || 'API error'
                })
            };
        }

        // Parse and return response
        const result = providerConfig.parseResponse(data);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Validation error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                valid: false,
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
