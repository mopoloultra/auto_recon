import {Injectable} from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {UsersService} from './users.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    logo: any;
    companies: Array<any>;
    companyID: any;
    userCompany: any;
    companyName: any;

    constructor(public usersService: UsersService) {
        this.companyID = this.usersService.getSession('companyInfo').id;
        this.companyName = this.usersService.getSession('companyInfo').name;
        this.companies = this.usersService.getSession('userCompanies');
        this.userCompany = this.companies.filter(type => type['id'] === this.companyID);
        this.logo = 'data:image/png;base64,' + this.userCompany[0].profilePic;


    }


    getChecks(id, name): any {

        let data;

        const resp0 = [
            '',
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            }
        ];

        const resp1 = [
            '',
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            }
        ];

        const resp2 = [
            '',

            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },

            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            }
        ];


        const resp3 = [
            '',
            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },

            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRoge2ZQU4CQRBFX9yCbgRO4h7xAgbiQXRhjDuVA2nkGoocAM+ADmx1XFR1JpHR9LQ2U4t6SacWVHf+SzOzmALHcf7CAJgCL8AGKHe8NsAcuAP6qRJnQNFC+J/WOzBJkfjUA+6BIdBpesg/0AGOgQfN8gGMYzcPqG7iMkO4VK6QTG9AL2bDlOomrPGIZLuNaV5o8zBnokRGSLZ5TPNam7s5EyWyj2QrYprDW8Iqtfn2WgiSBRexhotYw0Ws4SLWcBFruIg1XMQaLmINF7GGi1jDRazhItZwEWvUiay1WvyIfaB16yN2ncir1qNscdIJmZbff6gTmWk9zxYnnQuts1+7lD4yeCyRcZcVrpFMK+AwdtMEGTyWyLhrRDvPTBc4QW4gDENPmx4yRgaPbY+lw1qlSAR6yODxmWokt8tVAE/ADQ3+To7jbPMFrUy4GXIrzQIAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            },

            {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAACfklEQVRoge2ZO2hUQRSGv0SJwTxQkixCQLCwMBCriGUehZ1KYuy0EUsVU4iki25jK9hapUplsmnstLEJMWqjhTFVEERhdRMV1GRTnHO5srnZzMx9jXJ/GAZ2/3Pm/5k7byhQoEAclIAy8ArYBOoZl01gBbgP9LmamARqOYjfq3wDJlxMbGuCJ8Aw0GGbJAF0ACPAvGrZAsZNg0uEPXEnBXGuuIto+gr0mgSUCXvCN1QQbfdMyK+VPJymIkeMItpWTMgbSu5MU5EjuhBtNRNyMEv4ikh9rTkISQWFEd/go5FDSSXKc7BPAqvAQBOOsb68jJwFfmjbt5rwvDbSD6xru4/34XprpAt4o20+B9r24XtppBVY0PbeAUcNYrw08lDb+gKcNIzxzsh1becXshk0hVdGzgG/kcPbVcvYRI0cAOaAa5YiAE4BVW2j7BCfqJFLytkGblqIKAFrGjsHtFjE2uizIt5AztB14IEBvx14ofxl4LCJmBj6rMbIFeRbrwOP2Hvv1gLMKm8dWQBdkdpgvwD81JhZ4GAEZ4bwZHfaIncsfS6z1ijhzUsF+YwCXEbG0h/gvGXeWPpcp98zwGeNfYZsPYaA7/qbzaSQiL4468gg8FHjl4BPhOMnKWS2IJ4A3v+V5ynR48YVma7sx5Ad7VvgSMxcjch8i9IDHE8gTyO82mvFQXGv9U/gvzayobWPl9jdWu+6xI4y8kHrodTkuCPQtNr4R5SRRa1vpybHHVNaLzZlKfqQh8c68tzlC6YRTVVkjTLCBOGhqYLsbvMYM53AGNIDwWPoRdsk48jDY9RTcR6l6mIiQC/y8PiS8Ekuy1JDjsUzWHxOBQoU2I0daphLIAhqTSMAAAAASUVORK5CYII=',
                width: 10,
                opacity: 1
            }
        ];


        if (id === 0) {
            resp0[0] = name;
            data = resp0;
            return data;
        } else if (id === 1) {
            resp1[0] = name;
            data = resp1;
            return data;
        } else if (id === 2) {
            resp2[0] = name;
            data = resp2;
            return data;
        } else if (id === 3) {
            resp3[0] = name;
            data = resp3;
            return data;
        }
        id = '';
    }

    gen(data1: any, data2: any, data3: any, data4: any, data5: any, data6: any, data7: any, data8: any, data9: any, data10: any, color, vehicleData, mileage, VIN, stockNumber): void {

        let body1 = [[{colSpan: 4, bold: true, text: '1. VEHICLE DIAGNOSE', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body2 = [[{colSpan: 4, bold: true, text: '2. VEHICLE HISTORY', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body3 = [[{colSpan: 4, bold: true, text: '3. ROAD TEST', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body4 = [[{colSpan: 4, bold: true, text: '4. VEHICLE EXTERIOR', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body5 = [[{colSpan: 4, bold: true, text: '5. VEHICLE INTERIOR', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body6 = [[{colSpan: 4, bold: true, text: '6. UNDERHOOD', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body7 = [[{colSpan: 4, bold: true, text: '7. UNDERBODY', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body8 = [[{colSpan: 4, bold: true, text: '8. CONVENIENCE', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];

        let body9 = [[{
            colSpan: 4,
            bold: true,
            text: '9. DETAILS AND APPEARANCE',
            color: '#ffffff',
            fillColor: '#000000',
        },
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];

        let body10 = [[{
            colSpan: 4,
            bold: true,
            text: '10. COMPLETE INSPECTION',
            color: '#ffffff',
            fillColor: '#000000',
        },
            '', '', ''],
            [VIN, '', '', ''],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['VIN', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
            ],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Technician Signature', '', '', 'Date'],
            ['I certify that all mechanical items have been inspected', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                }],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Recon Manager Signature', '', '', 'Date'],
            ['I certify that all mechanical and appearance standards have been met', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                }],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Pre-Owned Vehicle Manager', '', '', 'Date'],
            ['I certify that all mechanical and appearance standards have been met', '', '', '']
        ];

        const info1 = body1.concat(data1);
        const info2 = body2.concat(data2);
        const info3 = body3.concat(data3);
        const info4 = body4.concat(data4);
        const info5 = body5.concat(data5);
        const info6 = body6.concat(data6);
        const info7 = body7.concat(data7);
        const info8 = body8.concat(data8);
        const info9 = body9.concat(data9);
        const info10 = body10;


        const docDefinition = {
            pageMargins: [10, 30, 10, 30],
            content: [

                {
                    style: 'text',
                    table: {
                        widths: [290, 280],
                        body: [[
                            [
                                {
                                    image: this.logo,
                                    width: 100,
                                    opacity: 1
                                },

                                {text: '\n'},

                                {
                                    text: 'This inspection is not intended to warrant the condition of any part or system on this vehicle. It is provided only as a review of repairs that may need to be made.',
                                    margin: [0, 0, 0, 20]
                                },

                                {
                                    table: {body: info1}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info3}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info5}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info7, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info9}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                }],

                            [
                                {
                                    margin: [0, 0, 0, 10],
                                    table: {
                                        headerRows: 2,
                                        body: [
                                            [
                                                {
                                                    text: 'Dealership Name:\n' + this.companyName,
                                                    colSpan: 2,
                                                },
                                                {},
                                                {
                                                    text: 'Date Inspected:\n',
                                                },
                                            ],
                                            [
                                                {
                                                    text: 'Year/Make/Model:\n' + vehicleData,
                                                },
                                                {
                                                    text: 'Color:\n' + color,
                                                },
                                                {
                                                    text: 'Mileage:\n' + mileage,

                                                },
                                            ],
                                            [
                                                {
                                                    text: 'Stock Number:\n' + stockNumber,
                                                },
                                                {
                                                    text: 'VIN:\n' + VIN,
                                                },
                                                {
                                                    text: 'R.O. #:\n',

                                                },
                                            ],
                                        ],
                                    }
                                },
                                {
                                    table: {body: info2}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info4, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info6}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info8, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info10}, pageBreak: 'before', margin: [0, 0, 0, 20], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                }]

                        ]
                        ],

                    },
                    layout: 'noBorders'
                },
                {text: 'Technician’s Notes', fontSize: 16, bold: true, margin: [0, 0, 0, 15]},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},


            ],
            footer: function(currentPage, pageCount) { return [{ text: currentPage.toString() , fontSize: 8, margin: [300, 0, 0, 0]}]; },
            styles: {
                text: {
                    fontSize: 8,
                },
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                    fontSize: 10
                },
                tableOpacityExample: {
                    margin: [0, 5, 0, 15],
                    fillColor: 'blue',
                    fillOpacity: 0.3
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {}
        };
        pdfMake.createPdf(docDefinition).download('INSPECTION');
    }


    view(data1: any, data2: any, data3: any, data4: any, data5: any, data6: any, data7: any, data8: any, data9: any, data10: any, color, vehicleData, mileage, VIN, stockNumber): void {

        let body1 = [[{colSpan: 4, bold: true, text: '1. VEHICLE DIAGNOSE', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body2 = [[{colSpan: 4, bold: true, text: '2. VEHICLE HISTORY', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body3 = [[{colSpan: 4, bold: true, text: '3. ROAD TEST', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body4 = [[{colSpan: 4, bold: true, text: '4. VEHICLE EXTERIOR', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body5 = [[{colSpan: 4, bold: true, text: '5. VEHICLE INTERIOR', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body6 = [[{colSpan: 4, bold: true, text: '6. UNDERHOOD', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body7 = [[{colSpan: 4, bold: true, text: '7. UNDERBODY', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];
        let body8 = [[{colSpan: 4, bold: true, text: '8. CONVENIENCE', color: '#ffffff', fillColor: '#000000',},
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];

        let body9 = [[{
            colSpan: 4,
            bold: true,
            text: '9. DETAILS AND APPEARANCE',
            color: '#ffffff',
            fillColor: '#000000',
        },
            '', '', ''],
            ['', {text: 'Passed', fontSize: 7}, {text: 'Failed', fontSize: 7}, {text: 'N/A', fontSize: 7}]];

        let body10 = [[{
            colSpan: 4,
            bold: true,
            text: '10. COMPLETE INSPECTION',
            color: '#ffffff',
            fillColor: '#000000',
        },
            '', '', ''],
            [VIN, '', '', ''],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['VIN', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
            ],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Technician Signature', '', '', 'Date'],
            ['I certify that all mechanical items have been inspected', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                }],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Recon Manager Signature', '', '', 'Date'],
            ['I certify that all mechanical and appearance standards have been met', '', '', ''],
            [{
                text: '\n'
            },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                },
                {
                    text: '\n'
                }],
            [
                {colSpan: 4,
                    text: '................................................................................................................................',
                },
                '', '', ''],
            ['Pre-Owned Vehicle Manager', '', '', 'Date'],
            ['I certify that all mechanical and appearance standards have been met', '', '', '']
        ];

        const info1 = body1.concat(data1);
        const info2 = body2.concat(data2);
        const info3 = body3.concat(data3);
        const info4 = body4.concat(data4);
        const info5 = body5.concat(data5);
        const info6 = body6.concat(data6);
        const info7 = body7.concat(data7);
        const info8 = body8.concat(data8);
        const info9 = body9.concat(data9);
        const info10 = body10;


        const docDefinition = {
            pageMargins: [10, 30, 10, 30],
            content: [

                {
                    style: 'text',
                    table: {
                        widths: [290, 280],
                        body: [[
                            [
                                {
                                    image: this.logo,
                                    width: 100,
                                    opacity: 1
                                },

                                {text: '\n'},

                                {
                                    text: 'This inspection is not intended to warrant the condition of any part or system on this vehicle. It is provided only as a review of repairs that may need to be made.',
                                    margin: [0, 0, 0, 20]
                                },

                                {
                                    table: {body: info1}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info3}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info5}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info7, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info9}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                }],

                            [
                                {
                                    margin: [0, 0, 0, 10],
                                    table: {
                                        headerRows: 2,
                                        body: [
                                            [
                                                {
                                                    text: 'Dealership Name:\n' + this.companyName,
                                                    colSpan: 2,
                                                },
                                                {},
                                                {
                                                    text: 'Date Inspected:\n',
                                                },
                                            ],
                                            [
                                                {
                                                    text: 'Year/Make/Model:\n' + vehicleData,
                                                },
                                                {
                                                    text: 'Color:\n' + color,
                                                },
                                                {
                                                    text: 'Mileage:\n' + mileage,

                                                },
                                            ],
                                            [
                                                {
                                                    text: 'Stock Number:\n' + stockNumber,
                                                },
                                                {
                                                    text: 'VIN:\n' + VIN,
                                                },
                                                {
                                                    text: 'R.O. #:\n',

                                                },
                                            ],
                                        ],
                                    }
                                },
                                {
                                    table: {body: info2}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info4, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info6}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info8, widths: ['auto', 25,20,20]}, margin: [0, 0, 0, 10], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                },
                                {
                                    table: {body: info10}, pageBreak: 'before', margin: [0, 0, 0, 20], layout: {
                                        hLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                                        },
                                        vLineWidth: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                                        },
                                        hLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.body.length) ? 'black' : 'white';
                                        },
                                        vLineColor: function(i, node) {
                                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
                                        },

                                    }
                                }]

                        ]
                        ],

                    },
                    layout: 'noBorders'
                },
                {text: 'Technician’s Notes', fontSize: 16, bold: true, margin: [0, 0, 0, 15]},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},
                {text: '\n...............................................................................................................................................................................'},


            ],
            footer: function(currentPage, pageCount) { return [{ text: currentPage.toString() , fontSize: 8, margin: [300, 0, 0, 0]}]; },
            styles: {
                text: {
                    fontSize: 8,
                },
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                    fontSize: 10
                },
                tableOpacityExample: {
                    margin: [0, 5, 0, 15],
                    fillColor: 'blue',
                    fillOpacity: 0.3
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
            defaultStyle: {}
        };
        pdfMake.createPdf(docDefinition).open();
    }
}
