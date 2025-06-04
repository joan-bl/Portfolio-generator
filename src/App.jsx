import React, { useState, useEffect } from 'react';
import { 
  Camera, Code, Palette, Globe, Download, Eye, Settings, Plus, X, 
  Edit3, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, 
  Instagram, Twitter, Upload, Sparkles, Layout, Zap, Heart,
  Moon, Sun, Users, Clock, TrendingUp, Calendar, FileText,
  Video, MessageCircle, Briefcase, Award, BarChart3,
  Wifi, WifiOff, Monitor, Smartphone, Tablet
} from 'lucide-react';

// Estado inicial del portafolio
const initialPortfolioData = {
  personalInfo: {
    name: '',
    title: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    avatar: null,
    videoBackground: ''
  },
  projects: [],
  skills: [],
  experience: [],
  testimonials: [],
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
    layout: 'grid',
    darkMode: false
  },
  analytics: {
    enabled: false,
    trackingId: ''
  },
  pwa: {
    enabled: true,
    name: 'Mi Portafolio',
    shortName: 'Portfolio'
  }
};

// Configuraciones y constantes
const themes = [
  { name: 'Minimal', id: 'minimal', colors: ['#000000', '#ffffff'], preview: 'Clean & Simple' },
  { name: 'Creative', id: 'creative', colors: ['#ff6b6b', '#4ecdc4'], preview: 'Bold & Artistic' },
  { name: 'Tech', id: 'tech', colors: ['#0f172a', '#3b82f6'], preview: 'Modern & Professional' },
  { name: 'Warm', id: 'warm', colors: ['#f59e0b', '#ef4444'], preview: 'Friendly & Inviting' },
  { name: 'Nature', id: 'nature', colors: ['#059669', '#84cc16'], preview: 'Fresh & Organic' },
  { name: 'Elegant', id: 'elegant', colors: ['#7c3aed', '#ec4899'], preview: 'Sophisticated & Luxury' },
  { name: 'Dark', id: 'dark', colors: ['#1f2937', '#6366f1'], preview: 'Sleek & Modern' }
];

const layouts = [
  { name: 'Grid', id: 'grid', icon: Layout, description: 'Clásico y organizado' },
  { name: 'Bento', id: 'bento', icon: Zap, description: 'Modular y dinámico' },
  { name: 'Masonry', id: 'masonry', icon: Sparkles, description: 'Fluido y creativo' }
];

const projectCategories = [
  'Web Development', 'Mobile Apps', 'UI/UX Design', 'Graphic Design', 
  'Photography', 'Illustration', 'Branding', 'Digital Art', 'Animation', 
  'Video Production', 'Writing', 'Marketing', 'Data Analysis', 'Other'
];

