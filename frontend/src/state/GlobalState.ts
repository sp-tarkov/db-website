import { ThemeKeys } from 'react-json-view'
import create from 'zustand'
import { getLocaleList } from '../dataaccess/ItemBackend'
import { LocalStorageKeys, SessionStorageKeys } from '../dataaccess/SaveKeys'
import { ItemHierarchy } from '../dto/ItemHierarchy'
import { ReactJsonViewThemes } from './ReactJsonViewThemes'
import { ThemeMode } from './ThemeMode'
import { ItemWithLocale } from '../dto/ItemWithLocale';

export interface GlobalState {
  sptarkovWebsiteUrl: string
  sptarkovWorkshopUrl: string
  sptarkovDocumentationUrl: string

  preferedLocale: string
  setPreferedLocale: (newLocale: string) => void
  localesList: string[]
  refreshLocalesList: () => void

  preferedJsonViewerTheme: ThemeKeys
  setPreferedJsonViewerTheme: (newJsonTheme: string) => void

  preferedColorScheme: string
  setPreferedColorScheme: (newColorScheme: ThemeMode) => void

  searchInput: string
  setSearchInput: (newInput: string) => void

  desiredSearchInput: string
  setDesiredSearchInput: (newInput: string) => void

  itemsHierarchy: ItemHierarchy
  initHierarchy: () => void
  setHierarchy: (newHierarchy: ItemHierarchy) => void

  selectedItem: ItemWithLocale | undefined
  setSelectedItem: (newSelectedItem: ItemWithLocale | undefined) => void
}

const preferedLocale = localStorage.getItem(LocalStorageKeys.PREFERED_LOCALE)
const storedPreferedJsonTheme = localStorage.getItem(
  LocalStorageKeys.PREFERED_JSON_THEME,
)
const preferedColorScheme = localStorage.getItem(LocalStorageKeys.PREFERED_COLOR_SCHEME)

export const useGlobalState = create<GlobalState>((set) => ({
  sptarkovWebsiteUrl: process.env.REACT_APP_SPTARKOV_HOME ? process.env.REACT_APP_SPTARKOV_HOME : '',
  sptarkovWorkshopUrl: process.env.REACT_APP_SPTARKOV_WORKSHOP ? process.env.REACT_APP_SPTARKOV_WORKSHOP : '',
  sptarkovDocumentationUrl: process.env.REACT_APP_SPTARKOV_DOCUMENTATION ? process.env.REACT_APP_SPTARKOV_DOCUMENTATION : '',

  // Locale
  preferedLocale: preferedLocale ? preferedLocale : 'en',
  setPreferedLocale: (newLocale: string) => {
    localStorage.setItem(LocalStorageKeys.PREFERED_LOCALE, newLocale)
    set((_state) => ({ preferedLocale: newLocale }))
  },
  localesList: [],
  refreshLocalesList: async () => {
    const locales = sessionStorage.getItem(SessionStorageKeys.LOCALES);
    const localesList = locales !== null && locales !== undefined && locales !== 'undefined' && locales !== 'null' ? JSON.parse(locales) : await getLocaleList()
    if (!locales) sessionStorage.setItem(SessionStorageKeys.LOCALES, JSON.stringify(localesList ? localesList : null))
    set((_state) => ({ localesList: localesList ? localesList : [] }))
  },

  // Json viewer theme
  preferedJsonViewerTheme:
    storedPreferedJsonTheme &&
      ReactJsonViewThemes.includes(storedPreferedJsonTheme)
      ? (storedPreferedJsonTheme as ThemeKeys)
      : (ReactJsonViewThemes[0] as ThemeKeys),
  setPreferedJsonViewerTheme: (newJsonTheme: string) => {
    localStorage.setItem(LocalStorageKeys.PREFERED_JSON_THEME, newJsonTheme)
    set((_state) => ({ preferedJsonViewerTheme: newJsonTheme as ThemeKeys }))
  },

  // Prefered theme
  preferedColorScheme: preferedColorScheme
    ? preferedColorScheme
    : ThemeMode.DARK_MODE,
  setPreferedColorScheme: (newColorScheme: ThemeMode) => {
    localStorage.setItem(LocalStorageKeys.PREFERED_COLOR_SCHEME, newColorScheme)
    set((_state) => ({ preferedColorScheme: newColorScheme }))
  },

  // SearchInput
  searchInput: '',
  setSearchInput: (newInput: string) =>
    set((_state) => ({ searchInput: newInput })),
  desiredSearchInput: '',
  setDesiredSearchInput: (newInput: string) =>
    set((_state) => ({ desiredSearchInput: newInput })),

  // Hierarchy
  itemsHierarchy: {},
  initHierarchy: () => {
    const itemsHierarchy = sessionStorage.getItem(SessionStorageKeys.ITEMS_HIERARCHY);
    if (itemsHierarchy !== null && itemsHierarchy !== undefined && itemsHierarchy !== 'undefined') {
      set((_state) => ({ itemsHierarchy: JSON.parse(itemsHierarchy) }))
    }
  },
  setHierarchy: (newHierarchy: ItemHierarchy) => {
    set((state) => {
      const newStateHierarchy = Object.assign({}, state.itemsHierarchy, newHierarchy);
      sessionStorage.setItem(SessionStorageKeys.ITEMS_HIERARCHY, JSON.stringify(newStateHierarchy ? newStateHierarchy : null))
      return ({
        itemsHierarchy: newStateHierarchy,
      })
    });
  },

  // Selected item
  selectedItem: undefined,
  setSelectedItem: (newSelectedItem: ItemWithLocale | undefined) =>
    set((_state) => ({ selectedItem: newSelectedItem })),
}))
