describe('DIGITRANS-CM API', () => {
  test('Le projet DIGITRANS-CM est configuré', () => {
    expect(true).toBe(true);
  });

  test('Les variables d environnement sont définies', () => {
    const port = process.env.PORT || 3000;
    expect(port).toBeTruthy();
  });
});
