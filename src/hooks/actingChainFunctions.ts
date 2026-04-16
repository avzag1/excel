import { chromium, Locator, Page, BrowserContext } from 'playwright';
import {ActionFunctionType} from '../types/actionFunctionType';
import {LocatorWithTagAndSelectorType} from '../types/locatorWithTagAndSelectorType';
import {GetByRoleWithTagType} from '../types/getByRoleWithTagType';
import {LocatorWithLabelType} from '../types/locatorWithLabelType';
import {Action} from '../types/action';
import path from 'path';
import { ActDetailsType } from '../types/actDetailsType';

export async function lounchBrauser () {
  const browser = await chromium.launchPersistentContext(`${process.env.USER_DATA_DIR}`, {
      executablePath: `${process.env.BROWSER_LAUNCH_PATH}`,
      headless: false, // Обязательно false для работы расширений
      args: [
        // `--disable-extensions-except=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH},${process.env.EXT_GU_PATH}`,
        // `--load-extension=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH},${process.env.EXT_GU_PATH}`
        `--disable-extensions-except=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH}`,
        `--load-extension=${process.env.EXT_CP_PATH},${process.env.EXT_GOV_PATH}`
      ],
  });
  if (browser) {
    const page = await browser.newPage();
    console.info('\nСтраница создана\n');
    return page;
  } else {
    throw new Error('\nНе удалось создать страницу\n')
  }
}

export async function pageSetting(page: Page) {
  if (page) {
    await page.setViewportSize({ width: 1200, height: 1000 })
    await page.goto(`${process.env.ZAKUPKI_WELCOME_URL}`);
    await page.waitForTimeout(3000);
    console.info('Страница настроена\n');
    return page;
  } 
}

export async function clickButtonByLocator (
   page: Page,
   buttonName: string,
   startUrl: string,
   urlIncludes: string,
   selector: string,
   nextUrl: string,
   action: Action,
   uploadFileNames: string[],
  ) {
  console.info(`Пробуем нажать кнопку ${buttonName} на странице ${startUrl}`);
  await page.waitForURL(url => url.href.includes(urlIncludes), { timeout: 0 });
  const btn = page.locator(selector);
  await btn.first().waitFor();
  const count = await btn.count();
  console.info(`Найдено кнопок ${buttonName} - ${count}`);
  let clickedbtn = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await btn.click({ timeout: 3000 });
      clickedbtn = true;
      break;
    } catch (error) {      
      if (attempt < 5 && page.url() !== nextUrl) {
        console.info(`Попытка ${attempt} не удалась`);
        console.info(page.url());
        await page.waitForTimeout(3000);
        console.info(`Найдено кнопок ${buttonName} - ${count}`);
      } else {
        break;
      }
    }
  }
  if (!clickedbtn && page.url() !== nextUrl) {
    console.info(page.url());
    throw new Error(`Не удалось кликнуть по кнопке ${buttonName} на странице ${startUrl} за 5 попыток`);
  }
  console.info(`Нажата кнопка ${buttonName} на странице ${startUrl}`);
}

