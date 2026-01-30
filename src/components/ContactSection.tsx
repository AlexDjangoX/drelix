"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { AnimateText, TwoToneHeading } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfoItems = [
  { icon: MapPin, labelKey: 'contact.address' as const, value: 'ul. Emila Zegadłowicza 43\n34-100 Wadowice' },
  { icon: Phone, labelKey: 'contact.phone' as const, value: '+48 123 456 789' },
  { icon: Mail, labelKey: 'contact.email' as const, value: 'kontakt@drelix.pl' },
  { icon: Clock, labelKey: 'contact.hours' as const, valueKey: 'contact.hoursValue' as const },
];

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(t.contact.form.success);

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TwoToneHeading as="h2" className="text-3xl md:text-5xl font-black mb-4">
            <AnimateText k="contact.title" />
          </TwoToneHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <AnimateText k="contact.subtitle" />
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfoItems.map((info, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        <AnimateText k={info.labelKey} />
                      </h4>
                      <p className="text-foreground font-semibold whitespace-pre-line">
                        {'valueKey' in info && info.valueKey ? (
                          <AnimateText k={info.valueKey} />
                        ) : (
                          'value' in info ? info.value : null
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden border border-border shadow-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.5!2d19.4895!3d49.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716900d8dc43f2b%3A0x9c8f5a3f9a0d7c8e!2sul.%20Emila%20Zegad%C5%82owicza%2043%2C%2034-100%20Wadowice%2C%20Poland!5e0!3m2!1sen!2spl!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Drelix Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <AnimateText k="contact.form.name" />
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <AnimateText k="contact.form.email" />
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-secondary/50 border-border focus:border-primary"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <AnimateText k="contact.form.message" />
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                  className="bg-secondary/50 border-border focus:border-primary resize-none"
                  placeholder={t.contact.form.placeholderMessage}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <AnimateText k="contact.form.sending" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={18} />
                    <AnimateText k="contact.form.send" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
