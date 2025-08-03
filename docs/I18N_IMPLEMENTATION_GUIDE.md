# Internationalization (i18n) Implementation Guide

## Overview

This guide provides a comprehensive plan for implementing internationalization in the DevHub Trader web application, supporting multiple languages, RTL layouts, and locale-specific formatting.

## 🌍 Supported Languages

### Current Implementation
- **English (en)** - Primary language
- **Portuguese (pt)** - Brazilian Portuguese
- **Spanish (es)** - European Spanish
- **Arabic (ar)** - RTL support
- **Hebrew (he)** - RTL support

### Planned Extensions
- **French (fr)**
- **German (de)**
- **Chinese (zh)**
- **Japanese (ja)**

## 📚 Libraries and Tools

### Recommended Libraries

1. **Zustand** (Already implemented)
   - Lightweight state management
   - Persistent locale storage
   - No external dependencies

2. **Intl API** (Native browser support)
   - Date/time formatting
   - Number formatting
   - Currency formatting
   - Relative time formatting

3. **Optional Enhancements**
   ```bash
   npm install react-i18next i18next
   npm install @formatjs/intl-pluralrules
   npm install @formatjs/intl-relativetimeformat
   ```

### Development Tools

1. **Translation Management**
   ```bash
   npm install --save-dev i18next-parser
   npm install --save-dev i18next-scanner
   ```

2. **Validation Tools**
   ```bash
   npm install --save-dev i18n-unused
   npm install --save-dev i18next-icu
   ```

## 🏗️ Architecture

### File Structure
```
src/
├── lib/
│   └── i18n/
│       ├── index.ts          # Main i18n configuration
│       ├── translations.ts   # Translation dictionaries
│       ├── formatters.ts     # Locale-specific formatters
│       └── rtl.ts           # RTL language support
├── components/
│   ├── I18nProvider.tsx     # Context provider
│   ├── LanguageSwitcher.tsx # Language selection
│   └── RTLLayout.tsx        # RTL layout components
├── hooks/
│   └── useI18nHelpers.ts    # Custom i18n hooks
├── styles/
│   └── rtl.css              # RTL-specific styles
└── utils/
    └── i18nUtils.ts         # Utility functions
```

## 🔧 Implementation Steps

### Step 1: Basic Setup

1. **Install the new i18n system**
   ```typescript
   import { useI18n } from './lib/i18n';
   import { I18nProvider } from './components/I18nProvider';
   ```

2. **Wrap your app with I18nProvider**
   ```typescript
   function App() {
     return (
       <I18nProvider>
         <YourAppContent />
       </I18nProvider>
     );
   }
   ```

### Step 2: Text Translation

1. **Use the translation hook**
   ```typescript
   import { useTranslation } from './components/I18nProvider';
   
   function MyComponent() {
     const { t } = useTranslation();
     
     return (
       <div>
         <h1>{t('nav.dashboard')}</h1>
         <p>{t('robot.createFirst')}</p>
       </div>
     );
   }
   ```

2. **Parameterized translations**
   ```typescript
   // Translation: "Welcome {{name}}, you have {{count}} robots"
   const message = t('welcome.message', { 
     name: 'John', 
     count: 5 
   });
   ```

### Step 3: Date/Time Formatting

```typescript
import { useTranslation } from './components/I18nProvider';

function DateDisplay({ date }: { date: Date }) {
  const { formatDate, formatRelativeTime } = useTranslation();
  
  return (
    <div>
      <p>Created: {formatDate(date)}</p>
      <p>Last updated: {formatRelativeTime(date)}</p>
    </div>
  );
}
```

### Step 4: Number Formatting

```typescript
import { useNumberFormatting } from './hooks/useI18nHelpers';

function MetricsDisplay({ profitFactor, winRate, amount }: Props) {
  const { decimal, percentage, currency } = useNumberFormatting();
  
  return (
    <div>
      <p>Profit Factor: {decimal(profitFactor, 2)}</p>
      <p>Win Rate: {percentage(winRate)}</p>
      <p>Amount: {currency(amount, 'BRL')}</p>
    </div>
  );
}
```

### Step 5: RTL Layout Support

```typescript
import { RTLLayout, RTLFlex } from './components/RTLLayout';

function MyRTLComponent() {
  return (
    <RTLLayout>
      <RTLFlex direction="row" justify="between">
        <div>Start content</div>
        <div>End content</div>
      </RTLFlex>
    </RTLLayout>
  );
}
```

## 🎨 CSS and Styling

### RTL-Aware CSS Classes

```css
/* Use logical properties */
.container {
  margin-inline-start: 1rem;  /* Instead of margin-left */
  margin-inline-end: 1rem;    /* Instead of margin-right */
  padding-inline: 1rem;       /* Instead of padding-left/right */
  border-inline-start: 1px solid; /* Instead of border-left */
}

/* RTL-specific overrides */
.dir-rtl .icon-arrow {
  transform: scaleX(-1);
}
```

### Tailwind CSS RTL Support

```typescript
// Use RTL-aware utility classes
const className = `
  ${isRTL ? 'mr-4' : 'ml-4'}
  ${isRTL ? 'text-right' : 'text-left'}
  ${isRTL ? 'flex-row-reverse' : 'flex-row'}
