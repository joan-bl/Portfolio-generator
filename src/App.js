import React, { useState } from 'react';
import { 
  Camera, Code, Palette, Globe, Download, Eye, Settings, Plus, X, 
  Edit3, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, 
  Instagram, Twitter, Upload, Sparkles, Layout, Zap, Heart 
} from 'lucide-react';

const PortfolioGenerator = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [portfolioData, setPortfolioData] = useState({
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
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { name: 'Minimal', id: 'minimal', colors: ['#000000', '#ffffff'], preview: 'Clean & Simple' },
    { name: 'Creative', id: 'creative', colors: ['#ff6b6b', '#4ecdc4'], preview: 'Bold & Artistic' },
    { name: 'Tech', id: 'tech', colors: ['#0f172a', '#3b82f6'], preview: 'Modern & Professional' },
    { name: 'Warm', id: 'warm', colors: ['#f59e0b', '#ef4444'], preview: 'Friendly & Inviting' },
    { name: 'Nature', id: 'nature', colors: ['#059669', '#84cc16'], preview: 'Fresh & Organic' },
    { name: 'Elegant', id: 'elegant', colors: ['#7c3aed', '#ec4899'], preview: 'Sophisticated & Luxury' }
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

  const generateAIContent = (type, userInput) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      category: 'Web Development',
      tags: [],
      images: [],
      liveUrl: '',
      githubUrl: '',
      featured: false
    };
    setCurrentProject(newProject);
  };

  const saveProject = (project) => {
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
  };

  const deleteProject = (projectId) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

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
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {project?.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Proyecto
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Mi Proyecto Increíble"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {projectCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24 resize-none"
                placeholder="Describe tu proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags/Tecnologías
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="w-3 h-3 rounded-full bg-indigo-200 flex items-center justify-center hover:bg-indigo-300"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Añadir tag y presionar Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Demo/Live
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://mi-proyecto.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL GitHub
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
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
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PortfolioPreview = () => {
    const theme = themes.find(t => t.id === portfolioData.theme.style) || themes[0];
    const isMinimal = portfolioData.theme.style === 'minimal';
    const isBento = portfolioData.theme.layout === 'bento';
    
    return (
      <div className="min-h-screen" style={{ 
        background: isMinimal ? '#ffffff' : `linear-gradient(135deg, ${theme.colors[0]}10, ${theme.colors[1]}10)` 
      }}>
        {/* Header/Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
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
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-fade-in">
                {portfolioData.personalInfo.name || 'Tu Nombre'}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-6 font-light">
                {portfolioData.personalInfo.title || 'Tu Título Profesional'}
              </p>
              
              <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
                {portfolioData.personalInfo.bio || 'Tu biografía aparecerá aquí. Cuenta tu historia profesional.'}
              </p>

              <div className="flex justify-center gap-4 mb-8">
                {portfolioData.socialLinks.github && (
                  <a href={portfolioData.socialLinks.github} 
                     className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Github className="w-5 h-5 text-gray-700" />
                  </a>
                )}
                {portfolioData.socialLinks.linkedin && (
                  <a href={portfolioData.socialLinks.linkedin}
                     className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                  </a>
                )}
                {portfolioData.socialLinks.instagram && (
                  <a href={portfolioData.socialLinks.instagram}
                     className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </a>
                )}
                {portfolioData.socialLinks.twitter && (
                  <a href={portfolioData.socialLinks.twitter}
                     className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
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
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Habilidades & Tecnologías
              </h2>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {portfolioData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
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

        {/* Projects Section */}
        <div className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              Proyectos Destacados
            </h2>
            
            {portfolioData.projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
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
                    className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:scale-105 ${
                      isBento && index % 3 === 0 ? 'md:col-span-2 md:row-span-1' : ''
                    } ${project.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-600">
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
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
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
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
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

        {/* Contact Section */}
        <div className="py-20 bg-gray-900 text-white">
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

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-6 py-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900">Vista Previa del Portafolio</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-20">
          <PortfolioPreview />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Generador de Portafolios 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> IA</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crea un portafolio profesional e interactivo en minutos. Con IA, plantillas modernas y exportación lista para usar.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg flex gap-2">
            {[
              { id: 'setup', label: 'Información', icon: Settings },
              { id: 'projects', label: 'Proyectos', icon: Code },
              { id: 'design', label: 'Diseño', icon: Palette },
              { id: 'preview', label: 'Vista Previa', icon: Eye }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentStep(id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentStep === id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Setup Step */}
          {currentStep === 'setup' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Información Personal</h2>
                <p className="text-gray-600">Cuéntanos sobre ti para crear tu portafolio personalizado</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={portfolioData.personalInfo.name}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Profesional *
                    </label>
                    <input
                      type="text"
                      value={portfolioData.personalInfo.title}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, title: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="ej. Desarrollador Full Stack, Diseñador UX/UI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          generateAIContent('bio', portfolioData.personalInfo.title);
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
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center gap-1"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-none"
                      placeholder="Cuéntanos sobre tu experiencia, pasiones y lo que te hace único..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={portfolioData.personalInfo.email}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={portfolioData.personalInfo.phone}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={portfolioData.personalInfo.location}
                      onChange={(e) => setPortfolioData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Barcelona, España"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redes Sociales
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={portfolioData.socialLinks.github}
                          onChange={(e) => setPortfolioData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, github: e.target.value }
                          }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="https://twitter.com/usuario"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Sugerir Skills
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {portfolioData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              setPortfolioData(prev => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== index)
                              }));
                            }}
                            className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center hover:bg-indigo-300"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Añadir habilidad y presionar Enter"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
          )}

          {/* Projects Step */}
          {currentStep === 'projects' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyectos</h2>
                  <p className="text-gray-600">Añade tus mejores trabajos y proyectos</p>
                </div>
                <button
                  onClick={addProject}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Proyecto
                </button>
              </div>

              {portfolioData.projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Code className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin proyectos aún</h3>
                  <p className="text-gray-600 mb-6">Añade tus primeros proyectos para mostrar tu trabajo</p>
                  <button
                    onClick={addProject}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Añadir Primer Proyecto
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioData.projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {project.title || 'Proyecto sin título'}
                            </h3>
                            {project.featured && (
                              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{project.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setCurrentProject(project)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {project.description || 'Sin descripción'}
                      </p>
                      
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <div className="flex-1 text-center">
                            <ExternalLink className="w-4 h-4 mx-auto text-green-600" />
                            <span className="text-xs text-green-600">Demo</span>
                          </div>
                        )}
                        {project.githubUrl && (
                          <div className="flex-1 text-center">
                            <Github className="w-4 h-4 mx-auto text-gray-600" />
                            <span className="text-xs text-gray-600">Code</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Design Step */}
          {currentStep === 'design' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalización</h2>
                <p className="text-gray-600">Elige el estilo y diseño que mejor represente tu marca personal</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temas</h3>
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
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                      <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
                      <p className="text-sm text-gray-600">{theme.preview}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout</h3>
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
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                        <h4 className="font-semibold text-gray-900 mb-1">{layout.name}</h4>
                        <p className="text-sm text-gray-600">{layout.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Colores Personalizados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portfolioData.theme.primaryColor}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          theme: { ...prev.theme, primaryColor: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portfolioData.theme.secondaryColor}
                        onChange={(e) => setPortfolioData(prev => ({
                          ...prev,
                          theme: { ...prev.theme, secondaryColor: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Tu portafolio está listo!</h2>
              <p className="text-gray-600 mb-8">Revisa cómo se ve tu portafolio y haz los ajustes finales</p>
              
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setPreviewMode(true)}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium text-lg"
                >
                  <Eye className="w-5 h-5" />
                  Ver Portafolio Completo
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-lg">
                  <Download className="w-5 h-5" />
                  Exportar HTML
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu portafolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-medium text-gray-900">Información</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Nombre: {portfolioData.personalInfo.name || 'No definido'}</li>
                      <li>✓ Título: {portfolioData.personalInfo.title || 'No definido'}</li>
                      <li>✓ Bio: {portfolioData.personalInfo.bio ? 'Definida' : 'No definida'}</li>
                      <li>✓ Skills: {portfolioData.skills.length} habilidades</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Proyectos</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Total: {portfolioData.projects.length} proyectos</li>
                      <li>✓ Destacados: {portfolioData.projects.filter(p => p.featured).length}</li>
                      <li>✓ Con demo: {portfolioData.projects.filter(p => p.liveUrl).length}</li>
                      <li>✓ Con código: {portfolioData.projects.filter(p => p.githubUrl).length}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-gray-900">Diseño</h4>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Tema: {themes.find(t => t.id === portfolioData.theme.style)?.name}</li>
                      <li>✓ Layout: {layouts.find(l => l.id === portfolioData.theme.layout)?.name}</li>
                      <li>✓ Responsive: Sí</li>
                      <li>✓ Optimizado: Sí</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          Creado con ❤️ usando las últimas tendencias de diseño web 2025
        </div>
      </div>

      {/* Project Modal */}
      {currentProject && (
        <ProjectModal
          project={currentProject}
          onSave={saveProject}
          onClose={() => setCurrentProject(null)}
        />
      )}
    </div>
  );
};

export default PortfolioGenerator;