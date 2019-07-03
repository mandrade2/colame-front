export default function authAssistant({
  next,
  router,
}) {
  if (!localStorage.getItem('JWT-assistant')) {
    return router.push({
      name: 'assistant',
    });
  }

  return next();
}
