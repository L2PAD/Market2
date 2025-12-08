import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import ScrollReveal from '../components/ScrollReveal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Дякуємо за звернення! Ми зв\'яжемося з вами найближчим часом.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      details: ['050-247-41-61', '063-724-77-03'],
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['support@y-store.com', 'info@y-store.com'],
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      icon: MapPin,
      title: 'Адреса',
      details: ['проспект Миколи Бажана, 24/1', 'Київ, Україна, 02149'],
      gradient: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="container-main">
        {/* Header */}
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Зв'яжіться з нами
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ми завжди раді допомогти! Залиште нам повідомлення або зателефонуйте
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <ScrollReveal animation="slideInLeft">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Надішліть повідомлення</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-semibold">Ім'я</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Іван Іваненко"
                    className="mt-2 py-3 rounded-xl border-2 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="mt-2 py-3 rounded-xl border-2 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">Телефон</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+380 50 123 45 67"
                    className="mt-2 py-3 rounded-xl border-2 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-semibold">Повідомлення</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ваше повідомлення..."
                    rows={5}
                    className="mt-2 rounded-xl border-2 focus:border-blue-600 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Надсилання...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Надіслати повідомлення
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </ScrollReveal>

          {/* Contact Info Cards */}
          <ScrollReveal animation="slideInRight">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-lg mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Map Preview */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-4 shadow-xl overflow-hidden">
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    title="Наше розташування"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.8355344869385!2d30.62019931574054!3d50.419936679474754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c5c6e3d3b3b3%3A0x1234567890abcdef!2z0L_RgNC-0YHQv9C10LrRgiDQnNC40LrQvtC70Lgg0JHQsNC20LDQvdCwLCAyNC8xLCDQmtC40ZfQsiwg0KPQutGA0LDRl9C90LAsIDAyMTQ5!5e0!3m2!1suk!2sua!4v1234567890123!5m2!1suk!2sua"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* FAQ Section */}
        <ScrollReveal animation="fadeInUp">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-4">Часті запитання?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Можливо, відповідь уже є на нашій сторінці FAQ
            </p>
            <a
              href="/faq"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              Перейти до FAQ
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Contact;
