import React from 'react';
import { Award, Users, TrendingUp, Heart, Shield, Zap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const About = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Активних користувачів' },
    { icon: TrendingUp, value: '100K+', label: 'Товарів у каталозі' },
    { icon: Award, value: '5 років', label: 'На ринку' },
    { icon: Heart, value: '98%', label: 'Задоволених клієнтів' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Безпека',
      description: 'Гарантуємо безпеку кожної транзакції та захист ваших даних',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Швидка доставка',
      description: 'Доставка по всій Україні від 1 дня через Нову Пошту',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      icon: Award,
      title: 'Якість',
      description: 'Працюємо тільки з перевіреними постачальниками та брендами',
      gradient: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container-main relative z-10">
          <ScrollReveal animation="fadeInUp">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center">
              Про Y-store
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto text-blue-100">
              Український маркетплейс нового покоління. Ми об'єднуємо покупців і продавців, 
              створюючи зручну платформу для онлайн-шопінгу.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-main -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} animation="scaleIn" delay={index * 100}>
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="container-main py-20">
        <ScrollReveal animation="fadeInUp">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Наша історія
            </h2>
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <strong className="text-blue-600">Y-store</strong> – це результат нашої мрії створити найкращий 
                український маркетплейс, який об'єднає тисячі продавців і мільйони покупців на одній платформі.
              </p>
              <p>
                Ми почали в <strong>2020 році</strong> з невеликої команди ентузіастів, які вірили, що онлайн-шопінг 
                може бути простим, безпечним і приємним. Сьогодні ми – одна з найбільших торгових платформ в Україні.
              </p>
              <p>
                Наша місія – <strong className="text-purple-600">робити якісні товари доступними для кожного</strong>, 
                підтримувати малий і середній бізнес, та створювати нові можливості для підприємців по всій країні.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Features Section */}
      <div className="container-main py-20">
        <ScrollReveal animation="fadeInUp">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Чому обирають нас
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} animation="fadeInUp" delay={index * 150}>
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-main py-20">
        <ScrollReveal animation="scaleIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Готові розпочати?
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Приєднуйтесь до тисяч задоволених користувачів Y-store вже сьогодні!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl"
                >
                  Зареєструватися
                </a>
                <a
                  href="/products"
                  className="bg-white/20 backdrop-blur-lg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 border-2 border-white"
                >
                  Переглянути каталог
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;
