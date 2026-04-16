import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { ActDetailsType } from "../types/actDetailsType";
import {fillActDetails} from './fillActDetails';
import * as XLSX from 'xlsx';
import { error } from 'console';

export async function parseFiles(directoryPath: string) {
    // console.info('Вызов функции parseFiles');
    // const directoryPath = 'C:/Users/user/Desktop/acts/'; 
    const newFileNamesArray: string[] = [];
    const actsArray: ActDetailsType[] = [];

    // 1. Проверяем наличие папки
    if (!fs.existsSync(directoryPath)) return [];

    const filesXls = fs.readdirSync(directoryPath).filter(f => 
        (f.endsWith('.xls')) && !f.startsWith('~$')
    );

    // --- БЛОК КОНВЕРТАЦИИ ---
    for (const fileXls of filesXls) {
      const filePath = path.join(directoryPath, fileXls);
      if (fileXls.endsWith('.xls')) {
        const fileBuffer = fs.readFileSync(filePath);
        const workbookXls = XLSX.read(fileBuffer, { type: 'buffer' });
        const outputBuffer = XLSX.write(workbookXls, { type: 'buffer', bookType: 'xlsx' });
        
        const newFileName = fileXls.replace(/\.xls$/, '.xlsx');
        newFileNamesArray.push(newFileName);
        const tempPath = path.join(directoryPath, newFileName);
        fs.writeFileSync(tempPath, outputBuffer);
      }
    }
    console.info('\n-------------------------\n-------------------------\n-------------------------\nПреобразованные файлы:', newFileNamesArray);

    const files = fs.readdirSync(directoryPath).filter(f => 
        (f.endsWith('.xlsx') && !f.startsWith('~$') && !f.includes('flats.xlsx'))
      );
    console.info('Найдено xlsx-файлов', files.length)

    for (const file of files) {
      let isNewFile: boolean;
      if (newFileNamesArray.includes(file)) {
        isNewFile = true;
        console.info('\nЧитаем преобразованный файл');
      } else {
        isNewFile = false;
        console.info('\nЧитаем неформатированный файл', file);
      }
      const workbook = new ExcelJS.Workbook();
      // console.info('Создаем пустой объект actDetails');
      const actDetails: ActDetailsType = {
            id: '',
            performer: '',
            contractNumber: "",
            contractDate: "",
            actFileNames: [],
            address: '',
            productDescription: 'площадь 28 кв.м, централизованное холодное водоснабжение',
            productNumber: '0',
            totalAmount: 0,
            operationName: 'Частичное выполнение работ',
            actDate: '',
            actNumber: '',
            startWorkDate: '',
            endWorkDate: '',
          }
      
      try { 
        const filePath = path.join(directoryPath, file);
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        if (worksheet) {
          // console.info('Объявляем переменные contractNumber, actNumber, act, label, isKS3, id');
          let contractNumber: string | undefined;
          let actNumber:string | undefined;
          let act: ActDetailsType | undefined;
          let label;
          let isKS3: boolean = false;
          let id: string = '';
          let isNumberFound: boolean = false;
          let isKS3Informed: boolean = false;

          console.info('\nНачинаем читать ячейки в файле', file);
          worksheet.eachRow((row) => {
            row.eachCell((cell) => {
              if(cell && cell.value !== null && cell.value !== undefined){
                label = cell.text ? cell.text.trim() : '';

                if (label.toLowerCase().replace(/\s/g, '').includes('кс-3') && !isKS3Informed) {
                  isKS3 = true;
                  console.info('Это акт КС-3');
                  isKS3Informed = true;
                }
              
                // contractNumber = getContractNumber(label, row, cell, file);
                if (label === 'номер') {
                  // console.info('Ищем номер контракта в документе', file);
                  // console.info('Найдена ячейка с номером контракта. Имя ячейки:', label);
                  const contractNumberCell = row.getCell(cell.col + 1);
                  contractNumber = contractNumberCell.text || '';
                  console.info('contractNumber = ', contractNumber);
                }
                                
                // actNumber = getActNumber(label, row, cell, worksheet, isNewFile, file);
                if (label === 'Номер документа' && !isNumberFound) {
                  // console.info('Ищем номер акта в документе', file);
                  // console.info('Найдена ячейка с номером акта. Имя ячейки:', label);
                  // console.info('Адрес ячейки:', cell.address);
                  let nextRowNumber = row.number + 1;
                  let actNumberCell = worksheet.getRow(nextRowNumber).getCell(cell.col);
                  if (actNumberCell.text === label) {
                    nextRowNumber = row.number + 2;
                    actNumberCell = worksheet.getRow(nextRowNumber).getCell(cell.col);
                  }
                  actNumber = actNumberCell.text || '';
                  console.info('actNumber = ', actNumber);
                  isNumberFound = true;
                }
              }
            });
          });
          
          id = (contractNumber ?? '') + (actNumber ?? '');
          console.info('id = ', id);
          
          const existingAct = actsArray.find(item => item.id === id);
          if (existingAct) {
            act = existingAct;
            console.info('\nИнформация об акте с таким id уже существует');
          } else {
            console.info(`\nОбъект с информацией об акте с id ${id} пока не создан, заполняем новый\n`);
            act = actDetails;
          }
          if (isKS3 && act.actFileNames) {
            act.actFileNames.push(newFileNamesArray.includes(file) 
            ? file.replace(/\.xlsx$/, '.xls') 
            : file);
            console.info(`Добавляем файл кс-3 [[ ${act.actFileNames} ]] и начинаем обработку следующего файла\n`);
            continue;
          }

          if (id && (!act.performer || !act.contractDate || act.totalAmount || act.actDate || act.startWorkDate || act.endWorkDate)) {
            console.info(`Т.к. информация об акте не полная, начинаем повторное чтение файла ${file} и заполнение пустых полей`);
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                if(cell && cell.value !== null && cell.value !== undefined){
                  label = cell.text ? cell.text.trim() : '';
                  fillActDetails(act, label, worksheet, row, cell);
                }  
              });
            });
          }
          
          if (act && act.actFileNames) {
            act.id = id;
            act.actFileNames.push(newFileNamesArray.includes(file) 
            ? file.replace(/\.xlsx$/, '.xls') 
            : file);
            act.contractNumber = contractNumber;
            act.actNumber = actNumber;
            actsArray.push(act);
          }
          console.info(`Обработан файл ${file}. Создан (дозаполнен) новый объект`, act);
          console.info('-----------------------------')
        }

      } catch (e) {
        console.error(`Ошибка в файле ${file}:`, e);
      }
    }

    console.info('Начинаем читать номера квартир');
    const flatFilePath = path.join(directoryPath, 'flats.xlsx');
    if (!fs.existsSync(flatFilePath)) {
      console.info('Неверный путь к flats.xlsx');
      return [];
    } else {
      if (fs.existsSync(flatFilePath)) {
        const flatFile = fs.readdirSync(directoryPath).filter(f => 
          f.includes('flats.xlsx')
        );
        try { 
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(flatFilePath);
          const worksheet = workbook.getWorksheet(1);
          if (worksheet) {
            console.info('\nНачинаем читать ячейки в файле', flatFile);
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                if(cell && cell.value !== null && cell.value !== undefined && cell.value !== 0){
                  let label = cell.text ? cell.text.trim() : '';
                  console.info('Начинаем перебор актов');
                  for (const act of actsArray) {
                    if (label === act.contractNumber) {
                    const productNumberCell = row.getCell(cell.col + 1);
                    act.productNumber = productNumberCell.text || '';
                    console.info(`${act.contractNumber} - ${act.productNumber}`);
                    } else {
                      console.info(label);
                    }
                  }
                }
              })
            })
          }
          console.info('Добавлены номера квартир');
        } catch (e) {
          console.error(`Ошибка в файле ${flatFile}:`, e);
        }
      }
    }

    newFileNamesArray.forEach((newFileName) => {
      const tempPath = path.join(directoryPath, newFileName); 
      if (fs.existsSync(tempPath)) {
        try { 
          fs.unlinkSync(tempPath);
        } catch (e) {
          console.error('Не удалось удалить временный файл');
        }
      }
    })
    // console.info(actsArray);
    return actsArray;
  }