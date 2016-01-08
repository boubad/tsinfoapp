// main.ts
///
import {Aurelia} from 'aurelia-framework';
//
export function configure(aurelia: Aurelia): void {
	aurelia.use
		.standardConfiguration()
		.developmentLogging()
		.feature('views/resources');
	aurelia.start().then(a => a.setRoot('views/app'));
}
