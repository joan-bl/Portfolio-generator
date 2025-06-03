// 1. Función para exportar HTML completo
const exportToHTML = (portfolioData) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.personalInfo.name} - ${portfolioData.personalInfo.title}</title>
    <meta name="description" content="${portfolioData.personalInfo.bio}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.css" rel="stylesheet">
</head>
<body>
    <!-- Tu portafolio generado aquí -->
    ${generatePortfolioHTML(portfolioData)}
</body>
</html>`;

  const blob = new Blob([htmlTemplate], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${portfolioData.personalInfo.name || 'portfolio'}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// 2. Persistencia local (localStorage)
const saveToLocalStorage = (data) => {
  localStorage.setItem('portfolioData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('portfolioData');
  return saved ? JSON.parse(saved) : null;
};

// 3. Upload de imágenes
const handleImageUpload = (file, callback) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

// 4. Generación de biografía con IA real (usando una API)
const generateRealAIBio = async (title, name) => {
  try {
    // Ejemplo con OpenAI API (necesitarías una clave API)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Genera una biografía profesional para ${name}, que es ${title}. Máximo 200 palabras, tono profesional pero cercano.`
        }],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generando biografía:', error);
    return `${name} es un/a ${title} apasionado/a por la innovación y la excelencia. Con experiencia en proyectos diversos, se especializa en crear soluciones que combinan funcionalidad y diseño excepcional.`;
  }
};

