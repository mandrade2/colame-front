export default function authCompany({
  next,
  router,
}) {
  if (!localStorage.getItem('JWT-company')) {
    return router.push({
      name: 'company',
    });
  }

  return next();
}
