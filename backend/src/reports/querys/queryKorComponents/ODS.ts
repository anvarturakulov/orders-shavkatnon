import { Schet, TypeQuery } from "src/interfaces/report.interface";
import { OborotsService } from "src/oborots/oborots.service";

export const ODS = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    firstSubcontoId: number | null, 
    secondSubcontoId: number | null,
    thirdSubcontoId: number | null,
    oborotsService: OborotsService
) => {

    return (
        await oborotsService.getOborotByDate('TOTAL', startDate, endDate, 
                debet, firstSubcontoId, secondSubcontoId, thirdSubcontoId, 
                kredit, null, null, null)
        ).result
}