// Project Modal Component
const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState(project || {
    title: '',
    description: '',
    category: 'Web Development',
    tags: [],
    images: [],
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {project?.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Proyecto
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Mi Proyecto Increíble"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {projectCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24 resize-none"
              placeholder="Describe tu proyecto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags/Tecnologías
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="w-3 h-3 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center hover:bg-indigo-300 dark:hover:bg-indigo-700"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Añadir tag y presionar Enter"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Demo/Live
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://mi-proyecto.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL GitHub
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://github.com/usuario/proyecto"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Proyecto destacado
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Guardar Proyecto
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Experience Modal Component
const ExperienceModal = ({ experience, onSave, onClose }) => {
  const [formData, setFormData] = useState(experience || {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {experience?.id ? 'Editar Experiencia' : 'Nueva Experiencia'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empresa
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nombre de la empresa"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posición
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tu cargo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Fin
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={formData.current}
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Trabajo actual</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24 resize-none"
              placeholder="Describe tus responsabilidades y logros..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Guardar Experiencia
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Testimonial Modal Component
const TestimonialModal = ({ testimonial, onSave, onClose }) => {
  const [formData, setFormData] = useState(testimonial || {
    name: '',
    position: '',
    company: '',
    content: '',
    avatar: '',
    rating: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {testimonial?.id ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cargo
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="CEO, Director, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Empresa
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nombre de la empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Testimonio
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 resize-none"
              placeholder="¿Qué opina este cliente sobre tu trabajo?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Guardar Testimonio
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Funciones auxiliares y utilidades

// Función para generar contenido con IA (simulada)
const generateAIContent = (type, userInput, setIsGenerating) => {
  setIsGenerating(true);
  setTimeout(() => {
    setIsGenerating(false);
  }, 1500);
};

// Función para obtener repositorios de GitHub
const fetchGithubRepos = async (username) => {
  if (!username) return [];
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const repos = await response.json();
    
    if (Array.isArray(repos)) {
      const formattedRepos = repos.map(repo => ({
        id: repo.id,
        title: repo.name,
        description: repo.description || 'No description available',
        category: repo.language || 'Code',
        tags: repo.topics || [],
        liveUrl: repo.homepage || '',
        githubUrl: repo.html_url,
        featured: repo.stargazers_count > 5,
        stars: repo.stargazers_count,
        language: repo.language
      }));
      return formattedRepos;
    }
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
  }
  return [];
};

// Función para importar proyectos de GitHub
const importGithubProjects = (githubRepos, portfolioData, setPortfolioData, setGithubRepos) => {
  const githubUsername = portfolioData.socialLinks.github.split('/').pop();
  if (githubUsername && githubRepos.length > 0) {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, ...githubRepos]
    }));
    setGithubRepos([]);
  }
};

// Función para toggle del modo oscuro
const toggleDarkMode = (darkMode, setDarkMode, setPortfolioData) => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  localStorage.setItem('darkMode', newDarkMode.toString());
  
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  setPortfolioData(prev => ({
    ...prev,
    theme: { ...prev.theme, darkMode: newDarkMode }
  }));
};

// Hooks personalizados para efectos
const usePortfolioEffects = (setDarkMode, setIsOnline, setPortfolioData, portfolioData) => {
  // Dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [setDarkMode]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }, 2000);
    return () => clearTimeout(timer);
  }, [portfolioData]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setPortfolioData(prev => ({ ...prev, ...parsedData }));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, [setPortfolioData]);
};

// Función para generar el HTML completo del portafolio
const generatePortfolioHTML = (portfolioData, themes) => {
  const theme = themes.find(t => t.id === portfolioData.theme.style) || themes[0];
  const isDarkTheme = portfolioData.theme.style === 'dark' || portfolioData.theme.darkMode;
  
  // Función auxiliar para generar iconos SVG
  const getSVGIcon = (iconName) => {
    const icons = {
      github: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
      linkedin: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
      instagram: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm4.624 12.47c0 2.963-2.4 5.364-5.364 5.364s-5.364-2.401-5.364-5.364 2.4-5.364 5.364-5.364 5.364 2.401 5.364 5.364zm-2.268 0c0-1.71-1.387-3.096-3.096-3.096s-3.096 1.387-3.096 3.096 1.387 3.096 3.096 3.096 3.096-1.387 3.096-3.096z"/></svg>',
      twitter: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
    };
    return icons[iconName] || '';
  };

  // Generar el manifest para PWA
  const generateManifest = () => {
    if (!portfolioData.pwa.enabled) return '';
    
    const manifest = {
      name: portfolioData.pwa.name,
      short_name: portfolioData.pwa.shortName,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: portfolioData.theme.primaryColor,
      icons: [
        {
          src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiM2MzY2ZjEiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CjxwYXRoIGQ9Im0xMiA4IDYgMyAtNiAzIDYgM1oiLz4KPC9zdmc+Cjwvc3ZnPgo=",
          sizes: "192x192",
          type: "image/svg+xml"
        }
      ]
    };
    
    return btoa(JSON.stringify(manifest));
  };

  // Template HTML principal
  const htmlTemplate = '<!DOCTYPE html>' +
    '<html lang="es" class="' + (isDarkTheme ? 'dark' : '') + '">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>' + (portfolioData.personalInfo.name || 'Portfolio') + ' - ' + (portfolioData.personalInfo.title || 'Profesional') + '</title>' +
    '<meta name="description" content="' + (portfolioData.personalInfo.bio || 'Portfolio profesional de ' + (portfolioData.personalInfo.name || 'un profesional')) + '">' +
    '<meta name="keywords" content="' + portfolioData.skills.join(', ') + '">' +
    '<meta name="author" content="' + (portfolioData.personalInfo.name || '') + '">' +
    
    '<!-- Open Graph / Facebook -->' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:url" content="https://tu-dominio.com/">' +
    '<meta property="og:title" content="' + (portfolioData.personalInfo.name || '') + ' - ' + (portfolioData.personalInfo.title || '') + '">' +
    '<meta property="og:description" content="' + (portfolioData.personalInfo.bio || 'Portfolio profesional') + '">' +
    
    '<!-- Twitter -->' +
    '<meta property="twitter:card" content="summary_large_image">' +
    '<meta property="twitter:url" content="https://tu-dominio.com/">' +
    '<meta property="twitter:title" content="' + (portfolioData.personalInfo.name || '') + ' - ' + (portfolioData.personalInfo.title || '') + '">' +
    '<meta property="twitter:description" content="' + (portfolioData.personalInfo.bio || 'Portfolio profesional') + '">' +
    
    '<!-- Tailwind CSS -->' +
    '<script src="https://cdn.tailwindcss.com"></script>' +
    '<script>' +
    'tailwind.config = {' +
    'darkMode: "class",' +
    'theme: {' +
    'extend: {' +
    'colors: {' +
    'primary: "' + portfolioData.theme.primaryColor + '",' +
    'secondary: "' + portfolioData.theme.secondaryColor + '"' +
    '}' +
    '}' +
    '}' +
    '}' +
    '</script>' +
    
    (portfolioData.pwa.enabled ? 
      '<link rel="manifest" href="data:application/json;base64,' + generateManifest() + '">' : '') +
    
    (portfolioData.analytics.enabled && portfolioData.analytics.trackingId ? 
      '<script async src="https://www.googletagmanager.com/gtag/js?id=' + portfolioData.analytics.trackingId + '"></script>' +
      '<script>' +
      'window.dataLayer = window.dataLayer || [];' +
      'function gtag(){dataLayer.push(arguments);}' +
      'gtag("js", new Date());' +
      'gtag("config", "' + portfolioData.analytics.trackingId + '");' +
      '</script>' : '') +
    
    '<style>' +
    '@keyframes fade-in {' +
    'from { opacity: 0; transform: translateY(20px); }' +
    'to { opacity: 1; transform: translateY(0); }' +
    '}' +
    '.animate-fade-in { animation: fade-in 0.6s ease-out; }' +
    '.line-clamp-3 {' +
    'display: -webkit-box;' +
    '-webkit-line-clamp: 3;' +
    '-webkit-box-orient: vertical;' +
    'overflow: hidden;' +
    '}' +
    '.dark body {' +
    'background-color: #111827;' +
    'color: #f9fafb;' +
    '}' +
    '</style>' +
    '</head>';

  return htmlTemplate + generateBodyContent();

  function generateBodyContent() {
    return '<body class="' + (isDarkTheme ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900') + '">' +
      generateDarkModeToggle() +
      generatePortfolioContent() +
      generateJavaScript() +
      '</body>' +
      '</html>';
  }

  function generateDarkModeToggle() {
    return '<!-- Dark Mode Toggle -->' +
      '<button id="darkModeToggle" class="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">' +
      '<svg id="sunIcon" class="w-5 h-5 ' + (isDarkTheme ? 'hidden' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>' +
      '</svg>' +
      '<svg id="moonIcon" class="w-5 h-5 ' + (isDarkTheme ? '' : 'hidden') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>' +
      '</svg>' +
      '</button>';
  }

  function generatePortfolioContent() {
    return '<!-- Portfolio Content -->' +
      '<div class="min-h-screen ' + (isDarkTheme ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50') + '">' +
      generateHeroSection() +
      generateSkillsSection() +
      generateExperienceSection() +
      generateProjectsSection() +
      generateTestimonialsSection() +
      generateContactSection() +
      '</div>';
  }

  function generateHeroSection() {
    const avatarContent = portfolioData.personalInfo.avatar ? 
      '<img src="' + portfolioData.personalInfo.avatar + '" alt="Avatar" class="w-32 h-32 rounded-full mx-auto shadow-lg object-cover">' :
      '<div class="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">' +
      '<span class="text-white text-4xl font-bold">' + (portfolioData.personalInfo.name.charAt(0) || 'P') + '</span>' +
      '</div>';

    const socialLinks = Object.entries(portfolioData.socialLinks)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const colorMap = {
          github: isDarkTheme ? 'text-gray-300' : 'text-gray-700',
          linkedin: 'text-blue-600',
          instagram: 'text-pink-600',
          twitter: 'text-blue-400'
        };
        
        return '<a href="' + value + '" target="_blank" rel="noopener noreferrer" class="p-3 ' + 
               (isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50') + 
               ' rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">' +
               '<span class="' + colorMap[key] + '">' + getSVGIcon(key) + '</span>' +
               '</a>';
      }).join('');

    return '<!-- Hero Section -->' +
      '<div class="relative overflow-hidden">' +
      (portfolioData.personalInfo.videoBackground ? 
        '<video autoplay muted loop class="absolute inset-0 w-full h-full object-cover opacity-20">' +
        '<source src="' + portfolioData.personalInfo.videoBackground + '" type="video/mp4">' +
        '</video>' : '') +
      '<div class="absolute inset-0 ' + (isDarkTheme ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90' : 'bg-gradient-to-br from-indigo-50/90 via-white/90 to-purple-50/90') + '"></div>' +
      '<div class="relative container mx-auto px-6 py-20">' +
      '<div class="max-w-4xl mx-auto text-center">' +
      '<div class="mb-8">' + avatarContent + '</div>' +
      '<h1 class="text-5xl md:text-6xl font-bold ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + ' mb-4 animate-fade-in">' +
      (portfolioData.personalInfo.name || 'Tu Nombre') +
      '</h1>' +
      '<p class="text-xl md:text-2xl ' + (isDarkTheme ? 'text-gray-300' : 'text-gray-600') + ' mb-6 font-light">' +
      (portfolioData.personalInfo.title || 'Tu Título Profesional') +
      '</p>' +
      '<p class="text-lg ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-700') + ' max-w-2xl mx-auto mb-8 leading-relaxed">' +
      (portfolioData.personalInfo.bio || 'Tu biografía aparecerá aquí.') +
      '</p>' +
      '<div class="flex justify-center gap-4 mb-8">' + socialLinks + '</div>' +
      generateContactInfo() +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function generateContactInfo() {
    const contactItems = [];
    
    if (portfolioData.personalInfo.location) {
      contactItems.push(
        '<div class="flex items-center gap-1">' +
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>' +
        '</svg>' +
        portfolioData.personalInfo.location +
        '</div>'
      );
    }
    
    if (portfolioData.personalInfo.email) {
      contactItems.push(
        '<div class="flex items-center gap-1">' +
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>' +
        '</svg>' +
        portfolioData.personalInfo.email +
        '</div>'
      );
    }

    return contactItems.length > 0 ? 
      '<div class="flex flex-wrap justify-center gap-4 text-sm ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-600') + '">' +
      contactItems.join('') +
      '</div>' : '';
  }

  function generateSkillsSection() {
    if (portfolioData.skills.length === 0) return '';
    
    const skillsHtml = portfolioData.skills.map(skill => 
      '<span class="px-4 py-2 ' + (isDarkTheme ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700') + 
      ' rounded-full shadow-sm font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105" style="border-left: 4px solid ' + 
      portfolioData.theme.primaryColor + '">' +
      skill +
      '</span>'
    ).join('');

    return '<!-- Skills Section -->' +
      '<div class="py-20 ' + (isDarkTheme ? 'bg-gray-800' : 'bg-gray-50') + '">' +
      '<div class="container mx-auto px-6">' +
      '<h2 class="text-3xl font-bold text-center ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + ' mb-12">' +
      'Habilidades & Tecnologías' +
      '</h2>' +
      '<div class="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">' +
      skillsHtml +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function generateExperienceSection() {
    if (portfolioData.experience.length === 0) return '';
    
    const experienceHtml = portfolioData.experience.map((exp, index) => 
      '<div class="relative pl-8 pb-12 ' + (index === portfolioData.experience.length - 1 ? '' : 'border-l border-gray-200 dark:border-gray-700') + '">' +
      '<div class="absolute left-0 top-0 w-4 h-4 bg-indigo-600 rounded-full transform -translate-x-2"></div>' +
      '<div class="' + (isDarkTheme ? 'bg-gray-800' : 'bg-white') + ' rounded-lg p-6 shadow-lg ml-6">' +
      '<div class="flex justify-between items-start mb-2">' +
      '<h3 class="text-xl font-bold ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + '">' +
      exp.position +
      '</h3>' +
      '<span class="text-sm ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-600') + '">' +
      exp.startDate + ' - ' + (exp.current ? 'Presente' : exp.endDate) +
      '</span>' +
      '</div>' +
      '<p class="text-indigo-600 dark:text-indigo-400 font-medium mb-3">' +
      exp.company +
      '</p>' +
      (exp.description ? 
        '<p class="' + (isDarkTheme ? 'text-gray-300' : 'text-gray-600') + ' leading-relaxed">' +
        exp.description +
        '</p>' : '') +
      '</div>' +
      '</div>'
    ).join('');

    return '<!-- Experience Section -->' +
      '<div class="py-20">' +
      '<div class="container mx-auto px-6">' +
      '<h2 class="text-3xl font-bold text-center ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + ' mb-16">' +
      'Experiencia Profesional' +
      '</h2>' +
      '<div class="max-w-4xl mx-auto">' +
      experienceHtml +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function generateProjectsSection() {
    const emptyState = '<div class="text-center py-12">' +
      '<div class="w-24 h-24 ' + (isDarkTheme ? 'bg-gray-700' : 'bg-gray-100') + ' rounded-full flex items-center justify-center mx-auto mb-4">' +
      '<span class="' + (isDarkTheme ? 'text-gray-500' : 'text-gray-400') + ' text-3xl">🎨</span>' +
      '</div>' +
      '<p class="text-lg ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-500') + '">' +
      'Proyectos próximamente' +
      '</p>' +
      '</div>';

    const projectsHtml = portfolioData.projects.length === 0 ? emptyState :
      '<div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">' +
      portfolioData.projects.map((project, index) => 
        '<div class="group ' + (isDarkTheme ? 'bg-gray-700' : 'bg-white') + ' rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 ' + (project.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : '') + '">' +
        '<div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden">' +
        '<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>' +
        '<div class="absolute inset-0 flex items-center justify-center">' +
        '<div class="text-center ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-600') + '">' +
        '<div class="text-4xl mb-2 opacity-50">🎨</div>' +
        '<p class="text-sm">Vista previa del proyecto</p>' +
        '</div>' +
        '</div>' +
        (project.featured ? 
          '<div class="absolute top-4 right-4">' +
          '<div class="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">' +
          '❤️ Destacado' +
          '</div>' +
          '</div>' : '') +
        '</div>' +
        '<div class="p-6">' +
        '<div class="flex items-center justify-between mb-2">' +
        '<h3 class="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + '">' +
        project.title +
        '</h3>' +
        '<span class="text-xs ' + (isDarkTheme ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600') + ' px-2 py-1 rounded-full">' +
        project.category +
        '</span>' +
        '</div>' +
        '<p class="' + (isDarkTheme ? 'text-gray-300' : 'text-gray-600') + ' mb-4 leading-relaxed">' +
        project.description +
        '</p>' +
        (project.tags && project.tags.length > 0 ? 
          '<div class="flex flex-wrap gap-2 mb-4">' +
          project.tags.slice(0, 3).map(tag => 
            '<span class="text-xs ' + (isDarkTheme ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-700') + ' px-2 py-1 rounded-full font-medium">' +
            tag +
            '</span>'
          ).join('') +
          (project.tags.length > 3 ? 
            '<span class="text-xs ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-500') + ' px-2 py-1">' +
            '+' + (project.tags.length - 3) + ' más' +
            '</span>' : '') +
          '</div>' : '') +
        '<div class="flex gap-3">' +
        (project.liveUrl ? 
          '<a href="' + project.liveUrl + '" target="_blank" rel="noopener noreferrer" ' +
          'class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2 text-sm">' +
          '🔗 Ver Demo' +
          '</a>' : '') +
        (project.githubUrl ? 
          '<a href="' + project.githubUrl + '" target="_blank" rel="noopener noreferrer"' +
          ' class="px-4 py-2 border ' + (isDarkTheme ? 'border-gray-600 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50') + ' rounded-lg transition-all duration-300 flex items-center justify-center">' +
          'GitHub' +
          '</a>' : '') +
        '</div>' +
        '</div>' +
        '</div>'
      ).join('') +
      '</div>';

    return '<!-- Projects Section -->' +
      '<div class="py-20 ' + (isDarkTheme ? 'bg-gray-800' : 'bg-white') + '">' +
      '<div class="container mx-auto px-6">' +
      '<h2 class="text-3xl font-bold text-center ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + ' mb-16">' +
      'Proyectos Destacados' +
      '</h2>' +
      projectsHtml +
      '</div>' +
      '</div>';
  }

  function generateTestimonialsSection() {
    if (portfolioData.testimonials.length === 0) return '';
    
    const testimonialsHtml = portfolioData.testimonials.map((testimonial, index) => 
      '<div class="' + (isDarkTheme ? 'bg-gray-800' : 'bg-white') + ' rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">' +
      '<div class="flex gap-1 mb-4">' +
      Array.from({length: 5}, (_, i) => 
        '<span class="text-lg ' + (i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600') + '">' +
        '⭐' +
        '</span>'
      ).join('') +
      '</div>' +
      '<p class="' + (isDarkTheme ? 'text-gray-300' : 'text-gray-600') + ' mb-4 italic">' +
      '"' + testimonial.content + '"' +
      '</p>' +
      '<div class="flex items-center gap-3">' +
      '<div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">' +
      '<span class="text-white font-bold text-sm">' +
      (testimonial.name?.charAt(0) || 'T') +
      '</span>' +
      '</div>' +
      '<div>' +
      '<h4 class="font-semibold ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + '">' +
      testimonial.name +
      '</h4>' +
      '<p class="text-sm ' + (isDarkTheme ? 'text-gray-400' : 'text-gray-600') + '">' +
      testimonial.position + (testimonial.company ? ' at ' + testimonial.company : '') +
      '</p>' +
      '</div>' +
      '</div>' +
      '</div>'
    ).join('');

    return '<!-- Testimonials Section -->' +
      '<div class="py-20">' +
      '<div class="container mx-auto px-6">' +
      '<h2 class="text-3xl font-bold text-center ' + (isDarkTheme ? 'text-white' : 'text-gray-900') + ' mb-16">' +
      'Lo que dicen mis clientes' +
      '</h2>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">' +
      testimonialsHtml +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function generateContactSection() {
    const contactButtons = [];
    
    if (portfolioData.personalInfo.email) {
      contactButtons.push(
        '<a href="mailto:' + portfolioData.personalInfo.email + '" ' +
        'class="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">' +
        '📧 Enviar Email' +
        '</a>'
      );
    }
    
    if (portfolioData.personalInfo.phone) {
      contactButtons.push(
        '<a href="tel:' + portfolioData.personalInfo.phone + '"' +
        ' class="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2">' +
        '📞 Llamar' +
        '</a>'
      );
    }

    return '<!-- Contact Section -->' +
      '<div class="py-20 bg-gray-900 text-white">' +
      '<div class="container mx-auto px-6 text-center">' +
      '<h2 class="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>' +
      '<p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">' +
      'Estoy siempre abierto a nuevas oportunidades y colaboraciones interesantes.' +
      '</p>' +
      '<div class="flex flex-wrap justify-center gap-6">' +
      contactButtons.join('') +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function generateJavaScript() {
    return '<!-- JavaScript for Dark Mode Toggle and PWA -->' +
      '<script>' +
      'const darkModeToggle = document.getElementById("darkModeToggle");' +
      'const sunIcon = document.getElementById("sunIcon");' +
      'const moonIcon = document.getElementById("moonIcon");' +
      'const html = document.documentElement;' +
      
      'let isDark = ' + (isDarkTheme ? 'true' : 'localStorage.getItem("darkMode") === "true"') + ';' +
      
      'function updateDarkMode() {' +
      'if (isDark) {' +
      'html.classList.add("dark");' +
      'if (sunIcon) sunIcon.classList.remove("hidden");' +
      'if (moonIcon) moonIcon.classList.add("hidden");' +
      '} else {' +
      'html.classList.remove("dark");' +
      'if (sunIcon) sunIcon.classList.add("hidden");' +
      'if (moonIcon) moonIcon.classList.remove("hidden");' +
      '}' +
      'localStorage.setItem("darkMode", isDark.toString());' +
      '}' +
      
      'if (darkModeToggle) {' +
      'darkModeToggle.addEventListener("click", () => {' +
      'isDark = !isDark;' +
      'updateDarkMode();' +
      '});' +
      '}' +
      
      'updateDarkMode();' +
      
      (portfolioData.pwa.enabled ? 
        'if ("serviceWorker" in navigator) {' +
        'window.addEventListener("load", () => {' +
        'navigator.serviceWorker.register("data:text/javascript;base64," + btoa(`' +
        'const CACHE_NAME = "portfolio-v1";' +
        'const urlsToCache = ["/", "https://cdn.tailwindcss.com"];' +
        'self.addEventListener("install", event => {' +
        'event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));' +
        '});' +
        'self.addEventListener("fetch", event => {' +
        'event.respondWith(caches.match(event.request).then(response => {' +
        'if (response) return response;' +
        'return fetch(event.request);' +
        '}));' +
        '});' +
        '`))' +
        '.then(registration => console.log("SW registered: ", registration))' +
        '.catch(registrationError => console.log("SW registration failed: ", registrationError));' +
        '});' +
        '}' : '') +
      
      (portfolioData.analytics.enabled && portfolioData.analytics.trackingId ? 
        'function trackEvent(eventName, parameters = {}) {' +
        'if (typeof gtag !== "undefined") {' +
        'gtag("event", eventName, parameters);' +
        '}' +
        '}' +
        'document.querySelectorAll("a[href^=\\"mailto:\\"]").forEach(link => {' +
        'link.addEventListener("click", () => trackEvent("contact_email_click"));' +
        '});' +
        'document.querySelectorAll("a[href^=\\"tel:\\"]").forEach(link => {' +
        'link.addEventListener("click", () => trackEvent("contact_phone_click"));' +
        '});' +
        'document.querySelectorAll("a[target=\\"_blank\\"]").forEach(link => {' +
        'link.addEventListener("click", () => trackEvent("external_link_click", {url: link.href}));' +
        '});' : '') +
      
      'window.addEventListener("load", () => {' +
      'const perfData = performance.getEntriesByType("navigation")[0];' +
      'if (perfData) {' +
      'console.log("Page Load Time:", perfData.loadEventEnd - perfData.fetchStart, "ms");' +
      '}' +
      '});' +
      
      'const observerOptions = {threshold: 0.1, rootMargin: "0px 0px -50px 0px"};' +
      'const observer = new IntersectionObserver((entries) => {' +
      'entries.forEach(entry => {' +
      'if (entry.isIntersecting) {' +
      'entry.target.classList.add("animate-fade-in");' +
      '}' +
      '});' +
      '}, observerOptions);' +
      
      'document.querySelectorAll("section, .container > div").forEach(el => observer.observe(el));' +
      
      'document.querySelectorAll("img").forEach(img => {' +
      'img.addEventListener("load", () => img.classList.add("loaded"));' +
      '});' +
      
      'console.log("Portfolio loaded successfully! ✨");' +
      '</script>' +
      
      '<!-- Additional CSS for enhanced features -->' +
      '<style>' +
      'img { opacity: 0; transition: opacity 0.3s ease; }' +
      'img.loaded { opacity: 1; }' +
      'a, button { transition: all 0.3s ease; }' +
      '.group:hover { transform: translateY(-4px); }' +
      '@media print {' +
      '.fixed, #darkModeToggle { display: none !important; }' +
      'body { background: white !important; color: black !important; }' +
      '}' +
      '@media (prefers-contrast: high) { body { filter: contrast(1.2); } }' +
      '@media (prefers-reduced-motion: reduce) {' +
      '*, *::before, *::after {' +
      'animation-duration: 0.01ms !important;' +
      'transition-duration: 0.01ms !important;' +
      '}' +
      '}' +
      '::-webkit-scrollbar { width: 8px; }' +
      '::-webkit-scrollbar-track { background: ' + (isDarkTheme ? '#374151' : '#f1f5f9') + '; }' +
      '::-webkit-scrollbar-thumb { background: ' + portfolioData.theme.primaryColor + '; border-radius: 4px; }' +
      '::-webkit-scrollbar-thumb:hover { background: ' + portfolioData.theme.secondaryColor + '; }' +
      '</style>';
  }
};


// Enhanced Portfolio Preview Component
const PortfolioPreview = ({ portfolioData, darkMode, themes }) => {
  const theme = themes.find(t => t.id === portfolioData.theme.style) || themes[0];
  const isMinimal = portfolioData.theme.style === 'minimal';
  const isDarkTheme = portfolioData.theme.style === 'dark' || darkMode;
  const isBento = portfolioData.theme.layout === 'bento';
  
  const bgClasses = isDarkTheme 
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    : isMinimal 
      ? 'min-h-screen bg-white text-gray-900'
      : 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';
  
  return (
    <div className={bgClasses}>
      {/* Header/Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        {portfolioData.personalInfo.videoBackground && (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source src={portfolioData.personalInfo.videoBackground} type="video/mp4" />
          </video>
        )}
        
        <div className={`absolute inset-0 ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90'
            : 'bg-gradient-to-br from-indigo-50/90 via-white/90 to-purple-50/90'
        }`}></div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              {portfolioData.personalInfo.avatar ? (
                <img 
                  src={portfolioData.personalInfo.avatar} 
                  alt="Avatar"
                  className="w-32 h-32 rounded-full mx-auto shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl font-bold">
                    {portfolioData.personalInfo.name.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>
            
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 animate-fade-in ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {portfolioData.personalInfo.name || 'Tu Nombre'}
            </h1>
            
            <p className={`text-xl md:text-2xl mb-6 font-light ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {portfolioData.personalInfo.title || 'Tu Título Profesional'}
            </p>
            
            <p className={`text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {portfolioData.personalInfo.bio || 'Tu biografía aparecerá aquí. Cuenta tu historia profesional.'}
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {Object.entries(portfolioData.socialLinks)
                .filter(([key, value]) => value)
                .map(([key, value]) => {
                  const iconMap = {
                    github: Github,
                    linkedin: Linkedin,
                    instagram: Instagram,
                    twitter: Twitter
                  };
                  const Icon = iconMap[key];
                  const colorMap = {
                    github: isDarkTheme ? 'text-gray-300' : 'text-gray-700',
                    linkedin: 'text-blue-600',
                    instagram: 'text-pink-600',
                    twitter: 'text-blue-400'
                  };
                  
                  return (
                    <a 
                      key={key}
                      href={value} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 ${
                        isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      } rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110`}
                    >
                      <Icon className={`w-5 h-5 ${colorMap[key]}`} />
                    </a>
                  );
                })}
            </div>

            <div className={`flex flex-wrap justify-center gap-4 text-sm ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {portfolioData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {portfolioData.personalInfo.location}
                </div>
              )}
              {portfolioData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {portfolioData.personalInfo.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {portfolioData.skills.length > 0 && (
        <div className={`py-20 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-12 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              Habilidades & Tecnologías
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {portfolioData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 ${
                    isDarkTheme ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700'
                  } rounded-full shadow-sm font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105`}
                  style={{ 
                    borderLeft: `4px solid ${portfolioData.theme.primaryColor}` 
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {portfolioData.experience.length > 0 && (
        <div className="py-20">
          <div className="container mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-16 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              Experiencia Profesional
            </h2>
            <div className="max-w-4xl mx-auto">
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className={`relative pl-8 pb-12 ${index === portfolioData.experience.length - 1 ? '' : 'border-l border-gray-200 dark:border-gray-700'}`}>
                  <div className="absolute left-0 top-0 w-4 h-4 bg-indigo-600 rounded-full transform -translate-x-2"></div>
                  
                  <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg ml-6`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {exp.position}
                      </h3>
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className={`py-20 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-16 ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>
            Proyectos Destacados
          </h2>
          
          {portfolioData.projects.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-24 h-24 ${
                isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'
              } rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Palette className={`w-12 h-12 ${
                  isDarkTheme ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <p className={`text-lg ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Aún no has añadido proyectos. ¡Añade algunos para verlos aquí!
              </p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              isBento 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr' 
                : portfolioData.theme.layout === 'masonry'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {portfolioData.projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group ${
                    isDarkTheme ? 'bg-gray-700' : 'bg-white'
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 ${
                    isBento && index % 3 === 0 ? 'md:col-span-2 md:row-span-1' : ''
                  } ${project.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-center ${
                        isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Vista previa del proyecto</p>
                      </div>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Destacado
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkTheme ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.category}
                      </span>
                    </div>
                    
                    <p className={`mb-4 leading-relaxed ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {project.description}
                    </p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              isDarkTheme 
                                ? 'bg-indigo-900 text-indigo-300' 
                                : 'bg-indigo-50 text-indigo-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className={`text-xs px-2 py-1 ${
                            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            +{project.tags.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 border rounded-lg transition-all duration-300 flex items-center justify-center ${
                            isDarkTheme 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      {portfolioData.testimonials.length > 0 && (
        <div className="py-20">
          <div className="container mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-16 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              Lo que dicen mis clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {portfolioData.testimonials.map((testimonial, index) => (
                <div key={index} className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  
                  <p className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4 italic`}>
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className={`py-20 ${
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-900'
      } text-white`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Estoy siempre abierto a nuevas oportunidades y colaboraciones interesantes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {portfolioData.personalInfo.email && (
              <a
                href={`mailto:${portfolioData.personalInfo.email}`}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Enviar Email
              </a>
            )}
            {portfolioData.personalInfo.phone && (
              <a
                href={`tel:${portfolioData.personalInfo.phone}`}
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Llamar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal del Generador de Portafolios
const PortfolioGenerator = () => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState('setup');
  const [darkMode, setDarkMode] = useState(false);
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Aplicar efectos personalizados
  usePortfolioEffects(setDarkMode, setIsOnline, setPortfolioData, portfolioData);

  // Funciones de manejo
  const handleToggleDarkMode = () => {
    toggleDarkMode(darkMode, setDarkMode, setPortfolioData);
  };

  const handleFetchGithubRepos = async (username) => {
    const repos = await fetchGithubRepos(username);
    setGithubRepos(repos);
  };

  const handleImportGithubProjects = () => {
    importGithubProjects(githubRepos, portfolioData, setPortfolioData, setGithubRepos);
  };

  // Función para generar y descargar HTML
  const handleDownloadHTML = () => {
    const htmlContent = generatePortfolioHTML(portfolioData, themes);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.personalInfo.name || 'portfolio'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clases base del componente
  const baseClasses = darkMode 
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900";

  // Modo preview
  if (previewMode) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-40 px-6 py-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vista Previa del Portafolio</h1>
            
            {/* Device Preview Selector */}
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPreviewDevice(id)}
                    className={`p-2 rounded-lg transition-colors ${
                      previewDevice === id 
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={handleToggleDarkMode}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleDownloadHTML}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20">
          <div className={`mx-auto transition-all duration-300 ${
            previewDevice === 'mobile' ? 'max-w-sm' :
            previewDevice === 'tablet' ? 'max-w-3xl' :
            'max-w-full'
          }`}>
            <PortfolioPreview 
              portfolioData={portfolioData} 
              darkMode={darkMode} 
              themes={themes} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Componente principal
  return (
    <div className={baseClasses}>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header con Dark Mode Toggle */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {!isOnline && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                  <WifiOff className="w-4 h-4" />
                  Modo Offline
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleDarkMode}
                className="p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Generador de Portafolios 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> IA</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Crea un portafolio profesional e interactivo en minutos. Con IA, plantillas modernas y exportación lista para usar.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg flex gap-2 overflow-x-auto">
            {[
              { id: 'setup', label: 'Información', icon: Settings },
              { id: 'projects', label: 'Proyectos', icon: Code },
              { id: 'experience', label: 'Experiencia', icon: Briefcase },
              { id: 'testimonials', label: 'Testimonios', icon: MessageCircle },
              { id: 'design', label: 'Diseño', icon: Palette },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'preview', label: 'Vista Previa', icon: Eye }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentStep(id)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  currentStep === id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {renderCurrentStep()}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex justify-center items-center gap-4 mb-2">
            <span>Creado con ❤️ usando las últimas tendencias de diseño web 2025</span>
            {!isOnline && (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <WifiOff className="w-4 h-4" />
                <span>Trabajando offline</span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2 text-xs">
            <span>• Modo Oscuro Habilitado</span>
            <span>• Auto-guardado Activo</span>
            <span>• PWA Ready</span>
            <span>• GitHub Integration</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderModals()}
    </div>
  );

  // Función para renderizar el paso actual
  function renderCurrentStep() {
    switch (currentStep) {
      case 'setup':
        return renderSetupStep();
      case 'projects':
        return renderProjectsStep();
      case 'experience':
        return renderExperienceStep();
      case 'testimonials':
        return renderTestimonialsStep();
      case 'design':
        return renderDesignStep();
      case 'analytics':
        return renderAnalyticsStep();
      case 'preview':
        return renderPreviewStep();
      default:
        return renderSetupStep();
    }
  }

  // Setup Step
  function renderSetupStep() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Información Personal</h2>
          <p className="text-gray-600 dark:text-gray-300">Cuéntanos sobre ti para crear tu portafolio personalizado</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={portfolioData.personalInfo.name}
                onChange={(e) => setPortfolioData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título Profesional *
              </label>
              <input
                type="text"
                value={portfolioData.personalInfo.title}
                onChange={(e) => setPortfolioData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, title: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ej. Desarrollador Full Stack, Diseñador UX/UI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biografía
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => {
                    generateAIContent('bio', portfolioData.personalInfo.title, setIsGenerating);
                    setTimeout(() => {
                      setPortfolioData(prev => ({
                        ...prev,
                        personalInfo: { 
                          ...prev.personalInfo, 
                          bio: `Passionate ${prev.personalInfo.title || 'creative professional'} with a keen eye for detail and innovation. I transform ideas into compelling digital experiences that resonate with users and drive results.`
                        }
                      }));
                    }, 1500);
                  }}
                  disabled={isGenerating}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGenerating ? 'Generando...' : 'Generar con IA'}
                </button>
              </div>
              <textarea
                value={portfolioData.personalInfo.bio}
                onChange={(e) => setPortfolioData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, bio: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Cuéntanos sobre tu experiencia, pasiones y lo que te hace único..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={portfolioData.personalInfo.email}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={portfolioData.personalInfo.phone}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={portfolioData.personalInfo.location}
                onChange={(e) => setPortfolioData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Barcelona, España"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Redes Sociales
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="url"
                    value={portfolioData.socialLinks.github}
                    onChange={(e) => {
                      setPortfolioData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, github: e.target.value }
                      }));
                      // Auto-fetch repos when GitHub URL is entered
                      if (e.target.value.includes('github.com/')) {
                        const username = e.target.value.split('/').pop();
                        handleFetchGithubRepos(username);
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://github.com/usuario"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <input
                    type="url"
                    value={portfolioData.socialLinks.linkedin}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://linkedin.com/in/usuario"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <input
                    type="url"
                    value={portfolioData.socialLinks.instagram}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://instagram.com/usuario"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <input
                    type="url"
                    value={portfolioData.socialLinks.twitter}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://twitter.com/usuario"
                  />
                </div>
              </div>
            </div>

            {/* GitHub Integration */}
            {githubRepos.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Repositorios encontrados ({githubRepos.length})
                  </h3>
                  <button
                    onClick={handleImportGithubProjects}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Importar todos
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {githubRepos.slice(0, 5).map(repo => (
                    <div key={repo.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded text-sm">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{repo.title}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {repo.language} {repo.stars > 0 && `• ⭐ ${repo.stars}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habilidades
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => {
                    const aiSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Figma', 'Adobe Creative Suite', 'UI/UX Design'];
                    setPortfolioData(prev => ({
                      ...prev,
                      skills: aiSkills
                    }));
                  }}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Sugerir Skills
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {portfolioData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        setPortfolioData(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index)
                        }));
                      }}
                      className="w-4 h-4 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center hover:bg-indigo-300 dark:hover:bg-indigo-700"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Añadir habilidad y presionar Enter"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const skill = e.target.value.trim();
                    if (skill && !portfolioData.skills.includes(skill)) {
                      setPortfolioData(prev => ({
                        ...prev,
                        skills: [...prev.skills, skill]
                      }));
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

// Projects Step
  function renderProjectsStep() {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Proyectos</h2>
            <p className="text-gray-600 dark:text-gray-300">Añade tus mejores trabajos y proyectos</p>
          </div>
          <div className="flex gap-3">
            {githubRepos.length > 0 && (
              <button
                onClick={handleImportGithubProjects}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Github className="w-5 h-5" />
                Importar GitHub ({githubRepos.length})
              </button>
            )}
            <button
              onClick={() => setCurrentProject({})}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        {portfolioData.projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sin proyectos aún</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Añade tus primeros proyectos para mostrar tu trabajo</p>
            <div className="flex gap-3 justify-center">
              {githubRepos.length > 0 && (
                <button
                  onClick={handleImportGithubProjects}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Github className="w-5 h-5" />
                  Importar desde GitHub
                </button>
              )}
              <button
                onClick={() => setCurrentProject({})}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Añadir Manualmente
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {project.title || 'Proyecto sin título'}
                      </h3>
                      {project.featured && (
                        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.category}</p>
                    {project.stars && project.stars > 0 && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                        <span>⭐</span>
                        <span>{project.stars}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentProject(project)}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setPortfolioData(prev => ({
                          ...prev,
                          projects: prev.projects.filter(p => p.id !== project.id)
                        }));
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description || 'Sin descripción'}
                </p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <div className="flex-1 text-center">
                      <ExternalLink className="w-4 h-4 mx-auto text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">Demo</span>
                    </div>
                  )}
                  {project.githubUrl && (
                    <div className="flex-1 text-center">
                      <Github className="w-4 h-4 mx-auto text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Code</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Experience Step
  function renderExperienceStep() {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Experiencia Profesional</h2>
            <p className="text-gray-600 dark:text-gray-300">Añade tu historial laboral y experiencia</p>
          </div>
          <button
            onClick={() => setCurrentExperience({})}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Nueva Experiencia
          </button>
        </div>

        {portfolioData.experience.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sin experiencia añadida</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Añade tu primera experiencia laboral</p>
            <button
              onClick={() => setCurrentExperience({})}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium mx-auto"
            >
              <Plus className="w-5 h-5" />
              Añadir Primera Experiencia
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolioData.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {exp.position}
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentExperience(exp)}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setPortfolioData(prev => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index)
                        }));
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {exp.description}
                  </p>
                )}
                
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Testimonials Step
  function renderTestimonialsStep() {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Testimonios</h2>
            <p className="text-gray-600 dark:text-gray-300">Añade recomendaciones y testimonios de clientes</p>
          </div>
          <button
            onClick={() => setCurrentTestimonial({})}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Nuevo Testimonio
          </button>
        </div>

        {portfolioData.testimonials.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sin testimonios aún</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Añade testimonios para generar confianza</p>
            <button
              onClick={() => setCurrentTestimonial({})}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium mx-auto"
            >
              <Plus className="w-5 h-5" />
              Añadir Primer Testimonio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {testimonial.name?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentTestimonial(testimonial)}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setPortfolioData(prev => ({
                          ...prev,
                          testimonials: prev.testimonials.filter((_, i) => i !== index)
                        }));
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // Design Step
  function renderDesignStep() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personalización</h2>
          <p className="text-gray-600 dark:text-gray-300">Elige el estilo y diseño que mejor represente tu marca personal</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setPortfolioData(prev => ({
                  ...prev,
                  theme: { ...prev.theme, style: theme.id }
                }))}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  portfolioData.theme.style === theme.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex gap-2 mb-3">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{theme.preview}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {layouts.map((layout) => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.id}
                  onClick={() => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, layout: layout.id }
                  }))}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                    portfolioData.theme.layout === layout.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-gray-300" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{layout.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{layout.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Colores Personalizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Primario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={portfolioData.theme.primaryColor}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={portfolioData.theme.primaryColor}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Secundario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={portfolioData.theme.secondaryColor}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, secondaryColor: e.target.value }
                  }))}
                  className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={portfolioData.theme.secondaryColor}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, secondaryColor: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opciones Avanzadas</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo Oscuro por Defecto
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    El portafolio se abrirá en modo oscuro
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={portfolioData.theme.darkMode}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, darkMode: e.target.checked }
                  }))}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Animaciones Suaves
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Transiciones y animaciones fluidas
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Step
  function renderAnalyticsStep() {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Configuración</h2>
          <p className="text-gray-600 dark:text-gray-300">Configura el seguimiento y las opciones avanzadas de tu portafolio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Configuration */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Google Analytics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar Analytics
                </label>
                <input
                  type="checkbox"
                  checked={portfolioData.analytics.enabled}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    analytics: { ...prev.analytics, enabled: e.target.checked }
                  }))}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500"
                />
              </div>
              
              {portfolioData.analytics.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={portfolioData.analytics.trackingId}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      analytics: { ...prev.analytics, trackingId: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Obtén tu ID en Google Analytics Dashboard
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PWA Configuration */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Progressive Web App
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar PWA
                </label>
                <input
                  type="checkbox"
                  checked={portfolioData.pwa.enabled}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    pwa: { ...prev.pwa, enabled: e.target.checked }
                  }))}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500"
                />
              </div>
              
              {portfolioData.pwa.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de la App
                    </label>
                    <input
                      type="text"
                      value={portfolioData.pwa.name}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        pwa: { ...prev.pwa, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Mi Portafolio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre Corto
                    </label>
                    <input
                      type="text"
                      value={portfolioData.pwa.shortName}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        pwa: { ...prev.pwa, shortName: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Portfolio"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SEO Configuration */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              SEO & Meta Tags
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={portfolioData.personalInfo.bio}
                  onChange={(e) => setPortfolioData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, bio: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-20 resize-none"
                  placeholder="Descripción que aparecerá en buscadores..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Máximo 160 caracteres recomendado
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Palabras Clave
                </label>
                <input
                  type="text"
                  value={portfolioData.skills.join(', ')}
                  onChange={(e) => {
                    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                    setPortfolioData(prev => ({
                      ...prev,
                      skills: keywords
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="react, javascript, diseño web..."
                />
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Optimización
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Responsive Design</span>
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Activo</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">PWA Ready</span>
                <span className={`font-medium ${portfolioData.pwa.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  {portfolioData.pwa.enabled ? '✓ Activo' : '○ Inactivo'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Activo</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Auto-save</span>
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Activo</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Offline Support</span>
                <span className={`font-medium ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {isOnline ? '✓ Online' : '⚠ Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview Step
  function renderPreviewStep() {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">¡Tu portafolio está listo!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Revisa cómo se ve tu portafolio y haz los ajustes finales</p>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setPreviewMode(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium text-lg"
          >
            <Eye className="w-5 h-5" />
            Ver Portafolio Completo
          </button>
          <button 
            onClick={handleDownloadHTML}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium text-lg"
          >
            <Download className="w-5 h-5" />
            Exportar HTML
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumen de tu portafolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Información</h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✓ Nombre: {portfolioData.personalInfo.name || 'No definido'}</li>
                <li>✓ Título: {portfolioData.personalInfo.title || 'No definido'}</li>
                <li>✓ Bio: {portfolioData.personalInfo.bio ? 'Definida' : 'No definida'}</li>
                <li>✓ Skills: {portfolioData.skills.length} habilidades</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Proyectos</h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✓ Total: {portfolioData.projects.length} proyectos</li>
                <li>✓ Destacados: {portfolioData.projects.filter(p => p.featured).length}</li>
                <li>✓ Con demo: {portfolioData.projects.filter(p => p.liveUrl).length}</li>
                <li>✓ Con código: {portfolioData.projects.filter(p => p.githubUrl).length}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Experiencia</h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✓ Trabajos: {portfolioData.experience.length}</li>
                <li>✓ Testimonios: {portfolioData.testimonials.length}</li>
                <li>✓ Modo Oscuro: {darkMode ? 'Activo' : 'Inactivo'}</li>
                <li>✓ PWA: {portfolioData.pwa.enabled ? 'Habilitado' : 'Deshabilitado'}</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">Diseño</h4>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>✓ Tema: {themes.find(t => t.id === portfolioData.theme.style)?.name}</li>
                <li>✓ Layout: {layouts.find(l => l.id === portfolioData.theme.layout)?.name}</li>
                <li>✓ Responsive: Sí</li>
                <li>✓ Analytics: {portfolioData.analytics.enabled ? 'Habilitado' : 'Deshabilitado'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Modals
  function renderModals() {
    return (
      <>
        {currentProject && (
          <ProjectModal
            project={currentProject}
            onSave={(project) => {
              if (project.id && portfolioData.projects.find(p => p.id === project.id)) {
                setPortfolioData(prev => ({
                  ...prev,
                  projects: prev.projects.map(p => p.id === project.id ? project : p)
                }));
              } else {
                setPortfolioData(prev => ({
                  ...prev,
                  projects: [...prev.projects, { ...project, id: Date.now() }]
                }));
              }
              setCurrentProject(null);
            }}
            onClose={() => setCurrentProject(null)}
          />
        )}

        {currentExperience && (
          <ExperienceModal
            experience={currentExperience}
            onSave={(experience) => {
              if (experience.id && portfolioData.experience.find(e => e.id === experience.id)) {
                setPortfolioData(prev => ({
                  ...prev,
                  experience: prev.experience.map(e => e.id === experience.id ? experience : e)
                }));
              } else {
                setPortfolioData(prev => ({
                  ...prev,
                  experience: [...prev.experience, { ...experience, id: Date.now() }]
                }));
              }
              setCurrentExperience(null);
            }}
            onClose={() => setCurrentExperience(null)}
          />
        )}

        {currentTestimonial && (
          <TestimonialModal
            testimonial={currentTestimonial}
            onSave={(testimonial) => {
              if (testimonial.id && portfolioData.testimonials.find(t => t.id === testimonial.id)) {
                setPortfolioData(prev => ({
                  ...prev,
                  testimonials: prev.testimonials.map(t => t.id === testimonial.id ? testimonial : t)
                }));
              } else {
                setPortfolioData(prev => ({
                  ...prev,
                  testimonials: [...prev.testimonials, { ...testimonial, id: Date.now() }]
                }));
              }
              setCurrentTestimonial(null);
            }}
            onClose={() => setCurrentTestimonial(null)}
          />
        )}
      </>
    );
  }

// Cerrar el componente principal
};

// Exportación del componente principal
export default PortfolioGenerator;
