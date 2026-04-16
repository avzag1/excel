  // const allContracts: string[] = [];
    // let hasNextPage = true;
    // // while (hasNextPage) {
    // while (act.contractNumber && !allContracts.includes(act.contractNumber)) {
    //   // 1. Собираем контракты с текущей страницы
    //   // Используем очистку текста от лишних пробелов и переносов строк
    //   const pageTexts = await page.locator('span.menu-info__contracts').allTextContents();
    //   allContracts.push(...pageTexts.map(t => t.trim().replace(/\s+/g, ' ')));
  
    //   // 2. Ищем кнопку "Следующая страница" (стрелка вправо)
    //   // В Angular Material это обычно кнопка с классом mdc-button или aria-label
    //   const nextButton = page.locator('button.mat-mdc-paginator-navigation-next, button[aria-label*="Next page"]');
  
    //   // 3. Проверяем, существует ли кнопка и не заблокирована ли она (на последней странице она disabled)
    //   const isVisible = await nextButton.isVisible();
    //   const isDisabled = await nextButton.getAttribute('disabled') !== null;
  
    //   if (act.contractNumber && allContracts.includes(act.contractNumber) && isVisible && !isDisabled) {
    //     console.info(`Собрано ${allContracts.length} контрактов, переходим на следующую страницу...`);
        
    //     await nextButton.click();
        
    //     // 4. Ждем, пока контент обновится (например, пока старый текст исчезнет или появится новый)
    //     // Самый надежный способ - дождаться исчезновения лоадера, если он есть
    //     await page.waitForTimeout(1000); // Базовая задержка, лучше заменить на ожидание лоадера
    //   } else {
    //     console.info('Страница с нужным контрактом найдена');
    //     hasNextPage = false;
    //   }
    // }
    // console.info('Полный список контрактов со всех страниц:\n', allContracts);
  
  // const contracts = await page.locator('div.list-wrapper span.menu-info__contracts').allTextContents();
  // const cleanContracts = contracts.map(text => text.trim());
  // console.info('Список доступных контрактов:\n', cleanContracts);
  // await page.waitForTimeout(30000);

// Загружаем плагины
  // const extCPPath = "C:\\Users\\user\\AppData\\Local\\Chromium\\User Data\\Default\\Extensions\\iifchhfnnmpdbibifmljnfjhpififfog\\1.2.13_0";
  // const extGovPath = "C:\\Users\\user\\AppData\\Local\\Chromium\\User Data\\Default\\Extensions\\jabjbhgjaidecageckilhonbggakppme\\1.3.42.0_0";
  // const extGUPath = "C:\\Users\\user\\AppData\\Local\\Chromium\\User Data\\Default\\Extensions\\pbefkdcndngodfeigfdgiodgnmbgcfha\\1.2.8_1";
  // const userDataDir = 'C:\\Users\\user\\AppData\\Local\\Chromium\\User Data\\Default';
  // const browser = await chromium.launchPersistentContext(userDataDir, {
  //   executablePath: 'C:\\Users\\user\\AppData\\Local\\Chromium\\Application\\chrome.exe',
  //   headless: false, // Обязательно false для работы расширений
  //   args: [
  //     `--disable-extensions-except=${extCPPath},${extGovPath},${extGUPath}`,
  //     `--load-extension=${extCPPath},${extGovPath},${extGUPath}`
  //   ],
  // });

  // browser = await chromium.launchPersistentContext(`${process.env.USER_DATA_DIR}`, {
    //     executablePath: `${process.env.BROWSER_LAUNCH_PATH}`,
    //     headless: false, // Обязательно false для работы расширений
    //     args: [
    //       `--disable-extensions-except=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH},${process.env.EXT_GU_PATH}`,
    //       `--load-extension=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH},${process.env.EXT_GU_PATH}`
    //     ],
    // });
    // const page = await browser.newPage();
    // await page.setViewportSize({ width: 1200, height: 1000 })
    // await page.goto(`${process.env.ZAKUPKI_WELCOME_URL}`);

  // Создаем страницу, задаем размер и переходим на адрес
  // page = await browser.newPage();
  // await page.setViewportSize({ width: 1200, height: 1000 })
  // await page.goto('https://zakupki.gov.ru/auth/welcome');

// await page.locator('tag=button').getByText('Электронная подпись').click();

  // const browser = await chromium.launch({
  //   executablePath: 'C:\\Users\\user\\AppData\\Local\\Chromium\\Application\\chrome.exe',
  //   headless: false
  // });

  // const isLoad = page.waitForURL(url => url.href.includes('esia'), { timeout: 0 });
  // console.info(isLoad);

  // await page.locator(`button:text(${clientName})`).click();

    // await page.getByText(clientName, { exact: false }).click();
