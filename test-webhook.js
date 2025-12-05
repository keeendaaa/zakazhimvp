// Test script for webhook
const testWebhook = async () => {
  const url = 'https://zakazhi.online/webhook-test/recomendation';
  const testData = {
    tags: ['Бодрящий завтрак', 'Уютное', 'Свежий', 'Итальянская']
  };

  console.log('🧪 Тестирование вебхука...');
  console.log('📍 URL:', url);
  console.log('📦 Данные:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('✅ Статус:', response.status, response.statusText);
    console.log('📋 Заголовки:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка:', errorText);
      return;
    }

    const data = await response.json();
    console.log('📦 Ответ:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Ошибка запроса:', error.message);
    console.error('📚 Детали:', error);
  }
};

// Run test
testWebhook();
