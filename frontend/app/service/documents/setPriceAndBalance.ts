import { docsDependentToMiddlePrice } from '@/app/components/documents/document/doc/helpers/documentTypes';
import { Maindata } from '@/app/context/app.context.interfaces';
import { Schet } from '@/app/interfaces/report.interface';
import axios from 'axios';

export const setPriceAndBalance = (
  mainData: Maindata,
  setMainData: Function | undefined,
  schet: Schet,
  firstSubcontoId: number | undefined,
  secondSubcontoId: number | undefined,
  endDate: number | null,
  forTable: boolean,
  indexTableItem: number
) => {

  let { user } = mainData.users;
  let { currentDocument } = mainData.document;
  let { docTableItems } = currentDocument;
  let { contentName } = mainData.window;

  let currentItem = { ...currentDocument }

  if (!firstSubcontoId) firstSubcontoId=-1;

  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/reports/priceAndBalance' +
    '?&schet=' + schet +'&endDate=' + endDate +
    '&firstSubcontoId=' + firstSubcontoId + 
    '&secondSubcontoId=' + secondSubcontoId;

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  axios.get(url, config)
    .then(function (request) {
      let result = {...request.data};
      if (!forTable) {
        currentItem.docValues.balance = +result?.balance;
        if (docsDependentToMiddlePrice.includes(contentName)) {
          currentItem.docValues.price = result?.price
        }
      } else {
        if (docTableItems && docTableItems?.length > 0) {
          docTableItems[indexTableItem].balance = +result?.balance;
          docTableItems[indexTableItem].price = +result?.price;
        }
      }

      if (setMainData) {
        setMainData('currentDocument', {...currentItem})
      }
    })
    .catch(function (error) {
      
    });
}