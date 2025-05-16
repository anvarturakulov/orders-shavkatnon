import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEnum} from 'class-validator';
import { RefValues, TypeReference } from "src/interfaces/reference.interface";
import { CreateReferenceValueDto } from "src/refvalues/dto/createReferenceValues.dto";

export class NewClietnDTO {
   
    @ApiProperty({example:'Бекзод ака', description: 'Имя клиента'})
    @IsString({message: 'name - должен быть строкой'})
    name: string;

    @ApiProperty({example:'(90) 504-10-55', description: 'Номер телефона клиента'})
    @IsString({message: 'phone - должен быть строкой'})
    phone: string;
}