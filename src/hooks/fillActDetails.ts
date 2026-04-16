import {Worksheet, Row, Cell} from 'exceljs';
import { ActDetailsType } from '../types/actDetailsType';

export function fillActDetails(
  act: ActDetailsType,
  label: string,
  worksheet: Worksheet,
  row: Row,
  cell: Cell
) {
    if (act.actFileNames) {
    if (label.includes('Исполнитель')) {
    act.performer = label.replace(/^.*(?=ООО)/, "").trim();
    }
    if (label === 'дата') {
    const contractDateCell = row.getCell(cell.col + 1);
    act.contractDate = contractDateCell.text || '';
    }
    if (label === 'ВСЕГО по акту') {
    // Защита: если ячейка справа пустая, ставим 0
    const amountCell = row.getCell(cell.col + 2);
    const amount = amountCell.value !== null ? amountCell.result : 0;
    act.totalAmount = Math.round(Number(amount) * 100) / 100;
    }
    if (label === 'Дата составления') {
    const nextRowNumber = row.number + 1;
    const actDateCell = worksheet.getRow(nextRowNumber).getCell(cell.col);
    act.actDate = actDateCell.text || '';
    }
    if (label === 'с') {
    const nextRowNumber = row.number + 1;
    const startWorkDateCell = worksheet.getRow(nextRowNumber).getCell(cell.col);
    act.startWorkDate = startWorkDateCell.text || '';
    }
    if (label === 'по') {
    // Защита: берем следующую строку через worksheet.getRow
    const nextRowNumber = row.number + 1;
    const endWorkDateCell = worksheet.getRow(nextRowNumber).getCell(cell.col);
    act.endWorkDate = endWorkDateCell.text || '';
    }
}
}