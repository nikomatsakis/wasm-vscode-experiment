/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as $wcm from '@vscode/wasm-component-model';

import { example } from './example';

namespace undefined._ {
	export const packages: Map<string, $wcm.PackageType> =  new Map<string, $wcm.PackageType>([
		['example', example._],
	]);
}
export { example };
export default undefined;