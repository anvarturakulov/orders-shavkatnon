import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { sectionItem } from './sectionItem';
import { Document } from 'src/documents/document.model';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const section = async (
    sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
    data: any,
    startDate: number | null,
    endDate: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES && !item.refValues.markToDeleted)
                            .filter((item: Reference) => {
                                if (sectionType == 'DELIVERY') return item.refValues.typeSection == TypeSECTION.DELIVERY
                                if (sectionType == 'FILIAL') return item.refValues.typeSection == TypeSECTION.FILIAL
                                if (sectionType == 'BUXGALTER') return (item.refValues.typeSection == TypeSECTION.ACCOUNTANT 
                                                                    || item.refValues.typeSection == TypeSECTION.DIRECTOR 
                                                                    || item.refValues.typeSection == TypeSECTION.STORAGE
                                                                )
                                if (sectionType == 'FOUNDER') return item.refValues.typeSection == TypeSECTION.FOUNDER
                                return false
                            })
    }

    for (const item of filteredData) {
        let element = await sectionItem(data, startDate, endDate, item.id, item.name, sectionType, stocksService, oborotsService)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: `SECTION-${sectionType}`,
        values : [...result]
    }
} 

