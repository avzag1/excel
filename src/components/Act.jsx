export function Act (act) {
    const filledActs = actsArray.map(act => {
    return(
    <div className="my-5">
      <div>
        <p>Номер контракта: </p><p>${act.contractNumber}</p>
      </div>
      <div>
        <p>Дата контракта: </p><p>${act.contractDate}</p>
      </div>
      <div>
        <p>Номер акта: </p><p>${act.actNumber}</p>
      </div>
      <div>
        <p>Дата акта: </p><p>${act.actDate}</p>
      </div>
      <div>
        <p>Сумма акта: </p><p>${act.totalAmount}</p>
      </div>
      <div>
        <p>Период выполнения работ: с</p><p>${act.startWorkDate}</p><p> по </p><p>${act.endWorkDate}</p>
      </div>
      <div>
        <p>Исполнитель: </p><p>${act.performer}</p>
      </div>
      <div>
        <p>Адрес выполнения работ: </p><p>${act.address}</p>
      </div>
      <div>
        <p>Номер квартиры: </p><p>${act.productNumber}</p>
      </div>
      <div>
        <p>Описание квартиры: </p><p>${act.productDescription}</p>
      </div>
      <div>
        <p>Прикрепленные файлы: </p><p>${act.actFileNames}</p>
      </div>
      <div>
        <p>Наименование операции: </p><p>${act.operationName}</p>
      </div>
    </div>)
  })
  return filledActs;
}