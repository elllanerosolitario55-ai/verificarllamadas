# 📱 PhoneCheck Pro - Validador de Líneas Móviles

Herramienta profesional para validar números de teléfono móvil de Europa, América Central, Sudamérica y Norteamérica. Desplegable en Netlify.

![PhoneCheck Pro](https://img.shields.io/badge/Netlify-Ready-00C7B7?style=for-the-badge&logo=netlify)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🌍 Regiones Soportadas

| Región | Países |
|--------|--------|
| 🇪🇺 Europa | España, Francia, Alemania, Reino Unido, Italia, Portugal, Países Bajos, Bélgica, Suiza, Austria, Polonia |
| 🇺🇸 Norteamérica | Estados Unidos, Canadá |
| 🇲🇽 América Central | México, Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica, Panamá |
| 🇧🇷 Sudamérica | Argentina, Brasil, Chile, Colombia, Venezuela, Perú, Ecuador, Bolivia, Paraguay, Uruguay |

## ✨ Características

- ✅ Validación individual y masiva de números
- 📊 Información detallada: país, operador, tipo de línea
- 📤 Exportación a CSV y JSON
- 🔐 API keys almacenadas localmente (seguro)
- 🎨 Interfaz moderna y responsive
- ⚡ Serverless (Netlify Functions)

## 🚀 Despliegue en Netlify

### Opción 1: Deploy con un click

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TU_USUARIO/phone-validator)

### Opción 2: Deploy manual

1. **Sube el proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/phone-validator.git
   git push -u origin main
   ```

2. **Conecta con Netlify**
   - Ve a [Netlify](https://app.netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona tu repositorio de GitHub
   - Configuración de build:
     - Build command: (dejar vacío)
     - Publish directory: `.`
   - Click en "Deploy site"

### Opción 3: Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Inicializar y desplegar
netlify init
netlify deploy --prod
```

## 🔑 Configuración de API Keys

La herramienta soporta múltiples proveedores de validación de teléfonos:

### NumVerify (Recomendado)
1. Registrarse en [numverify.com](https://numverify.com)
2. Obtener API key gratuita (250 requests/mes)
3. Configurar en la app

### AbstractAPI
1. Registrarse en [abstractapi.com](https://www.abstractapi.com/phone-validation-api)
2. Obtener API key gratuita (1,000 requests/mes)
3. Configurar en la app

### Veriphone
1. Registrarse en [veriphone.io](https://veriphone.io)
2. Obtener API key gratuita (1,000 requests/mes)
3. Configurar en la app

## 📁 Estructura del Proyecto

```
phone-validator/
├── index.html                    # Frontend de la aplicación
├── netlify.toml                  # Configuración de Netlify
├── package.json                  # Dependencias del proyecto
├── README.md                     # Este archivo
└── netlify/
    └── functions/
        └── validate-phone.js     # Función serverless
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La app estará disponible en http://localhost:8888
```

## 📝 API Endpoints

### POST /.netlify/functions/validate-phone

Valida un número de teléfono.

**Request Body:**
```json
{
  "phone": "+34612345678",
  "provider": "numverify",
  "apiKey": "tu_api_key"
}
```

**Response:**
```json
{
  "valid": true,
  "number": "34612345678",
  "international_format": "+34612345678",
  "country_prefix": "+34",
  "country_name": "Spain",
  "carrier": "Movistar",
  "line_type": "mobile"
}
```

## 🔒 Seguridad

- Las API keys se almacenan únicamente en localStorage del navegador
- No se guardan números ni resultados en el servidor
- Las funciones serverless procesan las peticiones de forma segura
- Headers de seguridad configurados (X-Frame-Options, XSS Protection, etc.)

## 📊 Información que se Obtiene

| Campo | Descripción |
|-------|-------------|
| `valid` | Si el número es válido |
| `number` | Número en formato nacional |
| `international_format` | Número en formato internacional |
| `country_prefix` | Prefijo del país |
| `country_name` | Nombre del país |
| `carrier` | Operador/Compañía |
| `line_type` | Tipo de línea (mobile/landline/voip) |
| `location` | Ubicación/Región |

## 🐛 Solución de Problemas

### Error "API not configured"
- Asegúrate de haber configurado tu API key en la pestaña "Configuración"
- Verifica que la API key sea válida

### Error "Invalid phone number"
- Verifica que el número incluya el código de país
- Formato esperado: `+34612345678` o `34612345678`

### Rate limits
- NumVerify: 250 requests/mes (plan gratuito)
- AbstractAPI: 1,000 requests/mes (plan gratuito)
- Veriphone: 1,000 requests/mes (plan gratuito)

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request.

---

Desarrollado con ❤️ para la comunidad
