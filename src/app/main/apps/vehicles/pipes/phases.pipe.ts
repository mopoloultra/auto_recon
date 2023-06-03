import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phases'
})
export class PhasesPipe implements PipeTransform {

  transform(phaseID: any, phases: any[]): string {
    // tslint:disable-next-line:no-shadowed-variable
    const phasesInfo = phases.find(phasesInfo => phasesInfo.id === phaseID);
    return phasesInfo ? phasesInfo.name : '';
  }


}
