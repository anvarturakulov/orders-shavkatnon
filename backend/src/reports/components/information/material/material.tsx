import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { materialItem } from './materialItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { OborotsService } from 'src/oborots/oborots.service';

export const material = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    oborotsService: OborotsService
) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []
    if (data && data.length) {
        filteredData = data.filter((item: Reference) => item?.typeReference == TypeReference.TMZ)
    }

    for (const item of filteredData) {
        let element = await materialItem(data, startDate, endDate, item?.name, item?.id, item?.refValues?.un, oborotsService)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'MATERIAL',
        values : [...result]
    }
} 

