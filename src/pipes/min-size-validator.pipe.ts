import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { throwError } from "rxjs";

@Injectable()
export class MinSizeValidatorPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const minSize = 10000;

        if(value.size < minSize) {
            throw new BadRequestException('El tamaño del archivo es muy pequeño')
        }
        return value
    }
}