//   await page.locator('span.login-tab-participant__name', {
//   hasText: clientName
// }).click();
  // await page.locator(`span:has-text(${clientName})`).click();

// const companyByText = page.getByText('СЕВЕР', { exact: false });
  // const countByText = await companyByText.count();
  // console.info('Найдено элементов с фирмой через ByText', countByText);
  // const companyBySpan = page.locator(`span:has-text('СЕВЕР')`);
  // const countBySpan = await companyBySpan.count();
  // console.info('Найдено элементов с фирмой через spanHasText', countBySpan);
  // const companyByLoginTabParticipant = page.locator('span.login-tab-participant__name', {
  //   hasText: 'ООО СПЕЦИАЛИЗИРОВАННЫЙ ЗАСТРОЙЩИК "СЕВЕР"'
  // });
  // const countByLoginTabParticipant = await companyByLoginTabParticipant.count();
  // console.info('Найдено элементов с фирмой через LoginTabParticipant', countByLoginTabParticipant);
  // const companyBySelector = page.locator('.list-component__element');
  // const countBySelector = await companyBySelector.count();
  // console.info('Найдено элементов с фирмой через Selector', countBySelector);
  // const h1 = page.locator('h1');
  // const countH1 = await h1.count();
  // console.info('Найдено элементов с фирмой через h1', countH1);

  // console.info(page.url());
  // const rows = page.locator('*');
  // for (const row of await rows.all()) {
  //   console.info(await row.textContent());
  // }

  // const elementTypes = await page.evaluate(() => {
  //   // Собираем все элементы
  //   const allElements = document.querySelectorAll('*');
  //   // Извлекаем tagName (тип селектора) для каждого элемента
  //   return Array.from(allElements).map(el => el.tagName.toLowerCase());
  // });
  // console.info(elementTypes);

  // await page.waitForSelector('.login-tab-participant__name');
  // console.log("Ждем селектор login-tab-participant__name");
  // const classes = await page.locator('*').evaluateAll(elements => 
  // elements.map(el => el.className).filter(Boolean)
  // );
  // console.log(classes);

  // const loc = page.locator('.login-tab-participant__name');
  // await loc.first().waitFor(); // Ждем появления хотя бы одного элемента
  // const texts = await loc.evaluateAll(elements => elements.map(el => el.textContent));
  // console.log(texts);

  // const elements = await page.locator('.login-tab-participant__name').evaluateAll(list => list.length);
  // console.log(elements);

  // const frame = page.frame({ name: 'tabs__content' });
  // const selectors = await frame.$$('.login-tab-participant__name');
  // console.log(selectors);

  // try {
  //   company = page.getByText('СЕВЕР', { exact: false });
  //   count = await company.count();
  //   if (count > 0) {
  //     await company.first().click();
  //   }
  // } catch (error) {
  //   console.info('Элемент с фирмой через контекст не найден');
  // }

  // company = page.locator(`span:has-text('СЕВЕР')`);
  // count = await company.count();
  // if (count > 0) {
  //   await company.first().click();
  // } else {
  //   console.info('Элемент с фирмой через locator-span:has-text не найден');
  // }

  // await page.locator('div').filter({ hasText: 'ООО СПЕЦИАЛИЗИРОВАННЫЙ ЗАСТРОЙЩИК "СЕВЕР"' }).click();

    // // рабочий вариант
    // const btn1 = page.locator('label', { hasText: 'Прикрепить файл' }).nth(0);
    // console.info(btn1);
    // const inputId = await btn1.getAttribute('for');
    // console.info('inputId', inputId);
    // const texts = await btn1.evaluateAll(elements => elements.map(el => el.textContent));
    // console.info(texts);
    // const count1 = await btn1.count();
    // console.info('Количество полей для прикрепления файла', count1);
    // await btn1.scrollIntoViewIfNeeded();
    // const fileChooserPromise = page.waitForEvent('filechooser');
    // console.info('Добрались до клика');
    // await btn1.scrollIntoViewIfNeeded();
    // await btn1.dispatchEvent('click');
    // console.info('Клик выполнен');
    // const fileChooser = await fileChooserPromise;
    // console.info('fileChooser определен');
    // await fileChooser.setFiles(`${process.env.FILES_UPLOAD_PATH}`);
  
    
    // console.info('Путь определен');
    // const input = page.locator(`[id="${inputId}"]`);
    // console.info('Найден input по id');
    // await input.dispatchEvent('input');
    // console.info('Вызван dispatchEvent(input)');
    // await input.dispatchEvent('change');
    // console.info('Вызван dispatchEvent(change)');
    // await input.blur();
    // console.info('Вызван blur');
    // await fileChooser.setFiles([]); 
    // await btn1.click({ force: true });