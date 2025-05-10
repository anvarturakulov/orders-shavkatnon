import { Maindata } from '@/app/context/app.context.interfaces';

export type TandirWorkersType = 'firstWorker' | 'secondWorker' | 'thirdWorker'

export const definedTandirWorkers = (id: number | undefined, mainData: Maindata, type: TandirWorkersType | string) => {
  let workers = {...mainData.document.definedTandirWorkers}
  
  if (type == 'firstWorker' && id == workers.firstWorker) return true
  if (type == 'secondWorker' && id == workers.secondWorker) return true
  if (type == 'thirdWorker' && id == workers.thirdWorker) return true

  return false
}