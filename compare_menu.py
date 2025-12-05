#!/usr/bin/env python3
"""
Сравнение меню из TS и DOCX файлов
"""
import re

# Читаем TS файл
with open('src/data/restaurant-menu.ts', 'r', encoding='utf-8') as f:
    ts_content = f.read()

# Извлекаем все ID из TS файла
ts_ids = set(re.findall(r'["\']id["\']\s*:\s*["\'](viva_\d+)["\']', ts_content))

print(f"Блюд в TS файле: {len(ts_ids)}")

# Читаем DOCX текст
with open('menu_from_docx.txt', 'r', encoding='utf-8') as f:
    docx_content = f.read()

# Извлекаем все ID из DOCX
docx_ids = set(re.findall(r'["\']id["\']\s*:\s*["\'](viva_\d+)["\']', docx_content))

print(f"Блюд в DOCX файле: {len(docx_ids)}")

# Найдем ID, которых нет в TS
new_ids = docx_ids - ts_ids
print(f"\nНовых блюд для добавления: {len(new_ids)}")

if new_ids:
    print("\nНовые ID (первые 20):")
    for id in sorted(new_ids)[:20]:
        print(f"  - {id}")

# Найдем блюда с no_image
no_image_matches = re.finditer(r'no_image\.png', docx_content)
no_image_contexts = []
for match in list(no_image_matches)[:10]:
    start = max(0, match.start() - 500)
    end = min(len(docx_content), match.end() + 100)
    context = docx_content[start:end]
    id_match = re.search(r'["\']id["\']\s*:\s*["\'](viva_\d+)["\']', context)
    if id_match:
        no_image_contexts.append(id_match.group(1))

if no_image_contexts:
    print(f"\nБлюда без фото (no_image.png, найдено {len(no_image_contexts)}):")
    for id in no_image_contexts:
        print(f"  - {id}")