export const action: ActionFunctionType = async (
   page,
   buttonName,
   startUrl,
   urlIncludes,
   nextUrl,
   handler,
   action,
   locatorWithTagAndSelectorProps?: LocatorWithTagAndSelectorType,
   locatorWithLableProps?: LocatorWithLabelType,
   getByRoleWithTagProps?: GetByRoleWithTagType,
   act?: ActDetailsType,
   getByTextExact = true
  ) => {
    if (page) {
      console.info(`Пробуем нажать кнопку ${buttonName} на странице ${startUrl}`);
      let btn: Locator | undefined;
    
      await page.waitForURL(url => url.href.includes(urlIncludes), { timeout: 0 });
      switch (handler) {
        case 'LocatorWithTagAndSelector':
            const addFilters = (btn: Locator) => {
              if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.textFilters) {
                for (let i = 0; i < locatorWithTagAndSelectorProps.textFilters.length; i++) {
                  btn = btn.filter({ hasText: locatorWithTagAndSelectorProps.textFilters[i] })
                }
                console.info('Применяем фильтры', locatorWithTagAndSelectorProps.textFilters);
              }
              return btn;
            }
            const addTagIndex = (btn: Locator) => {
              if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.tagIndex !== undefined) {
               btn = btn.nth(locatorWithTagAndSelectorProps.tagIndex);
               console.info('Применяем индекс', locatorWithTagAndSelectorProps.tagIndex);
              }
              return btn;
            }  
          if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.tag && locatorWithTagAndSelectorProps.selector) {
            console.info('Выбран обработчик LocatorWithSelector с тегом');
            btn = page.locator(`${locatorWithTagAndSelectorProps.tag}.${locatorWithTagAndSelectorProps.selector}`);
            btn = addTagIndex(btn);
            btn = addFilters(btn);
          } 
          else if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.selector && !locatorWithTagAndSelectorProps.tag) {
            console.info('Выбран обработчик LocatorWithSelector без тега');
            btn = page.locator(`.${locatorWithTagAndSelectorProps.selector}`);
            btn = addTagIndex(btn);
            btn = addFilters(btn);
          } 
          else if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.tagIndex !== undefined && locatorWithTagAndSelectorProps.tag) {
            console.info('Выбран обработчик LocatorWithSelector с индексом тега');
            btn = page.locator(`${locatorWithTagAndSelectorProps.tag}`, { hasText: buttonName });
            btn = addTagIndex(btn);
            btn = addFilters(btn);
            console.info('Добавлен индекс', locatorWithTagAndSelectorProps.tagIndex);
            console.info('btn не равно undefined', btn !== undefined);
            console.info(btn);
            const text = await btn.textContent();
            console.info(`\n------------Кнопка для загрузки: ${text}-------------\n`)
          } else {
            throw new Error('Не хватает аргументов для выполнения функции')
          }
          break;

        case 'LocatorWithLabel':
          console.info('Выбран обработчик LocatorWithLabel');
          if (locatorWithLableProps && locatorWithLableProps.lable && buttonName) {
          btn = page.locator(`[${locatorWithLableProps.lable}=${buttonName}]`);
          } else {
            throw new Error('Не хватает аргументов для выполнения функции')
          }      
          break;

        case 'GetByRoleWithTagLevel':
          if (getByRoleWithTagProps && getByRoleWithTagProps.tag && buttonName && getByRoleWithTagProps.tagLevel) {
            console.info('Выбран обработчик GetByRoleWithTag с Level');  
            btn = page.getByRole(getByRoleWithTagProps.tag, { name: buttonName, level: getByRoleWithTagProps.tagLevel });
          }
          else if (getByRoleWithTagProps&& getByRoleWithTagProps.tag && buttonName && !getByRoleWithTagProps.tagLevel) {
            console.info('Выбран обработчик GetByRoleWithTag без Level'); 
            if (getByRoleWithTagProps.ariaLabel) {
              buttonName = getByRoleWithTagProps.ariaLabel;
            }
            btn = page.getByRole(getByRoleWithTagProps.tag, {name: buttonName});
          }
          else {
            throw new Error('Не хватает аргументов для выполнения функции')
          }
          break;

        case 'GetByText':
          console.info('Выбран обработчик GetByText');
          if (buttonName && getByTextExact) {
            btn = page.getByText(buttonName, { exact: getByTextExact });
          } else {
            throw new Error('Не хватает аргументов для выполнения функции')
          }
          break;

        default:
          console.info("Не удалось подобрать обработчик")
        }
    
      console.info(`Ожидаем появление элемена ${buttonName} на странице`);
      if (btn) {
        if (locatorWithTagAndSelectorProps && locatorWithTagAndSelectorProps.tagIndex !== undefined) {
          await btn.waitFor();
          console.info('Кнопка найдена');
        } else {
          await btn.first().waitFor();
        }
          const count = await btn.count();
          console.info(`Найдено ${action === 'Click' ? 'кнопок' : 'полей для загрузки файлов'} ${buttonName} - ${count}`);
          // await btn.scrollIntoViewIfNeeded();
        }
        let actionIsDone = false;
        for (let attempt = 1; attempt <= 5; attempt++) {
          try {
            console.info(`Попытка № ${attempt}`);
            if (btn && action === 'Click') {
              // await btn.scrollIntoViewIfNeeded();
              await btn.first().click({ timeout: 3000 });
              actionIsDone = true;
              console.info('Кнопка нажата', actionIsDone);
            }
            else if (btn && action === 'UploadFile' && act && act.actFileNames && act.actFileNames.length > 0) {
                console.info('Берем аттрибут inputId');
                const inputId = await btn.getAttribute('for');
                console.info('inputId', inputId);
                const texts = await btn.evaluateAll(elements => elements.map(el => el.textContent));
                console.info(texts);
                console.info('Загружаем файлы в цикле');
                for (let i=0; i<act.actFileNames.length; i++) {
                  console.info('Зашли в цикл');
                  await btn.scrollIntoViewIfNeeded();
                  const fileChooserPromise = page.waitForEvent('filechooser');
                  console.info('Зарядили промис');
                  await btn.scrollIntoViewIfNeeded();
                  await btn.dispatchEvent('click');
                  console.info('Виртуальные клик выполнен');
                  const fileChooser = await fileChooserPromise;
                  console.info('Промис разрешен');
                  const fullPath = path.join(`${process.env.ACTS_PATH}`, act.actFileNames[i]);
                  console.info('fullPath = ', fullPath);
                  console.info('act.actFileNames[i] = ', act.actFileNames[i]);
                  await fileChooser.setFiles(fullPath, { timeout: 3000 });
                  await page.waitForTimeout(2000);
                }
              
              actionIsDone = true;
              console.info('Фалы загружены', actionIsDone);
            } else {
              console.info('Не сработало ни одно условие');
              btn && action === 'UploadFile' && act && act.actFileNames && act.actFileNames.length > 0
              console.info('btn && action === UploadFile', btn && action === 'UploadFile');
              console.info('act', act);
              console.info('act.actFileNames', act && act.actFileNames);
              console.info('act.actFileNames.length > 0', act && act.actFileNames && act.actFileNames.length > 0);
            }
            
            break;
          } catch (error) {      
            if (attempt < 5 && !page.url().includes(nextUrl) ) {
              console.info(`Попытка ${attempt} не удалась`);
              console.info(page.url());
              await page.waitForTimeout(3000);
              // console.info(`Найдено кнопок ${buttonName} - ${count}`);
            } else {
              break;
            }
          }
        }
        if (!actionIsDone && !page.url().includes(nextUrl)) {
          console.info(page.url());
          throw new Error(`Не удалось кликнуть по кнопке ${buttonName} на странице ${startUrl} за 5 попыток`);
        }
        if (btn && buttonName && buttonName.includes('список')) {
          const menuTexts = await btn.evaluateAll(elements => elements.map(el => el.textContent));
          console.info(menuTexts);
        }
        console.info(`Нажата кнопка ${buttonName} на странице ${startUrl}\n`);
      }
      return page;
    }
