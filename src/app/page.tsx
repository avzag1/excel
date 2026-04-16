import Image from "next/image";
import { chromium, Page, BrowserContext } from 'playwright';
import { lounchBrauser, pageSetting, action } from '../hooks/actingChainFunctions';
import { ActDetailsType } from "../types/actDetailsType";
import {createActsArray} from '../hooks/createActsArray';
import {newAct} from '../hooks/newAct';

export default function Home() {
  // Настройки с фронта
  const directoryPath = `${process.env.ACTS_PATH}`;
  const address = 'Респ Марий Эл, г.о. город Йошкар-Ола, с Семеновка';
  const productDescription = 'площадь 28 кв.м, централизованное холодное водоснабжение';
  const operationName = 'Частичное выполнение работ';
  let actsArray: ActDetailsType[] = [];

  async function createNewActsOnSite() {

    actsArray = await createActsArray (directoryPath, address, productDescription, operationName);
    console.info('Получены сведения об актах', actsArray);

    const page = await lounchBrauser();

    await pageSetting(page);

    // await page.waitForTimeout(3000);

    await action(
      page,
      'Продолжить работу',
      `${process.env.ZAKUPKI_WELCOME_URL}`,
      'zakupki.gov',
      'https://zakupki.gov.ru/auth/welcome',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'color-btn'}
    );

    console.info('Выберите ЭЦП\n');

    console.info('Проверяем, доступна ли кнопка с названием фирмы');
    // await page.waitForTimeout(15000);
    const company = actsArray[0].performer?.replace('ООО', 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ');
    const companyButton = await page.getByText(company || '', { exact: true });
    try {
      await companyButton.waitFor({timeout: 60000});
    } catch (error) {
      console.error('Кнопка с названием фирмы не доступна');
    }
    if (!companyButton || await companyButton.count() < 1) {
      await action(
        page,
        'Электронная подпись',
        'https://esia.gosuslugi.ru/login/',
        'esia',
        'https://esia.gosuslugi.ru/login/',
        'GetByRoleWithTagLevel',
        'Click',
        undefined,
        undefined,
        {tag: 'button', ariaLabel: 'Эл. подпись'},
        undefined
      );

      await action(
        page,
        'Продолжить',
        'https://esia.gosuslugi.ru/login/',
        'esia',
        'https://esia.gosuslugi.ru/login/',
        'GetByRoleWithTagLevel',
        'Click',
        undefined,
        undefined,
        {tag: 'button'},
        undefined
      );
    

      await action(
        page,
        actsArray[0].performer,
        'https://esia.gosuslugi.ru/login/',
        'gosuslugi',
        'https://eruz.zakupki.gov.ru/auth',
        'GetByRoleWithTagLevel',
        'Click',
        undefined,
        undefined,
        {tag: 'heading', tagLevel: 3},
        undefined
      );

      if (page) {
      await page.waitForURL(url => url.href.includes('esia'), { timeout: 0 });
      console.info('Госуслуги загрузились');
    }

      console.info('Введите пароль');
    } 

    

        // await action(
        //   page,
        //   'Электронная подпись',
        //   'https://esia.gosuslugi.ru/login/',
        //   'esia',
        //   'https://esia.gosuslugi.ru/login/',
        //   'GetByRoleWithTagLevel',
        //   'Click',
        //   undefined,
        //   undefined,
        //   {tag: 'button', ariaLabel: 'Эл. подпись'},
        //   undefined
        // );

        // await page.waitForTimeout(2000);
      // const notNeedToRepeat = await page.getByText('Продолжить', { exact: true });
      // const needToRepeat = await page.getByText('Электронная подпись', { exact: true })
      // if (!await page.getByText('Продолжить', { exact: true })) {
      //   console.info('Жмем конопку Электронная подпись')
      //   await action(
      //   page,
      //   'Электронная подпись',
      //   'https://esia.gosuslugi.ru/login/',
      //   'esia',
      //   'https://esia.gosuslugi.ru/login/',
      //   'GetByRoleWithTagLevel',
      //   'Click',
      //   undefined,
      //   undefined,
      //   {tag: 'button', ariaLabel: 'Эл. подпись'},
      //   undefined
      //   );
      // }

      // await action(
      //   page,
      //   'Продолжить',
      //   'https://esia.gosuslugi.ru/login/',
      //   'esia',
      //   'https://esia.gosuslugi.ru/login/',
      //   'GetByRoleWithTagLevel',
      //   'Click',
      //   undefined,
      //   undefined,
      //   {tag: 'button'},
      //   undefined
      // );

      // await action(
      //   page,
      //   actsArray[0].performer,
      //   'https://esia.gosuslugi.ru/login/',
      //   'gosuslugi',
      //   'https://eruz.zakupki.gov.ru/auth',
      //   'GetByRoleWithTagLevel',
      //   'Click',
      //   undefined,
      //   undefined,
      //   {tag: 'heading', tagLevel: 3},
      //   undefined
      // );

      // console.info('Введите пароль для ЭЦП');
      // } else {
      //   console.info('Пропускаем несколько шагов и сразу переходим к воду пароля')
      // }
    // }  

    

    await action(
      page,
      actsArray[0].performer?.replace('ООО', 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ'),
      'https://eruz.zakupki.gov.ru/auth/#/tabs/loginTab',
      'zakupki',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'GetByText',
      'Click',
    );

    if (page) {
      await page.waitForTimeout(3000);
      await page.reload();
      // await page.waitForTimeout(5000);
      console.info('Страница перезагружена и готова к работе\n');
    }

    await action(
      page,
      'Главное меню (список)',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'zakupki',
      'https://eruz.zakupki.gov.ru/entrypoint/app/',
      'LocatorWithTagAndSelector',
      'Click',
      {selector: 'panel-title__text', tag: 'div'}
    );
    console.info('----------------actsArray-----------------', );

    await newAct (page, actsArray);

    return actsArray;
    
    // await browser.close();
  };
  createNewActsOnSite();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          src="/sgLogo.webp"
          alt="sgLogo"
          width={200}
          height={150}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left my-20">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            База завершенных тендеров СМР по РМЭ
          </h1>
          <div></div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Электронное актирование
          </h1>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-grey">
              `Заполнено элекронных актов ${actsArray.length}`
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
