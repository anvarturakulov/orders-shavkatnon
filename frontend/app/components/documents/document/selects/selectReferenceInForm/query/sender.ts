import { ReferenceModel, TypePartners, TypeReference, TypeSECTION } from "@/app/interfaces/reference.interface"
import { DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from "@/app/context/app.context.interfaces";
import { UserRoles } from "@/app/interfaces/user.interface";


export const sender = (item: ReferenceModel, type: string): boolean => {
    if (type == 'sender') {
        return item.refValues?.typeSection == TypeSECTION.FILIAL
    }
    return false
}

