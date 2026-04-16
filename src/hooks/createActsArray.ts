import { ActDetailsType } from "../types/actDetailsType";
import {parseFiles} from './parseFiles';

export async function createActsArray (
     directoryPath: string,
     address: string,
     productDescription: string,
     operationName: string
    ) {
    // console.info('Вызов функции createActsArray');
    const actsArray = await parseFiles(directoryPath);
    // console.info('actsArray', actsArray);
    // await function () {
      for (const act of actsArray) {
        if (act.performer) {
          act.performer = act.performer.toUpperCase();
          act.contractNumber = '№ ' + act.contractNumber;
          act.address = address;
          act.productDescription = productDescription;
          act.operationName = operationName;
        }
      }
    // }();
    return actsArray;
}