import {ClickButtonHandlerType} from './clickButtonHandlerType';
import { Page } from 'playwright';
import {LocatorWithTagAndSelectorType} from './locatorWithTagAndSelectorType';
import {LocatorWithLabelType} from './locatorWithLabelType';
import {GetByRoleWithTagType} from './getByRoleWithTagType';
import {ActDetailsType} from './actDetailsType';
import {Action} from './action';

export type ActionFunctionType = (
     page: Page,
     buttonName: string | undefined,
     startUrl: string,
     urlIncludes: string,
     nextUrl: string,
     handler: ClickButtonHandlerType,
     action: Action,
     locatorWithTagAndSelectorProps?: LocatorWithTagAndSelectorType,
     locatorWithLabelProps?: LocatorWithLabelType,
     getByRoleWithTagProps?: GetByRoleWithTagType,
     actDetails?: ActDetailsType,
     getByTextExact?: boolean
) => Promise<Page | undefined>;