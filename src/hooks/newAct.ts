import { ActDetailsType } from '../types/actDetailsType';
import {action} from './actingChainFunctions';
import { Page } from 'playwright';
import { expect } from '@playwright/test';
import {Act} from '../components/Act';

export async function newAct (page: Page, actsArray: ActDetailsType[]) {

  await action(
      page,
      'Исполнение контрактов',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
  );

  for (const act of actsArray) { 
    
    await action(
      page,
      'Контракты',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    await action(
      page,
      'Закрепляем панель меню',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'header-btn_menu_open'}
    );

    let isFound = false;
    while (!isFound) {
      if (!act.contractNumber) {
        throw new Error('Номер контракта не задан');
      }
      // 1. Получаем список контрактов ТОЛЬКО на текущей странице
      const currentTexts = await page.locator('span.menu-info__contracts').allTextContents();
      // Проверяем, есть ли нужный номер среди них (используем частичное совпадение для надежности)
      const target = currentTexts.find(t => (t ?? '').includes(act.contractNumber!));
      if (target) {
        console.info(`✅ Контракт ${act.contractNumber} найден на текущей странице!`);
        // Кликаем по конкретному элементу, который содержит этот текст
        await page.locator('mat-list-item', { hasText: act.contractNumber }).click();
        isFound = true; // Выходим из цикла
        break; 
      }
      // 2. Если не нашли на этой странице, ищем кнопку "Далее"
      const nextButton = page.locator('button.mat-mdc-paginator-navigation-next, button[aria-label*="Next page"]');
      const isDisabled = await nextButton.getAttribute('disabled') !== null;
      if (!isDisabled) {
        console.info(`Контракта нет на этой странице, переходим дальше...`);
        // Запоминаем текст первого контракта, чтобы понять, когда страница сменится
        const firstBefore = await page.locator('span.menu-info__contracts').first().allTextContents();
        await nextButton.click();
        // Ждем, пока данные обновятся (текст первого элемента должен измениться)
        await expect(page.locator('span.menu-info__contracts').first()).not.toHaveText(firstBefore);
      } else {
        console.error(`❌ Контракт ${act.contractNumber} не найден во всем реестре.`);
        break; // Дошли до конца списка и не нашли
      }
    }

    console.info('Начинаем заполнять акт для контракта', act.contractNumber);
    await action(
      page,
      'Выбираем контракт',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'menu-info__contracts', tag: 'span', textFilters: [`${act.contractNumber}`, `${act.contractDate}`]}
    );

    await page.waitForTimeout(3000);

      await action(
      page,
      'Меню выбора действий с контрактом (список)',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'mat-mdc-button-base', tag: 'button', tagIndex: 8}
    );
    
    await action(
      page,
      'Создать документ о приемке',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    await action(
      page,
      'Прикрепить файл',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'invoice_and_dop',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'LocatorWithTagAndSelector',
      'UploadFile',
      {tag: 'label', tagIndex: 0},
      undefined,
      undefined,
      act
    );

    if (act.actNumber && act.contractNumber) {
      // await page.locator('#mat-input-25').fill(`${act.actNumber}(${act.contractNumber.replace('№ ', '')})${new Date()}`);
      await page.locator('input[maxlength="100"].mat-mdc-input-element.ng-untouched.ng-pristine.ng-valid.mat-mdc-form-field-input-control.mdc-text-field__input.cdk-text-field-autofill-monitored').fill(`${act.actNumber}(${act.contractNumber.replace('№ ', '')})${new Date()}`);
      console.info('Заполнено поле с номером акта');
    } else {
      console.error('Поле с номером акта не заполнено');
    }
    await page.waitForTimeout(2000);
    
    await action(
      page,
      'Контрагенты',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );
    
    await page.waitForTimeout(1000);
    await action(
      page,
      'Добавить',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'zakupki.gov',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'mdc-button__label'}
    );

    await action(
      page,
      'Добавить',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'eacts',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByRoleWithTagLevel',
      'Click',
      undefined,
      undefined,
      {tag: 'button'},
      undefined
    );

    if (act.address) {
      await page.locator('#gar-ref-input').fill(act.address);
      console.info('Заполнено поле с адресом');
      await page.locator('#gar-ref-result li').first().click();
      // await page.locator('#gar-ref-result').locator('li').first().click();
    } else {
      console.error('Поле с адресом не заполнено');
    }

    await action(
      page,
      'Добавить',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'eacts',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByRoleWithTagLevel',
      'Click',
      undefined,
      undefined,
      {tag: 'button'},
      undefined
    );

    await action(
      page,
      'Товары, работы, услуги',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    const myButton = await page.locator('button.mat-mdc-button-base:has(.mdc-button__label:has-text("Добавить"))').nth(2);
    await myButton.waitFor();
    console.info('Кнопка "Добавить" найдена\n');
    await myButton.click();
    // await action(
    //   page,
    //   'Добавить',
    //   'https://eruz.zakupki.gov.ru/eacts/app/',
    //   'zakupki.gov',
    //   'https://eruz.zakupki.gov.ru/eacts/app/',
    //   'LocatorWithTagAndSelector',
    //   'Click',
    //   {selector: 'mat-mdc-button-base > .mdc-button__label', tag: 'button'}
    // );

    // Подсветка
    // await myButton.scrollIntoViewIfNeeded();
    // await myButton.evaluate((node) => {
    //   node.style.border = '10px solid red';
    // });

    // const checkbox = page.locator('input[type="checkbox"]');
    // await page.locator('input#mat-mdc-checkbox-9-input').check();
    await page.locator('div.dialog-container', {hasText: 'Выберите товар, работу, услугу из сведений о контракте'})
      .locator('input.mdc-checkbox__native-control').last().check();
    console.info('Чекбокс обработан\n');

    const myButton2 = page
    .locator('div.additional-information-modal__footer')
    .locator('button.mat-mdc-button-base')
    .filter({ hasText: 'Добавить' });
    await myButton2.waitFor();
    console.info('Кнопка "Добавить" найдена\n');
    await myButton2.click();


    if (act.productDescription && act.address && act.productNumber && act.totalAmount) {
      const descriptionField = await page.locator('textarea[maxlength="2000"]').first();
      await descriptionField.scrollIntoViewIfNeeded();
      await descriptionField.waitFor();
      await descriptionField.scrollIntoViewIfNeeded();
      await descriptionField.fill(act.productDescription);
      console.info('Заполнено поле с характеристиками квартиры', act.productDescription);

      const addressField = await page.locator('textarea[maxlength="1000"]').nth(0);
      await addressField.waitFor({ state: 'attached' });
      await addressField.fill(act.address);
      console.info('\nЗаполнено поле с адресом квартиры');

      const numberField = await page.locator('input[maxlength="19"]');
      await numberField.waitFor();
      await numberField.fill(act.productNumber);
      console.info('\nЗаполнено поле с номером квартиры\n');

      const contractAmount = await page.locator('.form__row', { hasText: 'Цена (тариф) за единицу измерения с НДС' })
      .locator('.form__value.value')
      .textContent() || "";
      console.log('Начальная цена контракта:', contractAmount?.trim());
      const quentity = act.totalAmount / parseFloat(contractAmount.replace(/\s/g, '').replace(',', '.'));
      const quentityField = await page.locator('input[formcontrolname="quantity"]');
      await quentityField.fill(`${quentity}`);
      console.info('Заполнено поле с количеством', quentity);

      await page.waitForTimeout(3000);
      const resultAmount = await page.locator('.form__row', { hasText: 'Стоимость с налогом - всего' })
      .locator('.form__value.value')
      .textContent() || "";
      console.log('Заполненная цена акта:', resultAmount?.trim());
      if (parseFloat(resultAmount.replace(/\s/g, '').replace(',', '.')) !== act.totalAmount) {
        throw new Error(`Заполненная цена акта ${resultAmount} не соответствует реальной цене акта ${act.totalAmount}`)
      } else {
        console.info('Цена акта на сайте соответствует заявленной');
      }
    } else {
      console.error('Поле с номером акта не заполнено');
    }

    const saveDetailsButton = await page.locator('button.mat-mdc-button-base:has(.mdc-button__label:has-text("Сохранить"))').nth(2);
    await saveDetailsButton.waitFor();
    console.info('Кнопка "Сохранить" найдена\n');
    // await saveDetailsButton.scrollIntoViewIfNeeded();
    // await saveDetailsButton.evaluate((node) => {
    //   node.style.border = '10px solid red';
    // });
    await saveDetailsButton.click();

    await page.waitForTimeout(2000);
    await action(
      page,
      'Факт передачи товаров, работ, услуг',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    // await page.waitForTimeout(2000);
    // console.info('Ищем поле "Содержание операции"\n');
    const operationInput = await page.locator('.form__row', { hasText: 'Содержание операции' })
      .locator('input');
    await operationInput.waitFor();
    if (act.operationName) {
      await operationInput.fill(act.operationName);
      console.info('\nЗаполнено поле "Содержание операции"\n');
    }

    const receiveDateInput = await page.locator('.form__row', { hasText: 'Дата передачи товаров (результатов выполненных работ, оказанных услуг)' })
      .locator('input');
    await receiveDateInput.waitFor();
    await receiveDateInput.fill(act.actDate ? act.actDate : '');
    await receiveDateInput.press('Enter');
    console.info('act.actDate = ', act.actDate);
    console.info('Заполнено поле "Дата передачи товаров"\n');

    const startReceiveDateInput = await page.locator('.form__row', { hasText: 'Дата начала периода поставки товаров (выполнения работ, оказания услуг)' })
      .locator('input');
    await startReceiveDateInput.waitFor();
    await startReceiveDateInput.fill(act.startWorkDate ? act.startWorkDate : '');
    await startReceiveDateInput.press('Enter');
    console.info('act.startWorkDate = ', act.startWorkDate);
    console.info('Заполнено поле "Дата начала периода поставки"\n');

    const endReceiveDateInput = await page.locator('.form__row', { hasText: 'Дата окончания периода поставки товаров (выполнения работ, оказания услуг)' })
      .locator('input');
    await endReceiveDateInput.waitFor();
    await endReceiveDateInput.fill(act.endWorkDate ? act.endWorkDate : '');
    console.info('act.endWorkDate = ', act.endWorkDate);
    console.info('Заполнено поле "Дата окончания периода поставки"\n');
    
    // const addPersonButton = page.locator('button[aria-labelledby="mat-mdc-slide-toggle-8-label"]');
    const addPersonButton = page.locator('eacts-shipment-courier-info', {hasText: 'Информация о лице, передавшем товар'})
      .locator('button.mdc-switch.mdc-switch--unselected');
    await addPersonButton.waitFor();
    await addPersonButton.click();
    console.info('Включено поле "Указать сведения о лице, передавшем товар"\n');

    const selectPerson = await page.getByRole('combobox')
      .locator('.mat-mdc-select-trigger').locator('.mat-mdc-select-value').nth(1);
    await selectPerson.waitFor();
    await selectPerson.click();
    const person = await page.locator('mat-option.mat-mdc-option-active');
    await person.waitFor();
    await person.click();
    console.info('Выбран работник, передающий товар\n');

    await action(
      page,
      'Подписанты',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    const addSignatory = await page.locator('.form__content', { 
      has: page.locator('h4', { hasText: /Информация о подписантах/ }) 
    }).locator('button', {hasText: ' Добавить '});
    await addSignatory.waitFor();
    await addSignatory.click();
    console.info('Нажата кнопка "Добавить информацию о подписантах"');

    await page.waitForTimeout(2000);
    const addSignatoryPerson = await page.getByRole('combobox')
      .locator('.mat-mdc-select-trigger').locator('.mat-mdc-select-value').nth(0);
    await addSignatoryPerson.waitFor();
    await addSignatoryPerson.click();
    const signatoryPerson = await page.locator('mat-option.mat-mdc-option-active');
    await signatoryPerson.waitFor();
    await signatoryPerson.click();
    console.info('Выбран работник, подписывающий акт\n');

    const saveSignatory = await page.locator('.mat-horizontal-stepper-content', { 
      has: page.locator('h4', { hasText: /Информация о подписанте/ }) 
    })
    .locator('.form__footer ')
    .locator('button', {hasText: /Сохранить/});
    await saveSignatory.waitFor();
    await saveSignatory.click();
    console.info('Нажата кнопка "Сохранить информацию о подписанте"');

    await page.waitForTimeout(3000);
    await action(
      page,
      'Дополнительные документы',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    await page.waitForTimeout(3000);
    await action(
      page,
      'Подписание',
      'https://eruz.zakupki.gov.ru/eacts/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/eacts/app',
      'GetByText',
      'Click',
    );

    const sendButton = await page.locator('button', {hasText: /Подписать и направить заказчику/});
    await sendButton.waitFor();
    await sendButton.click();
    console.info('Нажата кнопка "Подписать и направить заказчику"');

    const confirmSendCheckbox = await page.locator('div.sign-warning-dialog-container')
      .locator('div.mdc-form-field.mat-internal-form-field')
      .locator('input.mdc-checkbox__native-control');
    await confirmSendCheckbox.waitFor();
    await confirmSendCheckbox.check();
    console.info('Поставлена галочка в чекбоксе подтверждения отправки');

    

    const signAndSendButton = await page.locator('button')
      .filter({ hasText: 'Подписать', visible: true })
      .first();;
    await signAndSendButton.waitFor();
    console.info(`\n\n\n-------------Акт к контракту №${act.contractNumber} загружен в ЕИС-------------\n\n\n`);

    console.info('Найдена кнопка "Подписать"\n');

    await page.waitForTimeout(5000);
    await page.reload();
    console.info('Страница перезагружена. Переходим к новому контракту\n');

    console.info('Пока конец. Функция не дописана.');
  }  
  
}