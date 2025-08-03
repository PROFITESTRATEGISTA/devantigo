import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, X, ArrowLeft, Bell, Crown, Zap, Phone, Users, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { InvitesList } from '../components/InvitesList';
import { TokenDisplay } from '../components/TokenDisplay';
import { Navbar } from '../components/Navbar';

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
      setName(prev => prev);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      setError(null);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      await updateProfile({
        avatar_url: publicUrl
      });

      setAvatarUrl(publicUrl);
      setSuccess(language === 'en' ? 'Profile photo updated successfully' : 'Foto de perfil atualizada com sucesso');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error.message : (language === 'en' ? 'Error uploading image' : 'Erro ao fazer upload da imagem'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || null
      });
      setSuccess(language === 'en' ? 'Profile updated successfully' : 'Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : (language === 'en' ? 'Error updating profile' : 'Erro ao atualizar perfil'));
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setError(null);
      
      // Update profile with no avatar
      await updateProfile({
        avatar_url: null
      });

      setAvatarUrl('');
      setSuccess(language === 'en' ? 'Profile photo removed successfully' : 'Foto de perfil removida com sucesso');
    } catch (error) {
      console.error('Error removing avatar:', error);
      setError(error instanceof Error ? error.message : (language === 'en' ? 'Error removing photo' : 'Erro ao remover foto'));
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
                title={language === 'en' ? 'Back' : 'Voltar'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                {t('profile.title')}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/subscription')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center space-x-2"
              >
                <Crown className="w-4 h-4" />
                <span>{t('nav.subscription')}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-md text-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500 bg-opacity-10 border border-green-500 rounded-md text-green-500">
                {success}
              </div>
            )}

            {/* Subscription Status */}
            <div className="mb-8 bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-medium">{profile.plan || 'Free Forever'}</h2>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 bg-opacity-20 text-green-400">
                  {profile.plan_status || 'Active'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">{language === 'en' ? 'Next Billing' : 'Próximo Faturamento'}</p>
                  <p className="font-medium">{profile.plan_renewal_date ? new Date(profile.plan_renewal_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('subscription.tokenBalance')}</p>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                    <p className="font-medium">{profile.token_balance?.toLocaleString() || 0} {t('tokens.balance')}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {language === 'en' ? 'View Details →' : 'Ver Detalhes →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Invites Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-blue-400 mr-2" />
                <h2 className="text-lg font-medium">{language === 'en' ? 'Pending Invites' : 'Convites Pendentes'}</h2>
              </div>
              <InvitesList />
            </div>

            {/* Friends Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-400 mr-2" />
                  <h2 className="text-lg font-medium">{language === 'en' ? 'Connected Friends' : 'Amigos Conectados'}</h2>
                </div>
                <button
                  onClick={() => navigate('/dashboard?section=users')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {language === 'en' ? 'View All →' : 'Ver Todos →'}
                </button>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mock friends data - in real app this would come from API */}
                  {[
                    { id: '1', name: 'Carlos Silva', specialty: 'Scalping Expert', avatar: null, status: 'online' },
                    { id: '2', name: 'Ana Costa', specialty: 'Swing Trading', avatar: null, status: 'offline' },
                    { id: '3', name: 'Pedro Santos', specialty: 'Grid Trading', avatar: null, status: 'online' }
                  ].map((friend) => (
                    <div key={friend.id} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {friend.avatar ? (
                            <img 
                              src={friend.avatar} 
                              alt={friend.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{friend.name}</p>
                        <p className="text-xs text-gray-400 truncate">{friend.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Empty state if no friends */}
                <div className="hidden text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">{language === 'en' ? 'No friends connected yet' : 'Nenhum amigo conectado ainda'}</p>
                  <button
                    onClick={() => navigate('/dashboard?section=users')}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {language === 'en' ? 'Find users to connect' : 'Encontrar usuários para conectar'}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium">Profile Photo</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {language === 'en' ? 'Upload a photo to make your profile more personal' : 'Faça upload de uma foto para personalizar seu perfil'}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                      {language === 'en' ? 'Upload New' : 'Fazer Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      >
                        {language === 'en' ? 'Remove' : 'Remover'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  {t('profile.email')}
                </label>
                <div className="mt-1 flex items-center space-x-2 px-3 py-2 bg-gray-900 rounded-md">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{profile.email}</span>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  {t('profile.phone')}
                </label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+55 (11) 98765-4321"
                  />
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  {t('profile.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'Enter your name' : 'Digite seu nome'}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  {t('button.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('profile.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}