import { Schet, TypeQuery } from "src/interfaces/report.interface";
import { OborotsService } from "src/oborots/oborots.service";

export const TDKOL = async (
    schet: Schet | null, 
    typeQuery: TypeQuery | null,  
    startDate: number | null, 
    endDate: number | null,  
    firstSubcontoId: number | null, 
    secondSubcontoId: number | null,
    thirdSubcontoId: number | null,
    oborotsService: OborotsService
) => {

    return (
        await oborotsService.getOborotByDate('COUNT', startDate, endDate, 
                schet, firstSubcontoId, secondSubcontoId, thirdSubcontoId, 
                null, null, null, null)
        ).result
}