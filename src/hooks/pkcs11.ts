import pkcs11js from "pkcs11js";

// Загружаем данные ЭЦП в Крипто Про
  const pkcs11 = new pkcs11js.PKCS11();
  const libPath = "C:/Windows/System32/rtpkcs11ecp.dll";
  pkcs11.load(libPath);
  pkcs11.C_Initialize();
  try {
  // 2. Получаем список доступных слотов (токенов)
    const slots = pkcs11.C_GetSlotList(true);
    const slot = slots[0]; // Берем первый найденный Рутокен
    console.info(slot)

  // 3. Открываем сессию
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_SERIAL_SESSION | pkcs11js.CKF_RW_SESSION);

  // 4. Авторизуемся (ПИН-код пользователя)
    pkcs11.C_Login(session, pkcs11js.CKU_USER, "12345678");

  // 5. Поиск ключа по атрибутам (например, по метке)
    pkcs11.C_FindObjectsInit(session, [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY },
        { type: pkcs11js.CKA_LABEL, value: "MyKeyLabel" } // Замените на вашу метку
    ]);
    const hObject = pkcs11.C_FindObjects(session, 1)[0];
    pkcs11.C_FindObjectsFinal(session);

    if (hObject) {
        console.info("Приватный ключ найден, дескриптор:", hObject);
    }
} catch (err) {
    console.error("Ошибка:");
} finally {
    pkcs11.C_Finalize();
}

  // const context = await browser.newContext({
    // clientNameCertificates: [{
    //   origin: '*',
    //   pfxPath: '\\.\Aktiv Co. ruToken 0\e3aa51d9-4bf2-4e36-a66b-5d7420d169b7',
    //   passphrase: '12345678'
    // }]
  // });