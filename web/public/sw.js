
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'QuestLoop', body: 'You have a new notification.' };
  event.waitUntil(self.registration.showNotification(data.title || 'QuestLoop', { body: data.body || '', icon: '/icon.png' }));
});