`;
```

## 📝 Translation Management

### Adding New Translations

1. **Add to translation files**
   ```typescript
   // src/lib/i18n/translations.ts
   export const translations = {
     en: {
       'new.feature': 'New Feature',
       'new.description': 'This is a new feature with {{count}} items'
     },
     pt: {
       'new.feature': 'Nova Funcionalidade',
       'new.description': 'Esta é uma nova funcionalidade com {{count}} itens'
     }
   };
   ```

2. **Use in components**
   ```typescript
   const { t } = useTranslation();
   const title = t('new.feature');
   const description = t('new.description', { count: 5 });
   ```

### Translation Validation

```typescript
import { validateTranslations } from './utils/i18nUtils';

// Check for missing translations
const report = validateTranslations(translations);
console.log('Missing translations:', report);
```

## 🔄 Migration Strategy

### Phase 1: Core Components (Week 1)
- [ ] Navbar and navigation
- [ ] Common buttons and actions
- [ ] Error messages and notifications

### Phase 2: Main Features (Week 2)
- [ ] Robot management pages
- [ ] Analysis pages
- [ ] Profile and subscription pages

### Phase 3: Advanced Features (Week 3)
- [ ] RTL layout implementation
- [ ] Additional language support
- [ ] Complex formatting scenarios

### Phase 4: Testing and Optimization (Week 4)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Translation completeness audit

## 🧪 Testing Strategy

### Unit Tests
```typescript
import { renderWithI18n } from './test-utils';

test('renders translated text', () => {
  const { getByText } = renderWithI18n(
    <MyComponent />, 
    { locale: 'pt' }
  );
  
  expect(getByText('Meus Robôs')).toBeInTheDocument();
});
```

### E2E Tests
```typescript
// Test language switching
test('language switcher works', async () => {
  await page.click('[data-testid="language-switcher"]');
  await page.click('[data-testid="lang-pt"]');
  
  await expect(page.locator('h1')).toContainText('Meus Robôs');
});
```

## 📊 Performance Considerations

### Lazy Loading Translations
```typescript
const loadTranslations = async (locale: Locale) => {
  const translations = await import(`./translations/${locale}.json`);
  return translations.default;
};
```

### Bundle Optimization
```typescript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        i18n: {
          test: /[\\/]translations[\\/]/,
          name: 'i18n',
          chunks: 'all',
        },
      },
    },
  },
};
```

## 🚀 Best Practices

### 1. Translation Keys
- Use hierarchical keys: `nav.robots`, `error.network`
- Be descriptive: `robot.createFirst` instead of `create1`
- Group related translations: `action.*`, `status.*`

### 2. Parameterization
```typescript
// Good
t('welcome.message', { name: user.name, count: robots.length })

// Avoid
`Welcome ${user.name}, you have ${robots.length} robots`
```

### 3. Pluralization
```typescript
// Use ICU message format for complex plurals
const message = t('robots.count', { 
  count: robotCount,
  // ICU: "{count, plural, =0 {no robots} =1 {one robot} other {# robots}}"
});
```

### 4. Context-Aware Translations
```typescript
// Different contexts may need different translations
t('action.save', { context: 'robot' })  // "Save Robot"
t('action.save', { context: 'profile' }) // "Save Profile"
```

## 🔍 Debugging and Monitoring

### Translation Coverage Report
```typescript
import { validateTranslations } from './utils/i18nUtils';

const generateReport = () => {
  const report = validateTranslations(translations);
  
  Object.entries(report).forEach(([locale, issues]) => {
    console.log(`${locale}:`);
    console.log(`  Missing: ${issues.missing.length}`);
    console.log(`  Extra: ${issues.extra.length}`);
  });
};
```

### Runtime Translation Monitoring
```typescript
const { t } = useI18n();

// Enhanced t function with fallback logging
const tWithLogging = (key: string, params?: any) => {
  const result = t(key, params);
  
  if (result === key) {
    console.warn(`Missing translation for key: ${key}`);
  }
  
  return result;
};
```

## 📱 Mobile and Responsive Considerations

### RTL Mobile Navigation
```css
@media (max-width: 768px) {
  .dir-rtl .mobile-menu {
    right: auto;
    left: 0;
    transform: translateX(-100%);
  }
  
  .dir-rtl .mobile-menu.open {
    transform: translateX(0);
  }
}
```

### Touch Gestures for RTL
```typescript
// Adjust swipe directions for RTL
const getSwipeDirection = (locale: Locale, direction: 'left' | 'right') => {
  const isRTL = rtlLanguages.includes(locale);
  
  if (isRTL) {
    return direction === 'left' ? 'right' : 'left';
  }
  
  return direction;
};
```

## 🔧 Maintenance and Updates

### Adding New Languages
1. Add locale to type definition
2. Create translation dictionary
3. Add to formatters configuration
4. Update RTL configuration if needed
5. Test thoroughly

### Translation Updates
1. Use version control for translation files
2. Implement translation review process
3. Automate translation validation in CI/CD
4. Monitor translation usage analytics

This comprehensive i18n implementation provides a solid foundation for supporting multiple languages and locales in your trading platform while maintaining performance and user experience.