import { getReferenceById } from '@/app/service/references/getReferenceById';
import { markToDeleteReference } from '@/app/service/references/markToDeleteReference';

export const markToDelete = (id: number | undefined, name: string, token: string | undefined, setMainData: Function | undefined) => {
  markToDeleteReference(id, name, setMainData, token)
}

export const getReference = async (
  id: number | undefined,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  if (id) {
    const reference = await getReferenceById(id, setMainData, token);
    // console.log(reference)
  }
  setMainData && setMainData('isNewReference', false);
}