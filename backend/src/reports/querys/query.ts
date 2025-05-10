import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { TDKOL } from './queryComponents/TDKOL';
import { TDSUM } from './queryComponents/TDSUM';
import { TKKOL } from './queryComponents/TKKOL';
import { TKSUM } from './queryComponents/TKSUM';
import { COUNTCOME } from './queryComponents/COUNTCOME';
import { COUNTLEAVE } from './queryComponents/COUNTLEAVE';
import { TOTALCOME } from './queryComponents/TOTALCOME';
import { TOTALLEAVE } from './queryComponents/TOTALLEAVE';
import { StocksService } from 'src/stocks/stocks.service';
import { POKOL } from './queryComponents/POKOL';
import { POSUM } from './queryComponents/POSUM';
import { KOKOL } from './queryComponents/KOKOL';
import { KOSUM } from './queryComponents/KOSUM';
import { OborotsService } from 'src/oborots/oborots.service';

export interface TotalResult {
    total: string | number | null;
}

export const query = async (
    schet: Schet | null,  
    typeQuery: TypeQuery | null,  
    startDate: number | null, 
    endDate: number | null, 
    firstSubcontoId: number | null, 
    secondSubcontoId: number | null,
    thirdSubcontoId: number | null, 
    stocksService:  StocksService,
    oborotsService: OborotsService
): Promise<number> => {

    try {
        
        switch (typeQuery) {
            case TypeQuery.POKOL: 
               return await POKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService) 
            case TypeQuery.POSUM: 
                return await POSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService)
            case TypeQuery.KOKOL: 
                return await KOKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService) 
            case TypeQuery.KOSUM: 
               return await KOSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService)
           
            case TypeQuery.TDKOL: 
                return await TDKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.TDSUM: 
                return await TDSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.TKKOL: 
                return await TKKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.TKSUM: 
                return await TKSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
    
            case TypeQuery.COUNTCOME: 
                return await COUNTCOME(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.COUNTLEAVE: 
                return await COUNTLEAVE(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.TOTALCOME: 
                return await TOTALCOME(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            case TypeQuery.TOTALLEAVE: 
                return await TOTALLEAVE(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService)
            
        }

        // const middleStart = ((typeQuery:TypeQuery | null) => {
        //     switch (typeQuery) {
        //         case TypeQuery.TDKOL: return {...TDKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.TDSUM: return {...TDSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.TKKOL: return {...TKKOL(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.TKSUM: return {...TKSUM(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}

        //         case TypeQuery.COUNTCOME: return {...COUNTCOME(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.COUNTLEAVE: return {...COUNTLEAVE(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.TOTALCOME: return {...TOTALCOME(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //         case TypeQuery.TOTALLEAVE: return {...TOTALLEAVE(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
        //     }
        // })

        return 0


    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}