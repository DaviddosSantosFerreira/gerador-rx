import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Settings, User, Plus, Play, Image, Video, Clock, Star, Folder, Upload, Download, Trash2, Share2, Heart, Eye, Edit, MoreVertical, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Check, X, Home, Grid, List, FileText, Camera, Mic, Send, MessageSquare, Users, Lock, Globe, Mail, Phone, Calendar, Tag, Filter, SortAsc, SortDesc, RefreshCw, Save, Undo, Redo, ZoomIn, ZoomOut, RotateCcw, RotateCw, Crop, Scissors, Paintbrush, Palette, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough, Link, Unlink, Code, Quote, ListOrdered, Table, BarChart, LineChart, PieChart, Bell, AlertCircle, Info, HelpCircle, Shield, Key, Unlock, UserPlus, UserMinus, UserCheck, UserX, UserCircle, UserSquare } from 'lucide-react';
import { generateVideo, generateImage, getPrediction, getSessions, uploadAsset, getAssets } from './services/api';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';

// Componente Generate FORA de App
const Generate = ({ 
  currentGeneration, 
  setCurrentGeneration, 
  credits, 
  isGenerating, 
  generationProgress, 
  handleGenerate, 
  sessions 
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Generate Videos</h1>
      <div className="flex items-center space-x-4">
        <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{credits} credits</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Generation Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Your Video</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to create?</label>
          <textarea
            value={currentGeneration.prompt}
            onChange={(e) => setCurrentGeneration({...currentGeneration, prompt: e.target.value})}
            placeholder="Describe your creation..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={6}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <select
            value={currentGeneration.model}
            onChange={(e) => setCurrentGeneration({...currentGeneration, model: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="gen-4">Gen-4</option>
            <option value="gen-4.5">Gen-4.5 (Soon)</option>
            <option value="gemini-3-pro">Gemini 3 Pro</option>
            <option value="veo-3.1">Veo 3.1</option>
            <option value="flash-2.5">Flash 2.5</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <select
            value={currentGeneration.duration}
            onChange={(e) => setCurrentGeneration({...currentGeneration, duration: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="5s">5 seconds</option>
            <option value="10s">10 seconds</option>
            <option value="15s">15 seconds</option>
            <option value="30s">30 seconds</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
          <select
            value={currentGeneration.resolution}
            onChange={(e) => setCurrentGeneration({...currentGeneration, resolution: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4k">4K</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <select
            value={currentGeneration.style}
            onChange={(e) => setCurrentGeneration({...currentGeneration, style: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="cinematic">Cinematic</option>
            <option value="animation">Animation</option>
            <option value="realistic">Realistic</option>
            <option value="cartoon">Cartoon</option>
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !currentGeneration.prompt.trim()}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isGenerating || !currentGeneration.prompt.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
        
        {isGenerating && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Generating: {generationProgress}%</p>
          </div>
        )}
      </div>
      
      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Your video is being generated...</p>
            </div>
          ) : currentGeneration.prompt ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-white mx-auto mb-2 opacity-50" />
                  <p className="text-white text-sm">Preview will appear here after generation</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <h3 className="font-medium text-gray-800 mb-2">Prompt:</h3>
                <p className="text-gray-600 text-sm">{currentGeneration.prompt}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <Image className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-center">Enter a prompt to generate your video</p>
            </div>
          )}
        </div>
        
        {/* Recent Generations */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Generations</h2>
          <div className="space-y-4">
            {sessions.slice(0, 3).map(session => (
              <div key={session.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <img src={session.thumbnail} alt={session.name} className="w-16 h-10 object-cover rounded mr-3" />
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{session.name}</h3>
                  <p className="text-sm text-gray-500">{session.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente Images FORA de App
const Images = ({ 
  imagePrompt, 
  setImagePrompt, 
  isGeneratingImage, 
  handleGenerateImage, 
  credits, 
  assets 
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Generate Images</h1>
      <div className="flex items-center space-x-4">
        <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{credits} credits</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Image Generation Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Your Image</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to create?</label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe your image..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={6}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="cinematic">Cinematic</option>
            <option value="photorealistic">Photorealistic</option>
            <option value="illustration">Illustration</option>
            <option value="watercolor">Watercolor</option>
            <option value="oil-painting">Oil Painting</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="16:9">16:9 (Landscape)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="9:16">9:16 (Portrait)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="1024x1024">1024x1024</option>
            <option value="2048x2048">2048x2048</option>
            <option value="4096x4096">4096x4096</option>
          </select>
        </div>
        
        <button
          onClick={handleGenerateImage}
          disabled={isGeneratingImage || !imagePrompt.trim()}
          className={`w-full py-3 rounded-lg transition-colors ${
            isGeneratingImage || !imagePrompt.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isGeneratingImage ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="aspect-square bg-black rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <Image className="w-12 h-12 text-white mx-auto mb-2 opacity-50" />
                <p className="text-white text-sm">Enter a prompt to generate your image</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h3 className="font-medium text-gray-800 mb-2">Prompt:</h3>
                <p className="text-gray-600 text-sm">No prompt entered</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h3 className="font-medium text-gray-800 mb-2">Style:</h3>
                <p className="text-gray-600 text-sm">Cinematic</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Images */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Images</h2>
          <div className="space-y-4">
            {assets.filter(a => a.type === 'image').slice(0, 3).map(asset => (
              <div key={asset.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-16 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{asset.name}</h3>
                  <p className="text-sm text-gray-500">{asset.size} â€¢ {asset.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DashboardApp = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  currentGeneration,
  setCurrentGeneration,
  credits,
  isGenerating,
  generationProgress,
  handleGenerate,
  sessions,
  imagePrompt,
  setImagePrompt,
  isGeneratingImage,
  handleGenerateImage,
  assets,
  searchQuery,
  setSearchQuery,
  user,
  filteredAssets,
  toggleFavorite,
  deleteAsset,
  handleUploadAsset,
  isUploadingAsset,
  workflows
}) => {
  const Dashboard = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generate Videos</h3>
            <Play className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 mb-4">Use Gen-4 to create videos with a single image</p>
          <button 
            onClick={() => setActiveTab('generate')}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Generating
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Animate Characters</h3>
            <Image className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">Animate characters with a single driving performance</p>
          <button 
            onClick={() => setActiveTab('animate')}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Animate Now
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generate Images</h3>
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-gray-600 mb-4">Create high fidelity images with stylistic control</p>
          <button 
            onClick={() => setActiveTab('images')}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Images
          </button>
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Sessions</h2>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            View All â†’
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.slice(0, 3).map(session => (
            <div key={session.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <img src={session.thumbnail} alt={session.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{session.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{session.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Featured Workflows */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Workflows</h2>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            View All â†’
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.filter(w => w.featured).slice(0, 4).map(workflow => (
            <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{workflow.name}</h3>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workflow.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{workflow.steps} steps</span>
                <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
  const Animate = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Animate Characters</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Selection */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Character</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Character Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
              <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700">
                Browse files
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Driving Performance</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select driving performance</option>
              <option value="walk">Walk</option>
              <option value="run">Run</option>
              <option value="dance">Dance</option>
              <option value="talk">Talk</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Animation Style</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="anime">Anime</option>
              <option value="stylized">Stylized</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="5s">5 seconds</option>
              <option value="10s">10 seconds</option>
              <option value="15s">15 seconds</option>
              <option value="30s">30 seconds</option>
            </select>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            Animate Character
          </button>
        </div>
        
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-white mx-auto mb-2 opacity-50" />
                  <p className="text-white text-sm">Upload a character image to preview animation</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-gray-800 mb-2">Character:</h3>
                  <p className="text-gray-600 text-sm">No character selected</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-medium text-gray-800 mb-2">Performance:</h3>
                  <p className="text-gray-600 text-sm">No performance selected</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Animations */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Animations</h2>
            <div className="space-y-4">
              {sessions.filter(s => s.type === 'image').slice(0, 3).map(session => (
                <div key={session.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <img src={session.thumbnail} alt={session.name} className="w-16 h-10 object-cover rounded mr-3" />
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800">{session.name}</h3>
                    <p className="text-sm text-gray-500">{session.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  const Assets = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assets Library</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button 
            className="pb-4 border-b-2 border-indigo-600 font-medium text-indigo-600"
            onClick={() => setActiveTab('assets-private')}
          >
            Private
          </button>
          <button 
            className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            onClick={() => setActiveTab('assets-shared')}
          >
            Shared
          </button>
          <button 
            className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            onClick={() => setActiveTab('assets-favorites')}
          >
            Favorited
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for tools, assets and projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 inline mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <SortAsc className="w-4 h-4 inline mr-2" />
            Sort
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4 inline mr-2" />
            New Folder
          </button>
          <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer inline-flex items-center">
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
            <input
              type="file"
              onChange={handleUploadAsset}
              disabled={isUploadingAsset}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {asset.type === 'image' && <Image className="w-12 h-12 text-gray-400" />}
              {asset.type === 'video' && <Video className="w-12 h-12 text-gray-400" />}
              {asset.type === 'audio' && <Mic className="w-12 h-12 text-gray-400" />}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{asset.name}</h3>
                <button 
                  onClick={() => toggleFavorite(asset.id)}
                  className={`p-1 rounded-full ${asset.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {asset.type}
                </span>
                <span className="text-xs text-gray-500">{asset.size}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {asset.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {asset.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{asset.tags.length - 2}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{asset.date}</span>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">You've reached the end of your asset library.</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Upload New Asset
          </button>
        </div>
      )}
    </div>
  );
  
  const Workflows = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Workflows</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      {/* Create Workflow */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Build Your Own Workflow</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Build a Workflow
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Create your own custom node-based workflows chaining together multiple models and intermediary steps for even more control.
        </p>
      </div>
      
      {/* Featured Workflows */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map(workflow => (
            <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 truncate">{workflow.name}</h3>
                {workflow.featured && <Star className="w-4 h-4 text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workflow.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{workflow.steps} steps</span>
                <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Workflows */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Workflows</h2>
        <div className="space-y-4">
          {workflows.slice(0, 3).map(workflow => (
            <div key={workflow.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Grid className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{workflow.name}</h3>
                <p className="text-sm text-gray-500">{workflow.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Play className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const Live = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <div className="mb-4">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <Camera className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Real-time experiences coming soon...</h2>
          <p className="text-gray-600 mb-4">
            Explore dynamic environments and interactive avatars powered by the world's most advanced real-time explorable General World Model, GWM-1.
          </p>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium mb-4">
            Learn more
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Avatars</h3>
            <p className="text-gray-600 text-sm mb-4">Interactive avatars that respond to your commands</p>
            <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Learn More
            </button>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Worlds</h3>
            <p className="text-gray-600 text-sm mb-4">Dynamic environments that evolve based on your interactions</p>
            <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-gray-600 mb-4">
            Interested for your company?
          </p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
  
  const Watch = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Watch</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{credits} credits</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
      
      {/* Channel Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button 
            className="pb-4 border-b-2 border-indigo-600 font-medium text-indigo-600"
            onClick={() => setActiveTab('watch-submitted')}
          >
            SUBMITTED
          </button>
          <button 
            className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            onClick={() => setActiveTab('watch-festival')}
          >
            FESTIVAL
          </button>
          <button 
            className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            onClick={() => setActiveTab('watch-aifilm')}
          >
            AIFILM
          </button>
        </div>
      </div>
      
      {/* Featured Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">AIFILM Festival 2024</h2>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
            View All â†’
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg overflow-hidden">
            <img src="https://placehold.co/600x300/10B981/FFFFFF?text=AIFILM+Festival" alt="AIFILM Festival" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Get Me Out</h3>
              <p className="text-sm text-gray-600 mb-2">by Daniel Antebi</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  GRAND PRIX 2024
                </span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <img src="https://placehold.co/600x300/4F46E5/FFFFFF?text=SUBMITTED+BUMPERS" alt="Submitted Bumpers" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Submitted Bumpers</h3>
              <p className="text-sm text-gray-600 mb-2">Community submissions</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  FEATURED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">AIFILM</h3>
            <p className="text-sm text-gray-600">AI-generated films and animations</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">FESTIVAL</h3>
            <p className="text-sm text-gray-600">Award-winning AI content</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">SUBMITTED</h3>
            <p className="text-sm text-gray-600">Community submissions</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">EDUCATION</h3>
            <p className="text-sm text-gray-600">Tutorials and educational content</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">TECHNICAL</h3>
            <p className="text-sm text-gray-600">Technical demonstrations</p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">EXPERIMENTAL</h3>
            <p className="text-sm text-gray-600">Experimental AI creations</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const Sidebar = () => (
    <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-indigo-600">Gerador RX</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('generate')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'generate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Play className="w-5 h-5 mr-3" />
            Generate Videos
          </button>
          <button 
            onClick={() => setActiveTab('animate')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'animate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Image className="w-5 h-5 mr-3" />
            Animate Characters
          </button>
          <button 
            onClick={() => setActiveTab('images')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'images' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Camera className="w-5 h-5 mr-3" />
            Generate Images
          </button>
          <button 
            onClick={() => setActiveTab('assets-private')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab.startsWith('assets') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Folder className="w-5 h-5 mr-3" />
            Assets Library
          </button>
          <button 
            onClick={() => setActiveTab('workflows')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'workflows' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5 mr-3" />
            Workflows
          </button>
          <button 
            onClick={() => setActiveTab('live')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'live' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Camera className="w-5 h-5 mr-3" />
            Live
          </button>
          <button 
            onClick={() => setActiveTab('watch')} 
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'watch' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Play className="w-5 h-5 mr-3" />
            Watch
          </button>
        </nav>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.plan}</div>
              </div>
            </div>
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Invite members
            </button>
            <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Lock className="w-5 h-5 mr-3" />
              Account Settings
            </button>
            <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <HelpCircle className="w-5 h-5 mr-3" />
              Help Center
            </button>
            <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Info className="w-5 h-5 mr-3" />
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const Header = () => (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-indigo-600">Gerador RX</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for tools, assets and projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{credits} credits</span>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Upgrade
            </button>
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-6 h-6" />
              </button>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <User className="w-6 h-6" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
  
  const Menu = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 ml-0 md:ml-64 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header />
        <main className="pt-16 pb-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'generate' && (
            <Generate
              currentGeneration={currentGeneration}
              setCurrentGeneration={setCurrentGeneration}
              credits={credits}
              isGenerating={isGenerating}
              generationProgress={generationProgress}
              handleGenerate={handleGenerate}
              sessions={sessions}
            />
          )}
          {activeTab === 'animate' && <Animate />}
          {activeTab === 'images' && (
            <Images
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              isGeneratingImage={isGeneratingImage}
              handleGenerateImage={handleGenerateImage}
              credits={credits}
              assets={assets}
            />
          )}
          {activeTab === 'assets-private' && <Assets />}
          {activeTab === 'assets-shared' && <Assets />}
          {activeTab === 'assets-favorites' && <Assets />}
          {activeTab === 'workflows' && <Workflows />}
          {activeTab === 'live' && <Live />}
          {activeTab === 'watch' && <Watch />}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [credits, setCredits] = useState(125);
  const [user, setUser] = useState({ name: 'David', plan: 'Personal - Free' });
  const [sessions, setSessions] = useState([]);
  
  const [assets, setAssets] = useState([
    { id: 1, name: 'Character_01.png', type: 'image', size: '2.4MB', date: '2026-01-10', tags: ['character', 'animation'], favorite: true, private: true },
    { id: 2, name: 'Background_01.mp4', type: 'video', size: '15.7MB', date: '2026-01-09', tags: ['background', 'cinematic'], favorite: false, private: true },
    { id: 3, name: 'Logo_Animation.mov', type: 'video', size: '8.2MB', date: '2026-01-08', tags: ['logo', 'brand'], favorite: true, private: false },
    { id: 4, name: 'Texture_01.jpg', type: 'image', size: '1.8MB', date: '2026-01-07', tags: ['texture', 'material'], favorite: false, private: true },
    { id: 5, name: 'Sound_Effect.wav', type: 'audio', size: '3.1MB', date: '2026-01-06', tags: ['sound', 'effect'], favorite: false, private: false },
  ]);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  
  const [workflows, setWorkflows] = useState([
    { id: 1, name: 'Seamless Transitions', description: 'Create smooth transitions between scenes', steps: 3, date: '2026-01-10', featured: true },
    { id: 2, name: 'B-Roll Generator', description: 'Generate B-roll footage for your projects', steps: 5, date: '2026-01-09', featured: true },
    { id: 3, name: 'New Angles', description: 'Create different camera angles from a single shot', steps: 4, date: '2026-01-08', featured: false },
    { id: 4, name: 'Video to Video - Scene Edit', description: 'Edit scenes in your videos with AI', steps: 6, date: '2026-01-07', featured: false },
  ]);
  
  const [currentGeneration, setCurrentGeneration] = useState({
    prompt: '',
    model: 'gen-4',
    duration: '5s',
    resolution: '1080p',
    style: 'cinematic'
  });
  
  const { user: authUser } = useAuth();
  
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getSessions();
          setSessions(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar sessÃµes:', error);
      }
    };
    
    loadSessions();
  }, []);
  
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getAssets();
          setAssets(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar assets:', error);
      }
    };
    
    loadAssets();
  }, []);
  
  useEffect(() => {
    if (authUser?.credits !== undefined) {
      setCredits(authUser.credits);
    }
  }, [authUser]);
  
  const handleGenerate = async () => {
    if (!currentGeneration.prompt.trim()) return;
    
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Chamar API para gerar vÃ­deo
      const response = await generateVideo({
        prompt: currentGeneration.prompt,
        model: currentGeneration.model || 'gen-4',
        duration: currentGeneration.duration || '10s',
        resolution: currentGeneration.resolution || '1080p',
        style: currentGeneration.style || 'cinematic'
      });
      
      const { predictionId, sessionId } = response.data;
      
      // Polling para verificar status da geraÃ§Ã£o
      const checkStatus = async () => {
        try {
          const statusResponse = await getPrediction(predictionId);
          const status = statusResponse.data.status;
          const output = statusResponse.data.output;
          
          if (status === 'succeeded') {
            setGenerationProgress(100);
            setIsGenerating(false);
            
            // Atualizar lista de sessÃµes
            try {
              const sessionsResponse = await getSessions();
              setSessions(sessionsResponse.data);
            } catch (err) {
              console.error('Erro ao atualizar sessÃµes:', err);
            }
            
            // Resetar formulÃ¡rio
            setCurrentGeneration({
              prompt: '',
              model: 'gen-4',
              duration: '10s',
              resolution: '1080p',
              style: 'cinematic'
            });
            
            alert('VÃ­deo gerado com sucesso!');
          } else if (status === 'failed') {
            setIsGenerating(false);
            setGenerationProgress(0);
            alert('Erro ao gerar vÃ­deo. Tente novamente.');
          } else {
            // Status: starting, processing, etc.
            setGenerationProgress(prev => Math.min(prev + 10, 90));
            setTimeout(checkStatus, 3000); // Verificar novamente em 3s
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
          setIsGenerating(false);
          setGenerationProgress(0);
          alert('Erro ao verificar status da geraÃ§Ã£o.');
        }
      };
      
      // ComeÃ§ar verificaÃ§Ã£o apÃ³s 2 segundos
      setTimeout(checkStatus, 2000);
      
    } catch (error) {
      console.error('Erro ao gerar vÃ­deo:', error);
      setIsGenerating(false);
      setGenerationProgress(0);
      alert(error.response?.data?.message || 'Erro ao gerar vÃ­deo. Verifique seus crÃ©ditos.');
    }
  };
  
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    try {
      setIsGeneratingImage(true);
      
      const response = await generateImage(imagePrompt);
      const { predictionId, sessionId } = response.data;
      
      // Polling para verificar status da geraÃ§Ã£o
      const checkImageStatus = async () => {
        try {
          const statusResponse = await getPrediction(predictionId);
          const status = statusResponse.data.status;
          const output = statusResponse.data.output;
          
          if (status === 'succeeded') {
            setIsGeneratingImage(false);
            setImagePrompt('');
            
            // Atualizar sessÃµes
            try {
              const sessionsResponse = await getSessions();
              setSessions(sessionsResponse.data);
            } catch (err) {
              console.error('Erro ao atualizar sessÃµes:', err);
            }
            
            alert('Imagem gerada com sucesso!');
          } else if (status === 'failed') {
            setIsGeneratingImage(false);
            alert('Erro ao gerar imagem. Tente novamente.');
          } else {
            setTimeout(checkImageStatus, 3000);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
          setIsGeneratingImage(false);
          alert('Erro ao verificar status da geraÃ§Ã£o.');
        }
      };
      
      setTimeout(checkImageStatus, 2000);
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      setIsGeneratingImage(false);
      alert(error.response?.data?.message || 'Erro ao gerar imagem. Verifique seus crÃ©ditos.');
    }
  };
  
  const handleUploadAsset = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsUploadingAsset(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
      
      await uploadAsset(formData);
      
      // Recarregar assets
      try {
        const response = await getAssets();
        setAssets(response.data);
      } catch (err) {
        console.error('Erro ao recarregar assets:', err);
      }
      
      alert('Asset enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar asset:', error);
      alert(error.response?.data?.message || 'Erro ao enviar asset.');
    } finally {
      setIsUploadingAsset(false);
      // Limpar o input para permitir upload do mesmo arquivo novamente
      event.target.value = '';
    }
  };
  
  const toggleFavorite = (assetId) => {
    setAssets(assets.map(asset => 
      asset.id === assetId ? { ...asset, favorite: !asset.favorite } : asset
    ));
  };
  
  const deleteAsset = (assetId) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
  };
  
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardApp
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentGeneration={currentGeneration}
                setCurrentGeneration={setCurrentGeneration}
                credits={credits}
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                handleGenerate={handleGenerate}
                sessions={sessions}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
                isGeneratingImage={isGeneratingImage}
                handleGenerateImage={handleGenerateImage}
                assets={assets}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                user={user}
                filteredAssets={filteredAssets}
                toggleFavorite={toggleFavorite}
                deleteAsset={deleteAsset}
                handleUploadAsset={handleUploadAsset}
                isUploadingAsset={isUploadingAsset}
                workflows={workflows}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <DashboardApp
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentGeneration={currentGeneration}
                setCurrentGeneration={setCurrentGeneration}
                credits={credits}
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                handleGenerate={handleGenerate}
                sessions={sessions}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
                isGeneratingImage={isGeneratingImage}
                handleGenerateImage={handleGenerateImage}
                assets={assets}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                user={user}
                filteredAssets={filteredAssets}
                toggleFavorite={toggleFavorite}
                deleteAsset={deleteAsset}
                handleUploadAsset={handleUploadAsset}
                isUploadingAsset={isUploadingAsset}
                workflows={workflows}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
