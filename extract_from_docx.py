#!/usr/bin/env python3
"""
Скрипт для извлечения блюд из DOCX и добавления новых в TS файл
"""
from docx import Document
import re
import json

def extract_json_from_docx():
    """Извлекает JSON данные из DOCX файла"""
    doc = Document('Меню.docx')
    
    # Объединяем все параграфы в один текст
    full_text = '\n'.join([para.text for para in doc.paragraphs])
    
    # Ищем JSON объекты блюд
    items = []
    
    # Паттерн для поиска объектов блюд
    # Ищем блоки между { и } которые содержат "id" и "name"
    pattern = r'\{\s*["\']?id["\']?\s*:\s*["\']([^"\']+)["\'].*?\}'
    
    # Более простой подход - разберем текст построчно и соберем объекты
    lines = full_text.split('\n')
    current_item = []
    brace_count = 0
    in_item = False
    
    for line in lines:
        if '{' in line or in_item:
            if not in_item and '{' in line:
                in_item = True
                current_item = [line]
                brace_count = line.count('{') - line.count('}')
            elif in_item:
                current_item.append(line)
                brace_count += line.count('{') - line.count('}')
                
                if brace_count <= 0 and '}' in line:
                    # Конец объекта
                    item_text = '\n'.join(current_item)
                    items.append(item_text)
                    current_item = []
                    in_item = False
                    brace_count = 0
    
    return items, full_text

# Извлекаем данные
items, full_text = extract_json_from_docx()

print(f"Найдено потенциальных блюд: {len(items)}")
print("\n=== Первые 3 блюда ===\n")

for i, item in enumerate(items[:3]):
    print(f"Блюдо {i+1}:")
    print(item[:200] + "..." if len(item) > 200 else item)
    print()

# Сохраним полный текст для дальнейшего анализа
with open('menu_from_docx.txt', 'w', encoding='utf-8') as f:
    f.write(full_text)

print(f"\nПолный текст сохранен в menu_from_docx.txt")