// 5. Validación de formularios
const validatePortfolioData = (data) => {
  const errors = [];
  
  if (!data.personalInfo.name) errors.push('El nombre es requerido');
  if (!data.personalInfo.title) errors.push('El título profesional es requerido');
  if (data.projects.length === 0) errors.push('Añade al menos un proyecto');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 6. Generador de SEO meta tags
const generateSEOMeta = (portfolioData) => {
  return {
    title: `${portfolioData.personalInfo.name} - ${portfolioData.personalInfo.title}`,
    description: portfolioData.personalInfo.bio || `Portfolio profesional de ${portfolioData.personalInfo.name}`,
    keywords: portfolioData.skills.join(', '),
    ogImage: portfolioData.personalInfo.avatar || 'default-og-image.jpg',
    canonical: `https://tu-dominio.com`
  };
};

// 7. Analytics y tracking (opcional)
const trackEvent = (eventName, properties = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // También podrías usar otras herramientas como Mixpanel, Hotjar, etc.
  console.log(`Event tracked: ${eventName}`, properties);
};

// 8. Función para generar el HTML completo del portafolio
const generatePortfolioHTML = (portfolioData) => {
  const theme = portfolioData.theme.style || 'minimal';
  const layout = portfolioData.theme.layout || 'grid';
  
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <!-- Header/Hero Section -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div class="relative container mx-auto px-6 py-20">
          <div class="max-w-4xl mx-auto text-center">
            <div class="mb-8">
              ${portfolioData.personalInfo.avatar ? 
                `<img src="${portfolioData.personalInfo.avatar}" alt="Avatar" class="w-32 h-32 rounded-full mx-auto shadow-lg object-cover">` :
                `<div class="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                   <span class="text-white text-4xl font-bold">${portfolioData.personalInfo.name.charAt(0) || 'P'}</span>
                 </div>`
              }
            </div>
            
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              ${portfolioData.personalInfo.name || 'Tu Nombre'}
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-600 mb-6 font-light">
              ${portfolioData.personalInfo.title || 'Tu Título Profesional'}
            </p>
            
            <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
              ${portfolioData.personalInfo.bio || 'Tu biografía aparecerá aquí.'}
            </p>

            <div class="flex justify-center gap-4 mb-8">
              ${Object.entries(portfolioData.socialLinks)
                .filter(([key, value]) => value)
                .map(([key, value]) => {
                  const icons = {
                    github: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
                    linkedin: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                    instagram: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.295C3.853 14.285 3.136 12.018 3.136 9.724c0-2.295.717-4.562 2.017-6.27C6.028 2.649 7.179 2.16 8.476 2.16c1.297 0 2.448.489 3.323 1.294 1.301 1.708 2.017 3.975 2.017 6.27 0 2.294-.716 4.561-2.017 6.269-.875.805-2.026 1.295-3.323 1.295zm7.138 0c-1.297 0-2.448-.49-3.323-1.295-1.301-1.708-2.017-3.975-2.017-6.269 0-2.295.716-4.562 2.017-6.27.875-.805 2.026-1.294 3.323-1.294 1.297 0 2.448.489 3.323 1.294 1.301 1.708 2.017 3.975 2.017 6.27 0 2.294-.716 4.561-2.017 6.269-.875.805-2.026 1.295-3.323 1.295z"/></svg>',
                    twitter: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
                  };
                  
                  return `<a href="${value}" class="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    ${icons[key] || ''}
                  </a>`;
                }).join('')
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      ${portfolioData.skills.length > 0 ? `
        <div class="py-20 bg-gray-50">
          <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
              Habilidades & Tecnologías
            </h2>
            <div class="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              ${portfolioData.skills.map(skill => 
                `<span class="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105" style="border-left: 4px solid ${portfolioData.theme.primaryColor}">
                  ${skill}
                </span>`
              ).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Projects Section -->
      <div class="py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
            Proyectos Destacados
          </h2>
          
          ${portfolioData.projects.length === 0 ? `
            <div class="text-center py-12">
              <p class="text-gray-500 text-lg">No hay proyectos disponibles</p>
            </div>
          ` : `
            <div class="grid gap-8 ${layout === 'bento' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}">
              ${portfolioData.projects.map((project, index) => `
                <div class="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 ${layout === 'bento' && index % 3 === 0 ? 'md:col-span-2 md:row-span-1' : ''} ${project.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}">
                  <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center text-gray-600">
                        <div class="w-12 h-12 mx-auto mb-2 opacity-50">🎨</div>
                        <p class="text-sm">Vista previa del proyecto</p>
                      </div>
                    </div>
                    ${project.featured ? `
                      <div class="absolute top-4 right-4">
                        <div class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          ❤️ Destacado
                        </div>
                      </div>
                    ` : ''}
                  </div>
                  
                  <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        ${project.title}
                      </h3>
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        ${project.category}
                      </span>
                    </div>
                    
                    <p class="text-gray-600 mb-4 leading-relaxed">
                      ${project.description}
                    </p>
                    
                    ${project.tags.length > 0 ? `
                      <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tags.slice(0, 3).map(tag => 
                          `<span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                            ${tag}
                          </span>`
                        ).join('')}
                        ${project.tags.length > 3 ? `
                          <span class="text-xs text-gray-500 px-2 py-1">
                            +${project.tags.length - 3} más
                          </span>
                        ` : ''}
                      </div>
                    ` : ''}
                    
                    <div class="flex gap-3">
                      ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" 
                           class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2 text-sm">
                          🔗 Ver Demo
                        </a>
                      ` : ''}
                      ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                          GitHub
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Contact Section -->
      <div class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Estoy siempre abierto a nuevas oportunidades y colaboraciones interesantes.
          </p>
          
          <div class="flex flex-wrap justify-center gap-6">
            ${portfolioData.personalInfo.email ? `
              <a href="mailto:${portfolioData.personalInfo.email}" 
                 class="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                📧 Enviar Email
              </a>
            ` : ''}
            ${portfolioData.personalInfo.phone ? `
              <a href="tel:${portfolioData.personalInfo.phone}"
                 class="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2">
                📞 Llamar
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
};

// 9. Función para auto-guardar datos
const useAutoSave = (portfolioData) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(portfolioData);
    }, 2000); // Auto-guardar cada 2 segundos de inactividad

    return () => clearTimeout(timer);
  }, [portfolioData]);
};

// 10. Función para generar slug/URL amigable
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios con guiones
    .replace(/^-+|-+$/g, ''); // Remover guiones del inicio y final
};

// 11. Función para validar URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 12. Función para comprimir imágenes
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// 13. Función para generar colores de tema automáticamente
const generateThemeColors = (baseColor) => {
  // Convertir hex a HSL y generar variaciones
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  };
  
  const [h, s, l] = hexToHsl(baseColor);
  
  return {
    primary: baseColor,
    secondary: `hsl(${(h + 30) % 360}, ${s}%, ${l}%)`,
    accent: `hsl(${(h + 60) % 360}, ${s}%, ${Math.max(l - 10, 10)}%)`,
    light: `hsl(${h}, ${Math.max(s - 20, 10)}%, ${Math.min(l + 30, 95)}%)`,
    dark: `hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 30, 5)}%)`
  };
};

// 14. Hook personalizado para gestión de estado del portafolio
const usePortfolioState = () => {
  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = loadFromLocalStorage();
    return saved || {
      personalInfo: {
        name: '',
        title: '',
        bio: '',
        location: '',
        email: '',
        phone: '',
        website: '',
        avatar: null
      },
      projects: [],
      skills: [],
      socialLinks: {
        github: '',
        linkedin: '',
        instagram: '',
        twitter: ''
      },
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        style: 'minimal',
        layout: 'grid'
      }
    };
  });

  // Auto-guardar cuando cambien los datos
  useAutoSave(portfolioData);

  return [portfolioData, setPortfolioData];
};

// 15. Función para notificaciones/toast
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// Exportar todas las funciones
export {
  exportToHTML,
  saveToLocalStorage,
  loadFromLocalStorage,
  handleImageUpload,
  generateRealAIBio,
  validatePortfolioData,
  generateSEOMeta,
  trackEvent,
  generatePortfolioHTML,
  useAutoSave,
  generateSlug,
  isValidUrl,
  compressImage,
  generateThemeColors,
  usePortfolioState,
  showNotification
};