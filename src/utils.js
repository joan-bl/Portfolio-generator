// utils/index.js - Archivo principal de utilidades corregido

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export const storageUtils = {
  save: (key, data) => {
    try {
      const serialized = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
      localStorage.setItem(key, serialized);
      return { success: true };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return { success: false, error: error.message };
    }
  },

  load: (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return { success: true, data: null };

      const parsed = JSON.parse(saved);
      return { success: true, data: parsed.data, timestamp: parsed.timestamp };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return { success: false, error: error.message };
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const validationUtils = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl: (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  sanitizeHtml: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  validatePortfolioData: (data) => {
    const errors = [];
    
    if (!data.personalInfo?.name?.trim()) {
      errors.push('Nombre es requerido');
    }
    
    if (!data.personalInfo?.title?.trim()) {
      errors.push('Título profesional es requerido');
    }
    
    if (data.personalInfo?.email && !validationUtils.isValidEmail(data.personalInfo.email)) {
      errors.push('Email inválido');
    }
    
    if (data.projects.length === 0) {
      errors.push('Añade al menos un proyecto');
    }

    // Validar URLs de proyectos
    data.projects.forEach((project, index) => {
      if (project.liveUrl && !validationUtils.isValidUrl(project.liveUrl)) {
        errors.push(`URL demo del proyecto ${index + 1} es inválida`);
      }
      if (project.githubUrl && !validationUtils.isValidUrl(project.githubUrl)) {
        errors.push(`URL GitHub del proyecto ${index + 1} es inválida`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// ============================================================================
// GITHUB API UTILITIES
// ============================================================================

export const githubUtils = {
  fetchRepos: async (username) => {
    if (!username) {
      return { success: false, error: 'Username is required' };
    }

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      
      const formattedRepos = repos.map(repo => ({
        id: `github-${repo.id}`,
        title: repo.name,
        description: repo.description || 'No description available',
        category: repo.language || 'Code',
        tags: repo.topics || [],
        liveUrl: repo.homepage || '',
        githubUrl: repo.html_url,
        featured: repo.stargazers_count > 5,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        isGithubImport: true
      }));

      return { success: true, data: formattedRepos };
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      return { success: false, error: error.message };
    }
  },

  extractUsername: (githubUrl) => {
    if (!githubUrl) return null;
    
    try {
      const url = new URL(githubUrl);
      if (url.hostname !== 'github.com') return null;
      
      const pathParts = url.pathname.split('/').filter(Boolean);
      return pathParts[0] || null;
    } catch {
      return null;
    }
  }
};

// ============================================================================
// HTML GENERATION UTILITIES
// ============================================================================

export const htmlGenerator = {
  generateMetaTags: (portfolioData) => {
    const { personalInfo, skills } = portfolioData;
    const title = `${personalInfo.name || 'Portfolio'} - ${personalInfo.title || 'Professional'}`;
    const description = personalInfo.bio || `Professional portfolio of ${personalInfo.name || 'a professional'}`;
    
    return `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${htmlGenerator.escapeHtml(title)}</title>
      <meta name="description" content="${htmlGenerator.escapeHtml(description)}">
      <meta name="keywords" content="${skills.map(s => htmlGenerator.escapeHtml(s)).join(', ')}">
      <meta name="author" content="${htmlGenerator.escapeHtml(personalInfo.name || '')}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:title" content="${htmlGenerator.escapeHtml(title)}">
      <meta property="og:description" content="${htmlGenerator.escapeHtml(description)}">
      
      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:title" content="${htmlGenerator.escapeHtml(title)}">
      <meta property="twitter:description" content="${htmlGenerator.escapeHtml(description)}">
    `;
  },

  generateAnalyticsScript: (trackingId) => {
    if (!trackingId) return '';
    
    return `
      <!-- Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
        
        // Track portfolio interactions
        function trackEvent(eventName, parameters = {}) {
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
          }
        }
        
        // Auto-track common events
        document.addEventListener('DOMContentLoaded', () => {
          // Track email clicks
          document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => trackEvent('contact_email_click'));
          });
          
          // Track phone clicks
          document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => trackEvent('contact_phone_click'));
          });
          
          // Track external links
          document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', () => trackEvent('external_link_click', { url: link.href }));
          });
        });
      </script>
    `;
  },

  generatePWAManifest: (portfolioData) => {
    if (!portfolioData.pwa?.enabled) return '';
    
    const manifest = {
      name: portfolioData.pwa.name || 'Portfolio',
      short_name: portfolioData.pwa.shortName || 'Portfolio',
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: portfolioData.theme.primaryColor || "#6366f1",
      icons: [
        {
          src: htmlGenerator.generateDynamicIcon(
            portfolioData.personalInfo.name?.charAt(0) || 'P',
            portfolioData.theme.primaryColor || "#6366f1"
          ),
          sizes: "192x192",
          type: "image/svg+xml"
        },
        {
          src: htmlGenerator.generateDynamicIcon(
            portfolioData.personalInfo.name?.charAt(0) || 'P',
            portfolioData.theme.primaryColor || "#6366f1"
          ),
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ]
    };

    const manifestJson = JSON.stringify(manifest);
    const manifestBase64 = btoa(manifestJson);
    
    return `<link rel="manifest" href="data:application/json;base64,${manifestBase64}">`;
  },

  generateDynamicIcon: (letter, color) => {
    const svg = `
      <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="192" height="192" rx="24" fill="${color}"/>
        <text x="96" y="120" text-anchor="middle" fill="white" font-size="80" font-family="system-ui, sans-serif" font-weight="bold">${letter}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  },

  escapeHtml: (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  generateCompleteHTML: (portfolioData) => {
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    
    return `<!DOCTYPE html>
<html lang="es" class="${isDarkTheme ? 'dark' : ''}">
<head>
    ${htmlGenerator.generateMetaTags(portfolioData)}
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '${portfolioData.theme?.primaryColor || '#6366f1'}',
                        secondary: '${portfolioData.theme?.secondaryColor || '#8b5cf6'}'
                    }
                }
            }
        }
    </script>
    
    ${htmlGenerator.generatePWAManifest(portfolioData)}
    ${htmlGenerator.generateAnalyticsScript(portfolioData.analytics?.trackingId)}
    
    <style>
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        /* Enhanced styles */
        .dark body { background-color: #111827; color: #f9fafb; }
        img { opacity: 0; transition: opacity 0.3s ease; }
        img.loaded { opacity: 1; }
        a, button { transition: all 0.3s ease; }
        .group:hover { transform: translateY(-4px); }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDarkTheme ? '#374151' : '#f1f5f9'}; }
        ::-webkit-scrollbar-thumb { background: ${portfolioData.theme?.primaryColor || '#6366f1'}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${portfolioData.theme?.secondaryColor || '#8b5cf6'}; }
        
        /* Print styles */
        @media print {
            .fixed, #darkModeToggle { display: none !important; }
            body { background: white !important; color: black !important; }
        }
        
        /* Accessibility */
        @media (prefers-contrast: high) { body { filter: contrast(1.2); } }
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body class="${isDarkTheme ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}">
    ${htmlGenerator.generatePortfolioContent(portfolioData)}
    ${htmlGenerator.generateJavaScript(portfolioData)}
</body>
</html>`;
  },

  generatePortfolioContent: (portfolioData) => {
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    
    return `
      <!-- Dark Mode Toggle -->
      <button id="darkModeToggle" class="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <svg id="sunIcon" class="w-5 h-5 ${isDarkTheme ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg id="moonIcon" class="w-5 h-5 ${isDarkTheme ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
      </button>

      <!-- Portfolio Content -->
      <div class="min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}">
          ${htmlGenerator.generateHeroSection(portfolioData)}
          ${htmlGenerator.generateSkillsSection(portfolioData)}
          ${htmlGenerator.generateExperienceSection(portfolioData)}
          ${htmlGenerator.generateProjectsSection(portfolioData)}
          ${htmlGenerator.generateTestimonialsSection(portfolioData)}
          ${htmlGenerator.generateContactSection(portfolioData)}
      </div>
    `;
  },

  generateHeroSection: (portfolioData) => {
    const { personalInfo, socialLinks, theme } = portfolioData;
    const isDarkTheme = theme?.style === 'dark' || theme?.darkMode;
    
    const avatarContent = personalInfo.avatar ? 
      `<img src="${htmlGenerator.escapeHtml(personalInfo.avatar)}" alt="Avatar" class="w-32 h-32 rounded-full mx-auto shadow-lg object-cover">` :
      `<div class="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
         <span class="text-white text-4xl font-bold">${htmlGenerator.escapeHtml(personalInfo.name?.charAt(0) || 'P')}</span>
       </div>`;

    const socialLinksHtml = Object.entries(socialLinks || {})
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const icons = {
          github: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
          linkedin: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
          instagram: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm4.624 12.47c0 2.963-2.4 5.364-5.364 5.364s-5.364-2.401-5.364-5.364 2.4-5.364 5.364-5.364 5.364 2.401 5.364 5.364zm-2.268 0c0-1.71-1.387-3.096-3.096-3.096s-3.096 1.387-3.096 3.096 1.387 3.096 3.096 3.096 3.096-1.387 3.096-3.096z"/></svg>',
          twitter: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
        };
        
        const colorMap = {
          github: isDarkTheme ? 'text-gray-300' : 'text-gray-700',
          linkedin: 'text-blue-600',
          instagram: 'text-pink-600',
          twitter: 'text-blue-400'
        };
        
        return `<a href="${htmlGenerator.escapeHtml(value)}" target="_blank" rel="noopener noreferrer" class="p-3 ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
          <span class="${colorMap[key]}">${icons[key] || ''}</span>
        </a>`;
      }).join('');

    return `
      <div class="relative overflow-hidden">
          ${personalInfo.videoBackground ? `
          <video autoplay muted loop class="absolute inset-0 w-full h-full object-cover opacity-20">
              <source src="${htmlGenerator.escapeHtml(personalInfo.videoBackground)}" type="video/mp4">
          </video>` : ''}
          
          <div class="absolute inset-0 ${isDarkTheme ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90' : 'bg-gradient-to-br from-indigo-50/90 via-white/90 to-purple-50/90'}"></div>
          
          <div class="relative container mx-auto px-6 py-20">
              <div class="max-w-4xl mx-auto text-center">
                  <div class="mb-8">${avatarContent}</div>
                  
                  <h1 class="text-5xl md:text-6xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-4 animate-fade-in">
                      ${htmlGenerator.escapeHtml(personalInfo.name || 'Tu Nombre')}
                  </h1>
                  
                  <p class="text-xl md:text-2xl ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-6 font-light">
                      ${htmlGenerator.escapeHtml(personalInfo.title || 'Tu Título Profesional')}
                  </p>
                  
                  <p class="text-lg ${isDarkTheme ? 'text-gray-400' : 'text-gray-700'} max-w-2xl mx-auto mb-8 leading-relaxed">
                      ${htmlGenerator.escapeHtml(personalInfo.bio || 'Tu biografía aparecerá aquí.')}
                  </p>

                  <div class="flex justify-center gap-4 mb-8">${socialLinksHtml}</div>
                  ${htmlGenerator.generateContactInfo(personalInfo, isDarkTheme)}
              </div>
          </div>
      </div>
    `;
  },

  generateContactInfo: (personalInfo, isDarkTheme) => {
    const contactItems = [];
    
    if (personalInfo.location) {
      contactItems.push(`
        <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            ${htmlGenerator.escapeHtml(personalInfo.location)}
        </div>
      `);
    }

    if (personalInfo.email) {
      contactItems.push(`
        <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            ${htmlGenerator.escapeHtml(personalInfo.email)}
        </div>
      `);
    }

    return contactItems.length > 0 ? 
      `<div class="flex flex-wrap justify-center gap-4 text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">${contactItems.join('')}</div>` : '';
  },

  generateSkillsSection: (portfolioData) => {
    if (!portfolioData.skills || portfolioData.skills.length === 0) return '';
    
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    const skillsHtml = portfolioData.skills.map(skill => 
      `<span class="px-4 py-2 ${isDarkTheme ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700'} rounded-full shadow-sm font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105" style="border-left: 4px solid ${portfolioData.theme?.primaryColor || '#6366f1'}">${htmlGenerator.escapeHtml(skill)}</span>`
    ).join('');

    return `
      <div class="py-20 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}">
          <div class="container mx-auto px-6">
              <h2 class="text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-12">
                  Habilidades & Tecnologías
              </h2>
              <div class="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  ${skillsHtml}
              </div>
          </div>
      </div>
    `;
  },

  generateExperienceSection: (portfolioData) => {
    if (!portfolioData.experience || portfolioData.experience.length === 0) return '';
    
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    const experienceHtml = portfolioData.experience.map((exp, index) => 
      `<div class="relative pl-8 pb-12 ${index === portfolioData.experience.length - 1 ? '' : 'border-l border-gray-200 dark:border-gray-700'}">
          <div class="absolute left-0 top-0 w-4 h-4 bg-indigo-600 rounded-full transform -translate-x-2"></div>
          <div class="${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg ml-6">
              <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}">
                      ${htmlGenerator.escapeHtml(exp.position)}
                  </h3>
                  <span class="text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                      ${htmlGenerator.escapeHtml(exp.startDate)} - ${exp.current ? 'Presente' : htmlGenerator.escapeHtml(exp.endDate)}
                  </span>
              </div>
              <p class="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  ${htmlGenerator.escapeHtml(exp.company)}
              </p>
              ${exp.description ? `<p class="${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">${htmlGenerator.escapeHtml(exp.description)}</p>` : ''}
          </div>
      </div>`
    ).join('');

    return `
      <div class="py-20">
          <div class="container mx-auto px-6">
              <h2 class="text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-16">
                  Experiencia Profesional
              </h2>
              <div class="max-w-4xl mx-auto">
                  ${experienceHtml}
              </div>
          </div>
      </div>
    `;
  },

  generateProjectsSection: (portfolioData) => {
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    
    const emptyState = `
      <div class="text-center py-12">
          <div class="w-24 h-24 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="${isDarkTheme ? 'text-gray-500' : 'text-gray-400'} text-3xl">🎨</span>
          </div>
          <p class="text-lg ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}">
              Proyectos próximamente
          </p>
      </div>
    `;

    const projectsHtml = portfolioData.projects && portfolioData.projects.length > 0 ? 
      `<div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          ${portfolioData.projects.map((project) => 
            `<div class="group ${isDarkTheme ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 ${project.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}">
                <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                            <div class="text-4xl mb-2 opacity-50">🎨</div>
                            <p class="text-sm">Vista previa del proyecto</p>
                        </div>
                    </div>
                    ${project.featured ? 
                      `<div class="absolute top-4 right-4">
                          <div class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              ❤️ Destacado
                          </div>
                      </div>` : ''}
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${isDarkTheme ? 'text-white' : 'text-gray-900'}">
                            ${htmlGenerator.escapeHtml(project.title)}
                        </h3>
                        <span class="text-xs ${isDarkTheme ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full">
                            ${htmlGenerator.escapeHtml(project.category)}
                        </span>
                    </div>
                    <p class="${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed">
                        ${htmlGenerator.escapeHtml(project.description)}
                    </p>
                    ${project.tags && project.tags.length > 0 ? 
                      `<div class="flex flex-wrap gap-2 mb-4">
                          ${project.tags.slice(0, 3).map(tag => 
                            `<span class="text-xs ${isDarkTheme ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-700'} px-2 py-1 rounded-full font-medium">
                                ${htmlGenerator.escapeHtml(tag)}
                            </span>`
                          ).join('')}
                          ${project.tags.length > 3 ? 
                            `<span class="text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} px-2 py-1">
                                +${project.tags.length - 3} más
                            </span>` : ''}
                      </div>` : ''}
                    <div class="flex gap-3">
                        ${project.liveUrl ? 
                          `<a href="${htmlGenerator.escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" 
                             class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2 text-sm">
                              🔗 Ver Demo
                          </a>` : ''}
                        ${project.githubUrl ? 
                          `<a href="${htmlGenerator.escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer"
                             class="px-4 py-2 border ${isDarkTheme ? 'border-gray-600 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-all duration-300 flex items-center justify-center">
                              GitHub
                          </a>` : ''}
                    </div>
                </div>
            </div>`
          ).join('')}
      </div>` : emptyState;

    return `
      <div class="py-20 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}">
          <div class="container mx-auto px-6">
              <h2 class="text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-16">
                  Proyectos Destacados
              </h2>
              ${projectsHtml}
          </div>
      </div>
    `;
  },

  generateTestimonialsSection: (portfolioData) => {
    if (!portfolioData.testimonials || portfolioData.testimonials.length === 0) return '';
    
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    const testimonialsHtml = portfolioData.testimonials.map((testimonial) => 
      `<div class="${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex gap-1 mb-4">
              ${Array.from({length: 5}, (_, i) => 
                `<span class="text-lg ${i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}">⭐</span>`
              ).join('')}
          </div>
          <p class="${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4 italic">
              "${htmlGenerator.escapeHtml(testimonial.content)}"
          </p>
          <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">
                      ${htmlGenerator.escapeHtml(testimonial.name?.charAt(0) || 'T')}
                  </span>
              </div>
              <div>
                  <h4 class="font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}">
                      ${htmlGenerator.escapeHtml(testimonial.name)}
                  </h4>
                  <p class="text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                      ${htmlGenerator.escapeHtml(testimonial.position)} ${testimonial.company ? `at ${htmlGenerator.escapeHtml(testimonial.company)}` : ''}
                  </p>
              </div>
          </div>
      </div>`
    ).join('');

    return `
      <div class="py-20">
          <div class="container mx-auto px-6">
              <h2 class="text-3xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-16">
                  Lo que dicen mis clientes
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  ${testimonialsHtml}
              </div>
          </div>
      </div>
    `;
  },

  generateContactSection: (portfolioData) => {
    const { personalInfo } = portfolioData;
    const contactButtons = [];
    
    if (personalInfo.email) {
      contactButtons.push(
        `<a href="mailto:${htmlGenerator.escapeHtml(personalInfo.email)}" 
           class="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            📧 Enviar Email
        </a>`
      );
    }
    
    if (personalInfo.phone) {
      contactButtons.push(
        `<a href="tel:${htmlGenerator.escapeHtml(personalInfo.phone)}"
           class="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2">
            📞 Llamar
        </a>`
      );
    }

    return `
      <div class="py-20 bg-gray-900 text-white">
          <div class="container mx-auto px-6 text-center">
              <h2 class="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>
              <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Estoy siempre abierto a nuevas oportunidades y colaboraciones interesantes.
              </p>
              <div class="flex flex-wrap justify-center gap-6">
                  ${contactButtons.join('')}
              </div>
          </div>
      </div>
    `;
  },

  generateJavaScript: (portfolioData) => {
    const isDarkTheme = portfolioData.theme?.style === 'dark' || portfolioData.theme?.darkMode;
    const pwaEnabled = portfolioData.pwa?.enabled;
    const analyticsEnabled = portfolioData.analytics?.enabled && portfolioData.analytics?.trackingId;
    
    return `
      <script>
          // Dark Mode Toggle
          const darkModeToggle = document.getElementById('darkModeToggle');
          const sunIcon = document.getElementById('sunIcon');
          const moonIcon = document.getElementById('moonIcon');
          const html = document.documentElement;

          let isDark = ${isDarkTheme ? 'true' : 'localStorage.getItem("darkMode") === "true"'};
          
          function updateDarkMode() {
              if (isDark) {
                  html.classList.add('dark');
                  if (sunIcon) sunIcon.classList.remove('hidden');
                  if (moonIcon) moonIcon.classList.add('hidden');
              } else {
                  html.classList.remove('dark');
                  if (sunIcon) sunIcon.classList.add('hidden');
                  if (moonIcon) moonIcon.classList.remove('hidden');
              }
              localStorage.setItem('darkMode', isDark.toString());
          }

          if (darkModeToggle) {
              darkModeToggle.addEventListener('click', () => {
                  isDark = !isDark;
                  updateDarkMode();
                  ${analyticsEnabled ? "trackEvent('dark_mode_toggle', { mode: isDark ? 'dark' : 'light' });" : ''}
              });
          }

          // Initialize dark mode
          updateDarkMode();

          ${pwaEnabled ? `
          // PWA Service Worker Registration
          if ('serviceWorker' in navigator) {
              window.addEventListener('load', async () => {
                  try {
                      const registration = await navigator.serviceWorker.register('/sw.js');
                      console.log('SW registered: ', registration);
                  } catch (registrationError) {
                      console.log('SW registration failed: ', registrationError);
                  }
              });
          }
          ` : ''}

          // Performance monitoring
          window.addEventListener('load', () => {
              const perfData = performance.getEntriesByType('navigation')[0];
              if (perfData) {
                  const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                  console.log('Page Load Time:', loadTime, 'ms');
                  ${analyticsEnabled ? "trackEvent('page_load_time', { value: Math.round(loadTime) });" : ''}
              }
          });

          // Intersection Observer for animations
          const observerOptions = {
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
          };

          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      entry.target.classList.add('animate-fade-in');
                  }
              });
          }, observerOptions);

          // Observe all sections for animation
          document.querySelectorAll('section, .container > div').forEach(el => {
              observer.observe(el);
          });

          // Smooth scroll for anchor links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function (e) {
                  e.preventDefault();
                  const target = document.querySelector(this.getAttribute('href'));
                  if (target) {
                      target.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                      });
                  }
              });
          });

          // Image loading optimization
          document.querySelectorAll('img').forEach(img => {
              img.addEventListener('load', () => {
                  img.classList.add('loaded');
              });
              
              // If image is already loaded (cached)
              if (img.complete) {
                  img.classList.add('loaded');
              }
          });

          // Keyboard navigation improvements
          document.addEventListener('keydown', (e) => {
              if (e.key === 'Tab') {
                  document.body.classList.add('keyboard-navigation');
              }
          });

          document.addEventListener('mousedown', () => {
              document.body.classList.remove('keyboard-navigation');
          });

          // Error handling
          window.addEventListener('error', (e) => {
              console.error('JavaScript error:', e.error);
              ${analyticsEnabled ? "trackEvent('javascript_error', { message: e.error.message });" : ''}
          });

          console.log('Portfolio loaded successfully! ✨');
          console.log('Features enabled:', {
              darkMode: true,
              pwa: ${pwaEnabled},
              analytics: ${analyticsEnabled},
              responsive: true,
              accessibility: true
          });
      </script>
    `;
  }
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export const exportUtils = {
  downloadHTML: (portfolioData, filename = null) => {
    try {
      // Validate data before export
      const validation = validationUtils.validatePortfolioData(portfolioData);
      if (!validation.isValid) {
        throw new Error('Portfolio data validation failed: ' + validation.errors.join(', '));
      }

      const htmlContent = htmlGenerator.generateCompleteHTML(portfolioData);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${portfolioData.personalInfo.name || 'portfolio'}.html`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting HTML:', error);
      return { success: false, error: error.message };
    }
  },

  downloadJSON: (portfolioData, filename = null) => {
    try {
      const jsonContent = JSON.stringify(portfolioData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${portfolioData.personalInfo.name || 'portfolio'}-data.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting JSON:', error);
      return { success: false, error: error.message };
    }
  },

  generateServiceWorker: (portfolioData) => {
    const cacheName = `portfolio-${portfolioData.personalInfo.name || 'default'}-v1`;
    
    return `
// Service Worker for ${portfolioData.personalInfo.name || 'Portfolio'}
const CACHE_NAME = '${cacheName}';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .catch(() => {
                        // Fallback for offline
                        if (event.request.destination === 'document') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
    `;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const utils = {
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  formatDate: (date, locale = 'es-ES') => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    } catch {
      return date;
    }
  },

  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return { success: true };
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return { success };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  showNotification: (message, type = 'info', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-0 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-lg font-bold opacity-70 hover:opacity-100">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  }
};

// ============================================================================
// DARK MODE UTILITIES
// ============================================================================

export const darkModeUtils = {
  initialize: () => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedMode ? savedMode === 'true' : prefersDark;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    return isDark;
  },

  toggle: () => {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
    
    return !isDark;
  },

  set: (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  },

  get: () => {
    return document.documentElement.classList.contains('dark');
  }
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default {
  storage: storageUtils,
  validation: validationUtils,
  github: githubUtils,
  html: htmlGenerator,
  export: exportUtils,
  darkMode: darkModeUtils,
  utils
};