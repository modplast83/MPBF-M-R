#!/usr/bin/env python3
import json

# Read the Arabic JSON file
with open('client/src/locales/ar.json', 'r', encoding='utf-8') as f:
    content = f.read()
    data = json.loads(content)

# Add the missing translation keys to the sidebar section
if 'sidebar' in data:
    # Add the missing keys at the beginning of the sidebar section
    sidebar = data['sidebar']
    new_sidebar = {
        'version': 'الإصدار 2.0',
        'copyright': '© 2025 البلاستيك الحديث',
        'company_logo_alt': 'مصنع أكياس البلاستيك الحديث'
    }
    # Merge with existing keys
    new_sidebar.update(sidebar)
    data['sidebar'] = new_sidebar

# Write the updated JSON back to the file
with open('client/src/locales/ar.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully added missing translation keys to Arabic JSON file")