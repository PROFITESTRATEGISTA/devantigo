import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Zap, Code2, BarChart2, Users, Crown, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguageStore } from '../stores/languageStore';

export function LoggedInFAQPage() {
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const faqCategories = [
    {
      id: 'robots',
      title: t('faq.category.robots'),
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          question: t('faq.robots.q1'),
          answer: t('faq.robots.a1')
        },
        {
          question: t('faq.robots.q2'),
          answer: t('faq.robots.a2')
        },
        {
          question: t('faq.robots.q3'),
          answer: t('faq.robots.a3')
        }
      ]
    },
    {
      id: 'ai',
      title: t('faq.category.ai'),
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      questions: [
        {
          question: t('faq.ai.q1'),
          answer: t('faq.ai.a1')
        },
        {
          question: t('faq.ai.q2'),
          answer: t('faq.ai.a2')
        }
      ]
    },
    {
      id: 'analysis',
      title: t('faq.category.analysis'),
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
      questions: [
        {
          question: t('faq.analysis.q1'),
          answer: t('faq.analysis.a1')
        },
        {
          question: t('faq.analysis.q2'),
          answer: t('faq.analysis.a2')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('faq.title')}
            </h1>
            <p className="text-gray-400">
              {t('faq.subtitle')}
            </p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  {category.icon}
                  <h2 className="ml-3 text-xl font-bold">{category.title}</h2>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="px-6 pb-6 space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-start">
                        <HelpCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed ml-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('faq.notFound')}</h2>
          <p className="text-blue-100 mb-6">
            {t('faq.contact')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const message = t('language') === 'en' 
                  ? "Hello! I have a question about the DevHub Trader platform that I didn't find in the FAQ."
                  : "Olá! Tenho uma dúvida sobre a plataforma DevHub Trader que não encontrei no FAQ.";
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              {t('faq.whatsapp')}
            </button>
            <button
              onClick={() => window.open('mailto:suporte@devhubtrader.com.br', '_blank')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              {t('faq.email')}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium"
            >
              {t('faq.backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}