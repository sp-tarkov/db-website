import { ItemWithLocale } from '../dto/ItemWithLocale';
import { ItemHierarchy } from '../dto/ItemHierarchy';
import { ItemData } from '../dto/ItemData';
import { useGlobalState } from '../state/GlobalState';

const handleFetch = async (url: string, init?: RequestInit | undefined): Promise<any | null> => {
    try {
        const resp = await fetch(url, { ...init, mode: 'cors' })
        if (resp.status === 200) {
            const jsonResponse = await resp.json();
            return jsonResponse !== undefined ? jsonResponse : null;
        } else if (resp.status >= 400) {
            console.warn(resp)
        }
    }catch (e) {
        console.warn(e)
    }
    return null;
}

export const searchItem = async (query: string, locale?: string): Promise<ItemWithLocale[]> =>
    (await handleFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/search`,
        {
            mode: 'cors',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locale ? { query, locale } : { query })
        },
    ))?.items;

export const getItem = async (id: string, locale?: string): Promise<ItemWithLocale | undefined> => {
    let requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/item?id=${id}`;
    if (locale) requestUrl = `${requestUrl}&locale=${locale}`
    return await handleFetch(requestUrl, { mode: 'cors' });
}

export const getItemHierarchy = async (itemData: ItemData, locale?: string): Promise<ItemHierarchy | null> => {
    // Check if we have all the item hierarchy
    const hierarchy: ItemHierarchy = {}
    let currItemID: string | undefined = itemData?._id
    const currentHierarchy = useGlobalState.getState().itemsHierarchy
    let gotAllHierarchy = true
    while (currItemID) {
        if (!(currItemID in currentHierarchy)) {
            gotAllHierarchy = false
            break
        }
        const item: ItemWithLocale = useGlobalState.getState().itemsHierarchy[currItemID]
        hierarchy[item.item._id] = item
        currItemID = item?.item?._parent
    }
    if (gotAllHierarchy) return hierarchy;

    // Otherwise get it
    let requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/item/hierarchy?id=${itemData._id}`;
    if (locale) requestUrl = `${requestUrl}&locale=${locale}`
    return  await handleFetch(requestUrl, { mode: 'cors' });
}

export const getLocaleList = async (): Promise<string[] | null> =>
    await handleFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/locales`,
        { mode: 'cors' },
    );