
'use client';

import { useLanguage } from '@/context/language-context';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bn from '@/locales/bn.json';
import te from '@/locales/te.json';
import mr from '@/locales/mr.json';
import ta from '@/locales/ta.json';
import ur from '@/locales/ur.json';
import gu from '@/locales/gu.json';
import kn from '@/locales/kn.json';
import or from '@/locales/or.json';
import ml from '@/locales/ml.json';
import pa from '@/locales/pa.json';
import as from '@/locales/as.json';
import { useCallback } from 'react';

const translations = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  ur,
  gu,
  kn,
  or,
  ml,
  pa,
  as,
};

type TranslationKey = keyof typeof translations.en;

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const useTranslation = (namespace: TranslationKey) => {
  const { language } = useLanguage();
  
  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const translationNamespace = (translations[language] as any)[namespace] || (translations['en'] as any)[namespace];
    let translation = getNestedValue(translationNamespace, key) || `${namespace}.${key}`;

    if (options) {
        Object.keys(options).forEach(k => {
            translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
        });
    }

    return translation;
  }, [language, namespace]);

  return { t };
};
