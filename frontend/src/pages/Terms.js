import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Угода користувача
            </h1>
            <p className="text-xl text-gray-600">
              Публічний договір (оферта) на замовлення, купівлю-продаж і доставку товарів
            </p>
          </div>
        </ScrollReveal>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 space-y-10">
          {/* Introduction */}
          <ScrollReveal animation="fadeInUp">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                Цей договір є офіційною та публічною пропозицією Продавця укласти договір купівлі-продажу Товару, представленого на сайті <strong className="text-blue-600">Y-store</strong>. Даний договір є публічним, тобто відповідно до статті 633 Цивільного кодексу України, його умови є однаковими для всіх покупців незалежно від їх статусу.
              </p>
            </div>
          </ScrollReveal>

          {/* 1. Визначення термінів */}
          <ScrollReveal animation="fadeInUp" delay={100}>
            <section className="border-l-4 border-blue-600 pl-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</span>
                Визначення термінів
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">1.1. Публічна оферта</h3>
                  <p className="text-gray-700">Публічна пропозиція Продавця, адресована невизначеному колу осіб, укласти з Продавцем договір купівлі-продажу товару дистанційним способом на умовах, що містяться в цій Оферті.</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-purple-900 mb-2">1.2. Товар або Послуга</h3>
                  <p className="text-gray-700">Об'єкт угоди сторін, який був обраний покупцем на сайті Інтернет-магазину та поміщений у кошик, або вже придбаний Покупцем у Продавця дистанційним способом.</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-green-900 mb-2">1.3. Інтернет-магазин</h3>
                  <p className="text-gray-700">Сайт Продавця <strong>Y-store</strong> створений для укладення договорів роздрібної та оптової купівлі-продажу на підставі ознайомлення Покупця із запропонованим Продавцем описом Товару за допомогою мережі Інтернет.</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">1.4. Покупець</h3>
                  <p className="text-gray-700">Дієздатна фізична особа, яка досягла 18 років, отримує інформацію від Продавця, розміщує замовлення щодо купівлі товару, що представлений на сайті Інтернет-магазину для цілей, що не пов'язані зі здійсненням підприємницької діяльності, або юридична особа чи фізична особа-підприємець.</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-6">
                  <h3 className="font-bold text-lg text-red-900 mb-2">1.5. Продавець</h3>
                  <p className="text-gray-700">Фізична особа-підприємець Тищенко Олександр Миколайович (ідентифікаційний код 3473114859), місцезнаходження: Полтавська область, Лебенський район, с. Маяківка, вул. Моложіжна, буд. 1</p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* 2. Предмет договору */}
          <ScrollReveal animation="fadeInUp" delay={150}>
            <section className="border-l-4 border-purple-600 pl-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">2</span>
                Предмет договору
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed"><strong className="text-purple-600">2.1.</strong> Продавець зобов'язується передати у власність Покупцю Товар, а Покупець зобов'язується оплатити і прийняти Товар на умовах цього Договору.</p>
                <p className="text-gray-700 leading-relaxed"><strong className="text-purple-600">2.2.</strong> Датою укладення Договору-оферти та моментом повного й беззаперечного прийняттям Покупцем умов Договору вважається дата заповнення Покупцем форми замовлення на сайті Інтернет-магазину.</p>
              </div>
            </section>
          </ScrollReveal>

          {/* 3. Оформлення Замовлення */}
          <ScrollReveal animation="fadeInUp" delay={200}>
            <section>
            <h2 className="text-2xl font-bold mb-4">
              4. {language === 'ru' ? 'Права и обязанности' : 'Права та обов\'язки'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{language === 'ru' ? 'Пользователь обязан предоставлять достоверную информацию' : 'Користувач зобов\'язаний надавати достовірну інформацію'}</li>
              <li>{language === 'ru' ? 'Администрация имеет право изменять условия соглашения' : 'Адміністрація має право змінювати умови угоди'}</li>
              <li>{language === 'ru' ? 'Пользователь несет ответственность за сохранность своих данных для входа' : 'Користувач несе відповідальність за збереження своїх даних для входу'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. {language === 'ru' ? 'Ответственность' : 'Відповідальність'}
            </h2>
            <p className="text-gray-700">
              {language === 'ru'
                ? 'Администрация не несет ответственности за убытки, возникшие в результате использования или невозможности использования сайта.'
                : 'Адміністрація не несе відповідальності за збитки, що виникли внаслідок використання або неможливості використання сайту.'}
            </p>
          </section>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {language === 'ru'
                ? 'Последнее обновление: Декабрь 2024'
                : 'Останнє оновлення: Грудень 2024'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;