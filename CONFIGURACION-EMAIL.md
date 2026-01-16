# 📧 CONFIGURACIÓN EMAILJS - IASD MAGNOLIA

## ✅ Sistema de Email Automático GRATUITO

### 🚀 PASOS RÁPIDOS

#### 1. Crear cuenta gratuita
- Ve a: https://www.emailjs.com/register
- 200 emails gratis por mes (perfecto para la iglesia)

#### 2. Configurar EmailJS
En tu dashboard:
- **Services** → Add Gmail
- **Templates** → Crear template
- **API Keys** → Copiar Public Key

#### 3. Actualizar código
En `assets/js/components/club/email-service.js` líneas 12-14:
```javascript
this.serviceId = 'TU_SERVICE_ID';
this.templateId = 'TU_TEMPLATE_ID';
this.publicKey = 'TU_PUBLIC_KEY';
```

#### 4. Template Email
```html
Subject: Inscripción Club Juvenil - IASD Magnolia

HTML:
<p>{{message}}</p>
<p><strong>Adjunto:</strong> PDF con inscripción</p>
<p><strong>Enviado:</strong> {{timestamp}}</p>
```

### 🎯 RESULTADO FINAL

✅ **From automático**: noreply@magnolia  
✅ **Envío instantáneo** sin intervención manual  
✅ **PDF adjunto automático**  
✅ **100% Gratuito** (200 emails/mes)  

### 🧪 PROBAR
Abre `club.html` → Inscripción → ¡Email enviado automáticamente!

---
**Configuración:** Completamente gratuito con EmailJS
**Estado:** Listo para uso en producción