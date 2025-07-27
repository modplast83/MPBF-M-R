import fs from 'fs';

// Read the Arabic JSON file
const content = fs.readFileSync('client/src/locales/ar.json', 'utf8');
const data = JSON.parse(content);

// Add the missing translation keys to the sidebar section
if (data.sidebar) {
  // Add the missing keys at the beginning of the sidebar section
  const sidebar = data.sidebar;
  const newSidebar = {
    version: 'الإصدار 2.0',
    copyright: '© 2025 البلاستيك الحديث', 
    company_logo_alt: 'مصنع أكياس البلاستيك الحديث',
    ...sidebar
  };
  data.sidebar = newSidebar;
}

// Write the updated JSON back to the file
fs.writeFileSync('client/src/locales/ar.json', JSON.stringify(data, null, 2), 'utf8');

console.log("Successfully added missing translation keys to Arabic JSON file");