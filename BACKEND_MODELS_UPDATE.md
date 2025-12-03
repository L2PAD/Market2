# Backend Models Update - Rich Content Support

## 📋 Обзор

Обновлены модели Product на бэкенде для поддержки богатого контента из Rich Text Editor и Specifications Editor админ-панели.

## 🔧 Изменения в моделях

### Product Model (`/app/backend/server.py`)

Добавлены следующие поля:

```python
class Product(BaseModel):
    # ... существующие поля ...
    
    # NEW FIELDS FOR RICH CONTENT
    description_html: Optional[str] = None           # HTML контент из Rich Text Editor
    specifications: Optional[List[Dict[str, Any]]] = []  # Характеристики с изображениями
    videos: Optional[List[str]] = []                 # URL видео обзоров
    category_name: Optional[str] = None              # Название категории для удобства
```

### ProductCreate Model

```python
class ProductCreate(BaseModel):
    title: str
    slug: Optional[str] = None  # Теперь опциональный, автоматически генерируется
    description: str
    description_html: Optional[str] = None
    category_id: str
    category_name: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    stock_level: int = 0
    images: List[str] = []
    videos: Optional[List[str]] = []
    specifications: Optional[List[Dict[str, Any]]] = []
    status: str = "published"
```

### ProductUpdate Model

```python
class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    description_html: Optional[str] = None
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    price: Optional[float] = None
    stock_level: Optional[int] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    specifications: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None
```

## 🎯 Структура данных

### Specifications Format

```json
{
  "specifications": [
    {
      "text": "Процесор: Apple M3 Pro",
      "image": "https://images.unsplash.com/photo-123456789"
    },
    {
      "text": "Память: 32GB RAM",
      "image": ""
    }
  ]
}
```

### Description HTML Format

```html
<h2>Характеристики iPhone 15 Pro Max</h2>
<p>Революційний <strong>чіп A17 Pro</strong> для неймовірної продуктивності.</p>
<ul>
  <li>6.7-дюймовий Super Retina XDR дисплей</li>
  <li>48 МП камера з 5x оптичним зумом</li>
</ul>
```

### Videos Format

```json
{
  "videos": [
    "https://www.youtube.com/watch?v=xqyUdNxWazA",
    "https://www.youtube.com/watch?v=example2"
  ]
}
```

## ✅ Тестирование

### Создание товара с богатым контентом

```bash
curl -X POST "${API_URL}/api/products" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro Max",
    "description": "Найпотужніший iPhone",
    "description_html": "<h2>Характеристики</h2><p>Революційний чіп A17 Pro</p>",
    "price": 1199.99,
    "category_id": "...",
    "stock_level": 25,
    "images": ["https://..."],
    "videos": ["https://youtube.com/..."],
    "specifications": [
      {"text": "Чіп A17 Pro", "image": "https://..."},
      {"text": "48 МП камера", "image": "https://..."}
    ]
  }'
```

### Результат тестирования

✅ Товар "iPhone 15 Pro Max" успешно создан:
- description_html: 336 символов
- specifications: 4 записи
- videos: 2 видео
- Все данные корректно сохранены в MongoDB

## 🚀 Использование на фронтенде

Frontend компонент `EnhancedProductDetail.js` обновлён для отображения:

1. **HTML описание** - рендерится через `dangerouslySetInnerHTML`
2. **Характеристики** - отображаются в виде карточек с текстом и изображениями
3. **Видео** - показываются как ссылки для просмотра

## 📝 MongoDB Schema

Новые поля автоматически сохраняются в коллекцию `products`:

```javascript
{
  "_id": ObjectId("..."),
  "id": "90c7d6ec-d4a3-46dd-bee3-88b9f53718c1",
  "title": "iPhone 15 Pro Max",
  "description": "Найпотужніший iPhone",
  "description_html": "<h2>Характеристики...</h2>",
  "specifications": [
    {"text": "...", "image": "..."}
  ],
  "videos": ["https://..."],
  "category_name": "Смартфони",
  // ... остальные поля
}
```

## 🔐 Безопасность

⚠️ **ВАЖНО**: При рендеринге HTML контента на фронтенде используется `dangerouslySetInnerHTML`. Убедитесь, что:
- Только авторизованные админы могут создавать/редактировать товары
- HTML контент санитизируется перед сохранением (рекомендуется добавить)
- На фронтенде используется Content Security Policy

## 📚 Связанные файлы

- Backend: `/app/backend/server.py`
- Frontend Admin: `/app/frontend/src/components/admin/ProductManagement.js`
- Frontend Product Page: `/app/frontend/src/components/product/EnhancedProductDetail.js`
- Rich Text Editor: `/app/frontend/src/components/admin/RichTextEditor.js`
- Specifications Editor: `/app/frontend/src/components/admin/SpecificationsEditor.js`

## ✅ Статус

**ЗАВЕРШЕНО** - Все новые поля полностью интегрированы в бэкенд, фронтенд и MongoDB.
