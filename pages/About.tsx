
import React from 'react';
import { useStore } from '../context/StoreContext';
import { UI_TEXT } from '../constants';

const About: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'fa';

  const renderBio = () => {
    switch(language) {
      case 'fa':
        return (
          <>
            <p>با بیش از ۱۵ سال سابقه تدریس آکادمیک، آثار من در تقاطع جستجوی دقیق فلسفی و بیان بصریِ بی‌واسطه قرار دارند. استدلال من این است که طراحی گرافیک صرفاً ابزاری برای تجارت نیست، بلکه ساختاری زبانی است که توانایی انتقال حقایق پیچیده متافیزیکی را دارد.</p>
            <p>دارا بودن دو مدرک دکتری در فلسفه غرب و فلسفه هنر به من این امکان را داده است که زیبایی‌شناسی سنتی را واسازی کنم.</p>
          </>
        );
      case 'fr':
        return (
          <>
             <p>Avec plus de 15 ans d'expérience académique, mon travail se situe à l'intersection de l'enquête philosophique rigoureuse et de l'expression visuelle viscérale. Je soutiens que le design graphique n'est pas simplement un outil commercial, mais une structure linguistique capable de transmettre des vérités métaphysiques complexes.</p>
             <p>Mes doubles doctorats en philosophie occidentale et en philosophie de l'art m'ont permis de déconstruire l'esthétique traditionnelle.</p>
          </>
        );
      case 'de':
         return (
           <>
              <p>Mit über 15 Jahren akademischer Erfahrung bewegt sich meine Arbeit an der Schnittstelle von strenger philosophischer Untersuchung und viszeralem visuellen Ausdruck. Ich argumentiere, dass Grafikdesign nicht nur ein Werkzeug für den Handel ist, sondern eine sprachliche Struktur, die komplexe metaphysische Wahrheiten vermitteln kann.</p>
              <p>Meine doppelten Doktortitel in westlicher Philosophie und Philosophie der Kunst haben es mir ermöglicht, die traditionelle Ästhetik zu dekonstruieren.</p>
           </>
         );
      case 'ru':
         return (
           <>
             <p>Имея более 15 лет академического стажа, моя работа находится на пересечении строгого философского исследования и интуитивного визуального выражения. Я утверждаю, что графический дизайн — это не просто инструмент коммерции, а лингвистическая структура, способная передавать сложные метафизические истины.</p>
             <p>Мои две докторские степени по западной философии и философии искусства позволили мне деконструировать традиционную эстетику.</p>
           </>
         );
       case 'tr':
          return (
            <>
               <p>15 yılı aşkın akademik deneyimimle, çalışmalarım titiz felsefi sorgulama ile içgüdüsel görsel ifadenin kesiştiği noktada yer alıyor. Grafik tasarımın sadece ticaret için bir araç olmadığını, karmaşık metafiziksel hakikatleri iletebilen dilsel bir yapı olduğunu savunuyorum.</p>
               <p>Batı Felsefesi ve Sanat Felsefesi alanındaki çifte doktoram, geleneksel estetiği yapısöküme uğratmama olanak tanıdı.</p>
            </>
          );
      default: // en
        return (
           <>
            <p>With over 15 years of academic tenure, my work exists at the intersection of rigorous philosophical inquiry and visceral visual expression. I argue that graphic design is not merely a tool for commerce, but a linguistic structure capable of conveying complex metaphysical truths.</p>
            <p>My dual doctorates in Western Philosophy and the Philosophy of Art have allowed me to deconstruct traditional aesthetics.</p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pt-32 px-4 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-5xl md:text-7xl font-serif mb-12 border-b-2 border-neutral-900 pb-8 ${language === 'fa' ? 'font-vazir' : ''}`}>
          {UI_TEXT.about_artist[language]}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <img 
              src="https://picsum.photos/400/500?grayscale" 
              alt="Portrait" 
              className="w-full h-auto shadow-xl mb-8"
            />
            <div className={`space-y-4 font-serif ${language === 'fa' ? 'font-vazir' : ''}`}>
              <div>
                <h3 className="font-bold text-lg">{UI_TEXT.education[language]}</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>PhD Philosophy of Art (2018)</li>
                  <li>PhD Western Philosophy (2014)</li>
                  <li>MA Graphic Design (2008)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg">{UI_TEXT.contact[language]}</h3>
                <p className="text-sm text-neutral-600">studio@archetype.edu</p>
              </div>
            </div>
          </div>

          <div className={`md:col-span-2 space-y-6 text-lg leading-relaxed text-neutral-700 ${language === 'fa' ? 'font-vazir' : ''}`}>
            {renderBio()}
            
            <div className="mt-12 bg-white p-8 border border-neutral-200 shadow-sm">
               <h3 className="font-serif text-2xl mb-4">{UI_TEXT.awards[language]}</h3>
               <ul className="space-y-3">
                 <li className="flex justify-between border-b border-neutral-100 pb-2">
                   <span>Biennale of Contemporary Thought</span>
                   <span className="text-neutral-400">2023</span>
                 </li>
                 <li className="flex justify-between border-b border-neutral-100 pb-2">
                   <span>Gold Medal, International Design Philosophy</span>
                   <span className="text-neutral-400">2021</span>
                 </li>
                 <li className="flex justify-between border-b border-neutral-100 pb-2">
                   <span>Academic Excellence in Arts Pedagogy</span>
                   <span className="text-neutral-400">2015</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
